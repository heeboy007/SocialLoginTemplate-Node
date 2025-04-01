import { google_key } from '../../../util/const.js';
import { OAuth2Client } from 'google-auth-library';
import { validateToken } from '../../validator/authValidator.js';
import { generateJWTToken } from '../../middleware/jwtMiddleware.js';
import { generate6Digits } from '../../../util/unique.js';
import { logger } from '../../../util/logger.js';
import { schemas } from '../../../database/db.js';
import { Op } from 'sequelize';

const client = new OAuth2Client();

// 구글 로그인(idToken)
async function google(req, res) {
    logger.info("API : auth.controller.js : googleIdToken");
    
    //passed validation
    const result = validateToken(req.body);
    if(result.error) {
        return res.status(400).json({ message: "토큰값 검증 실패" });
    }
    //여기서 부터 body의 값을 언패킹합니다.
    const { id_token, access_token } = req.body;

    let google_id, email;
    try {
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: google_key,  // Specify the CLIENT_ID of the app that accesses the backend
        });

        const payload = ticket.getPayload();
        google_id = payload['sub'];
        email = payload['email'];

        if(!google_id){
            return res.status(401).json({ message: "토큰 확인 중 에러" });
        }
    } catch (e) {
        // Handle different types of errors here
        if (e.message.includes('invalid_token')) {
            return res.status(401).json({ message: "토큰 확인 중 에러" });
        } else {
            console.error('Error verifying token', e);
            return res.status(500).json({ message: "토큰 확인 실패" });
        }
    }

    const user = await schemas.User.findOne({ 
        where: { 
            social_media_external_id: google_id, 
            login_method: "google",
            state: { [Op.not]: "closed" }
        }
    });

    if(user) { //기존 구글 로그인 기록이 있음
        const signable = {
            id: user.id, 
            email: user.email,
            login_method: "google",
            social_media_external_id: google_id
        };

        //we may need to update this.
        user.set({
            email: email,
            social_media_external_access_token: access_token
        });

        await user.save();

        const token = generateJWTToken(signable);
        res.status(200).json({ access_token: token });
    } else { //없으니까 만들어서 보냄
        const user = await schemas.User.create({
            nickname: "Tiempo" + generate6Digits(),
            email: email,
            recent_login: new Date(),
            login_method: "google",
            social_media_external_id: google_id,
        })

        const signable = {
            id: user.id, 
            email: user.email,
            login_method: user.login_method,
            social_media_external_id: user.social_media_external_id
        };
        const token = generateJWTToken(signable);
        
        res.status(200).json({ access_token: token });
    }

    return res;
}

export {
    google
}
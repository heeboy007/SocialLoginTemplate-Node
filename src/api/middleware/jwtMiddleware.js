import jwt from 'jsonwebtoken';

import setCookie from './cookieHandler.js';
import { jwt_secret } from '../../util/const.js';

//token for JWT web token(cookie, localStorage)
function generateJWTToken(signable) {
    const token = jwt.sign(
        signable,
        jwt_secret,
        { expiresIn: '1h' }
    );
    return token;
}

const jwtMiddleware = async (req, res, next) => {
    const authHeader = req.headers['Authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) //토큰이 없음 
        return next();
    try {
        const decoded = jwt.verify(token, jwt_secret);
        req.userState = {
            id: decoded.id,
            email: decoded.email,
            login_method: decoded.login_method,
            social_media_external_id: decoded.social_media_external_id
        };
        const now = Math.floor(Date.now() / 1000);
        if(decoded.exp - now < 60 * 5) { //5분 보다 적으면
            setCookie({...(req.userState)}, res);
        }
        //console.log(decoded);
        return next();
    } catch(e) { //검증 실패
        return next();
    }
}

export {
    generateJWTToken,
    jwtMiddleware
};
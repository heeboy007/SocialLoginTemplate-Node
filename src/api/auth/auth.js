
import { OAuth2Client } from 'google-auth-library';
import setCookie from '../../service/middleware/cookieHandler';
import { wrapWithErrorHandler } from '../../service/util/errorHandler';

const client = new OAuth2Client();

// 구글 로그인(idToken)
async function google(req, res) {
    console.log("API : auth.controller.js : googleIdToken");
    
    //passed validation
    const result = validateGoogleToken(req.body);
    if(result.error) {
        return res.status(400).json({ authError: "토큰값 검증 실패" });
    }
    //여기서 부터 body의 값을 언패킹합니다.
    const { token } = req.body;

    let google_id, email, email_verified, profile_image_url;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: googleWebClientKey,  // Specify the CLIENT_ID of the app that accesses the backend
        });

        const payload = ticket.getPayload();
        google_id = payload['sub'];
        email = payload['email'];
        email_verified = payload['email_verified'];
        profile_image_url = payload['picture'];

        console.log("API : auth.controller.js : googleIdToken : " + email);
        if(!google_id){
            return res.status(401).json({ authError: "토큰 확인 중 에러" });
        }
    } catch (e) {
        // Handle different types of errors here
        if (e.message.includes('invalid_token')) {
            return res.status(401).json({ authError: "토큰 확인 중 에러" });
        } else {
            console.error('Error verifying token', e);
            return res.status(500).json({ authError: "토큰 확인 실패" });
        }
    }

    const user = await User.findOne({ where: { google_id, account_login_method: "google" }});
    if(user) { //기존 구글 로그인 기록이 있음
        const profile = await findProfileForSignable(user.id);
        const signable = { id: user.id, email };
        setCookie(signable, res);
        res.status(200).json({ auth: buildProfileInfoForClient(signable, profile) });
    }

    try { //새로 회원가입
        const newUser = await User.create({
            google_id,
            email,
            account_login_method: "google",
        });

        const profile = parseProfileAndSave(newUser.id, { profile_image_url: profile_image_url });
        const signable = { id: newUser.id, email };
        setCookie(signable, res);
        res.status(200).json({ auth: buildProfileInfoForClient(signable, profile) });
    } catch (e) {
        res.status(500).json({ authError: '구글 계정으로 회원가입에 실패하였습니다.' });
    }
    return res;
}

async function check(req, res) {
    //get user from middleware
    const { id } = req.userState;
    if(!id) {
        return res.status(401);
    }
    console.log("API : auth.controller.js : check ok");
    return res.status(200).json({ auth: req.userState });
}

async function logout(req, res) {
    //cookie set
    res.clearCookie('access_token');
    return res.status(204);
}

export default wrapWithErrorHandler({
    check,
    logout,
    google,
});
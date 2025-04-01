import { domain } from "../../util/const.js";
import { generateJWTToken } from "./jwtMiddleware.js";

// will be deprecated if not browser, since it's mobile based.
function setCookie(signable, res){
    //const singable = parseSignable(user, userProfile);
    const token = generateJWTToken(signable);
    res.cookie('access_token', token, {
        maxAge: 1000 * 60 * 60, //1hour
        domain: domain, // Set to your domain
        path: '/', // Set to the root path
        httpOnly: true, // Ensures cookie is not accessible via client-side JavaScript
        secure: true, // Ensures cookie is only sent over HTTPS
        sameSite: 'Strict'
    });
}

export default setCookie;

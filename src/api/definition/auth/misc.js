import { logger } from "../../../util/logger.js";

async function check(req, res) {
    //get user from middleware
    const { id } = req.userState;
    if(!id) {
        return res.status(401).json({ message: "로그인 되어있지 않습니다." });
    }
    logger.info("API : auth.controller.js : check ok");
    return res.status(200).json({ message: "로그인 되어 있습니다." });
}

async function logout(req, res) {
    //cookie set
    res.clearCookie('access_token');
    return res.status(204);
}

export {
    check,
    logout,
};
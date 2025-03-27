
async function ensureLogin(req, res, next){
    try {
        //so request has the id.
        if('userState' in req) {
            if('id' in req.userState) {
                next();
            } else {
                return res.status(401).json({ message: "인증정보가 만료되었습니다." });
            }
        } else {
            return res.status(401).json({ message: "인증정보가 만료되었습니다." });
        }
    } catch (e) {
        return res.status(401).json({ message: "인증정보가 만료되었습니다." });
    }
}

export {
    ensureLogin
};
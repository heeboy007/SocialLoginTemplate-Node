
import wrapWithErrorHandler from "../../util/errorHandler.js";

async function getProfile(req, res) {
    const { id } = req.userState;
    const profile = await UserProfile.findByPk(id);
    if(!profile){
        return res.status(500).json({ profileError: "프로필 불러오기 중 에러가 발생했습니다." });
    }
    console.log("API : user.controller.js : validation error : " + error);
    return res.status(200).json({ profile: profile.dataValues });
}

async function onBoarding(req, res){
    //100% exists
    const { id } = req.userState;
    // try {
    //     //passed validation
    //     const reuslt = validateBodyInfo(req.body);

    //     if(reuslt.error) {
    //         console.log("API : user.controller.js : validation error : " + errorMessage);
    //         return res.status(400).json({ errorMessage: result.error.details[0].message });
    //     }
        
    // } catch(e) {
    //     console.log("API : user.controller.js : validation internal error : " + e);
    //     return res.status(500).json({ errorMessage: "입력값 검증중 에러" });
    // }

    const profile = await UserProfile.findByPk(id);
    profile.update({
        ...(req.body)
    });

    return res.status(201).json({ profile: "정상적으로 반영되었습니다." });
}

export default wrapWithErrorHandler({
    onBoarding,
    getProfile
});
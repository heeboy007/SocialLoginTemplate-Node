

async function findProfileForSignable(user_id) {
    //if profile exists...
    let profile = await User.findByPk(user_id);

    if(!profile) {
        profile = await User.create({ user_id });
    }

    return profile;
}

async function parseProfileAndSave(user_id, newProfile) {
    //if profile exists...
    let profile = await User.findByPk(user_id);

    if(!profile) {
        profile = await User.create({ user_id });
    }

    if(newProfile){
        Object.assign(profile, newProfile);
        profile.save();
    }
    return profile;
}

export {
    findProfileForSignable,
    parseProfileAndSave
}
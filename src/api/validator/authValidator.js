import { JoiExtended } from "./joi";

function validateGoogleToken(body) {
    const schema = JoiExtended.object().keys({
        token: Joi.string()
        .min(48)
        .regex(/^[-a-zA-Z0-9._~+/]+$/)
        .required()
    });
    const result = schema.validate(body);
    if (result.error)
        console.log("API : authValidator.js : " + result.error);
    return result;
}

export {
    validateGoogleToken
}
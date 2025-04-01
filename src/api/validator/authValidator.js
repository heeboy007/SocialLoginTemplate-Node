import { logger } from "../../util/logger.js";
import { JoiExtended } from "./joi.js";

function validateToken(body) {
    const schema = JoiExtended.object().keys({
        id_token: JoiExtended.string().regex(/^[-a-zA-Z0-9._~+/]+$/).allow(null),
        access_token: JoiExtended.string().regex(/^[-a-zA-Z0-9._~+/]+$/).allow(null),
    }).unknown(); //this will ignore any extra fields, so it has a bit more flexiblity
    const result = schema.validate(body);
    if (result.error)
        logger.error("API : authValidator.js : " + result.error);
    return result;
}

export {
    validateToken
}
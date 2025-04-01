import { logger } from "../../util/logger.js";

const loggerHelper = (req, res, next) => {
    logger.info(`[${req.method}] ${req.url}`);
    next();
}

export {
    loggerHelper
}
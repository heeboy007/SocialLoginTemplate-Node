import { GlobalValue } from "./model/global.js";
import { Terms } from "./model/terms.js";
import { User } from "./model/user.js";
import { UserAgreement } from "./model/userAgreement.js";
import { sequelize } from "./sequelize.js";

const schemas = {
    User: User(sequelize),
    Terms: Terms(sequelize),
    UserAgreement: UserAgreement(sequelize),
    GlobalValue: GlobalValue(sequelize),
};

export {
    schemas
}
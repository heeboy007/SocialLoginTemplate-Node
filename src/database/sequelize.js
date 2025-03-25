
import { Sequelize } from 'sequelize';
import { logger } from '../util/logger';

const sequelize = new Sequelize(postgres_db, postgres_user, postgres_pass, {
    host: "localhost",
    dialect: "postgres",
    logging: (sql, timing) => {
        logger.debug(`${sql}`);
    }, // SQL 로그 출력 여부
});

export {
    sequelize
}

import { Sequelize } from 'sequelize';
import { logger } from '../util/logger.js';
import { postgres_db, postgres_host, postgres_pass, postgres_port, postgres_user } from '../util/const.js';

const sequelize = new Sequelize(postgres_db, postgres_user, postgres_pass, {
    host: postgres_host,
    port: postgres_port,
    dialect: "postgres",
    logging: (sql, timing) => {
        logger.debug(`${sql}`);
    }, // SQL 로그 출력 여부
});

export {
    sequelize
}
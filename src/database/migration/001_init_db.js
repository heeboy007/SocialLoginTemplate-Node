
import { logger } from "../../util/logger.js";
import { global_tablename } from "../model/global.js";
import { term_tablename } from "../model/terms.js";
import { user_tablename } from "../model/user.js";
import { user_agreement_tablename } from "../model/userAgreement.js";

async function migrate_001_init_db(conn) {
    /*
    만드는 것 : 
        유저 - 테이블,
        친구관계 - 테이블
        약관 - 테이블
        유저별 약관 동의 - 테이블
        글로벌 변수 - 테이블

        글로벌 변수 유저수 유저 insert시 자동 증가 - 트리거
    */

    //create enum types
    await conn.query(`CREATE TYPE login_method_enum AS ENUM ('google', 'kakao', 'naver');`);
    await conn.query(`CREATE TYPE account_state_enum AS ENUM ('active', 'closed', 'suspended');`);
    logger.info(`CREATE TYPE login_method_enum`);
    logger.info(`CREATE TYPE account_state_enum`);

    await conn.query(`
        CREATE TABLE ${user_tablename} (
            id SERIAL PRIMARY KEY,
            nickname TEXT NOT NULL, 
            email TEXT NOT NULL, 
            recent_login TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            login_method login_method_enum NOT NULL,
            state account_state_enum NOT NULL DEFAULT 'active',
            social_media_external_id TEXT NOT NULL,
            social_media_external_access_token TEXT,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
    `);
    logger.info(`CREATE TABLE ${user_tablename}`);

    await conn.query(`
        CREATE TABLE ${term_tablename} (
            id SERIAL PRIMARY KEY,
            type TEXT NOT NULL,
            version TEXT NOT NULL,
            content TEXT NOT NULL,                 
            effective_at TIMESTAMPTZ NOT NULL,       
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
    `);
    logger.info(`CREATE TABLE ${term_tablename}`);

    await conn.query(`
        CREATE TABLE ${user_agreement_tablename} (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            terms_type TEXT NOT NULL,
            terms_version TEXT NOT NULL,
            agreed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
    `);
    logger.info(`CREATE TABLE ${user_agreement_tablename}`);

    await conn.query(`
        CREATE TABLE ${global_tablename} (
            schema_version INTEGER NOT NULL DEFAULT 0,
            total_session_time FLOAT NOT NULL DEFAULT 0,
            total_user_count INTEGER DEFAULT 0,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
    `);
    logger.info(`CREATE TABLE ${global_tablename}`);

    await conn.query(`
        INSERT INTO ${global_tablename}
        (schema_version, total_session_time, total_user_count, created_at, updated_at)
        VALUES (1, 0.0, 0, now(), now())
    `);
    logger.info(`INSERT INTO ${global_tablename}, only row inserted.`);

    //setup trigger
    await conn.query(`
        CREATE OR REPLACE FUNCTION increment_user_count()
        RETURNS TRIGGER AS $$
        BEGIN
            UPDATE ${global_tablename}
            SET total_user_count = total_user_count + 1;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `);
    await conn.query(`
        CREATE TRIGGER after_user_insert
        AFTER INSERT ON users
        FOR EACH ROW
        EXECUTE PROCEDURE increment_user_count();
    `);
    logger.info(`CREATE TRIGGER after_user_insert`);
}

export {
    migrate_001_init_db
}
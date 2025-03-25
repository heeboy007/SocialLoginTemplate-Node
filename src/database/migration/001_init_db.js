
import { logger } from "../../util/logger";
import { friendship_tablename } from "../model/friendship";
import { global_tablename } from "../model/global";
import { term_tablename } from "../model/terms";
import { user_tablename } from "../model/user";
import { user_agreement_tablename } from "../model/user_agreement";
import { postgres_pool } from "../postgres";

async function migrate_001_init_db() {
    const prev_version = 0;
    const target_version = 1;
    const conn = await postgres_pool.connect();
    try {
        await conn.query('BEGIN'); // 트랜잭션 시작

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

        await conn.query(`
            CREATE TABLE ${user_tablename} (
                id SERIAL PRIMARY KEY,
                nickname TEXT NOT NULL, 
                email TEXT NOT NULL, 
                recent_login TIMESTAMP DEFAULT now(),
                account_state login_method_enum NOT NULL,
                account_state account_state_enum NOT NULL DEFAULT 'active',
                social_media_external_id TEXT,
                social_media_external_access_token TEXT,
                created_at TIMESTAMP DEFAULT now(),
                updated_at TIMESTAMP DEFAULT now()
            );
        `);

        await conn.query(`CREATE TYPE friendship_status AS ENUM ('pending', 'accepted', 'blocked');`);

        await conn.query(`
            CREATE TABLE ${friendship_tablename} (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                friend_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                status friendship_status DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT now(),
                UNIQUE(user_id, friend_id)
            );
        `);

        await conn.query(`
            CREATE TABLE ${term_tablename} (
                id SERIAL PRIMARY KEY,
                type TEXT NOT NULL,
                version TEXT NOT NULL,
                content TEXT NOT NULL,                 
                effective_at TIMESTAMP NOT NULL,       
                created_at TIMESTAMP DEFAULT now()
            );
        `);

        await conn.query(`
            CREATE TABLE ${user_agreement_tablename} (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                terms_type TEXT NOT NULL,
                terms_version TEXT NOT NULL,
                agreed_at TIMESTAMP DEFAULT now()
            );
        `);

        await conn.query(`
            CREATE TABLE ${global_tablename} (
                schema_version INTEGER NOT NULL DEFAULT 0,
                total_session_time INTEGER NOT NULL DEFAULT 0,
                total_user_count FLOAT DEFAULT 0,
                created_at TIMESTAMP DEFAULT now(),
                updated_at TIMESTAMP DEFAULT now()
            );
        `);

        //setup trigger
        await conn.query(`
            CREATE OR REPLACE FUNCTION increment_user_count()
            RETURNS TRIGGER AS $$
            BEGIN
                UPDATE global_values
                SET total_user_count = total_user_count + 1;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);
        await conn.query(`
            CREATE TRIGGER after_user_delete
            AFTER DELETE ON users
            FOR EACH ROW
            EXECUTE PROCEDURE decrement_user_count();
        `);

        // 트랜잭션 커밋
        await conn.query('COMMIT');
        logger.info(`✅ Migration code ${prev_version} -> ${target_version} complete`);
    } catch (error) {
        await conn.query('ROLLBACK'); // 실패 시 롤백
        logger.error(`❌ Migration code ${prev_version} -> ${target_version} failed with error`, error);
    } finally {
        conn.release(); // 연결 해제
    }
}

export {
    migrate_001_init_db
}
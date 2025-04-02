import { postgres_db, req_db_version } from "../../util/const.js";
import { logger } from "../../util/logger.js";
import { schemas } from "../db.js";
import { global_tablename } from "../model/global.js";
import { postgres_pool } from "../postgres.js";
import { migrate } from "./migrate.js";
import { MigrateError } from "./migrateError.js";

async function updateVersionTo(version) {
    const conn = await postgres_pool.connect();
    if(version > 1) {
        try {
            await conn.query("BEGIN");
    
            await conn.query(`UPDATE ${global_tablename} 
                SET schema_version=$1,
                    updated_at=now()`, [version]);
    
            await conn.query("COMMIT");
            logger.info(`✅ updateVersion`);
        } catch (error) {
            logger.error(`❌ updateVersion failed with error`, error);
        } finally {
            conn.release(); // 연결 해제
            return exists;
        }
    }
}

async function checkGlobalExists() {
    let exists = true, conn = null;
    try {
        conn = await postgres_pool.connect();
        const { rows } = await conn.query(`SELECT 1 FROM information_schema.tables 
            WHERE table_schema='public'
            AND table_catalog=$1
            AND table_name=$2;`, [postgres_db, global_tablename]);
        
        exists = rows.length > 0;

        logger.info(`GlobalValue table is set, good to select`);
    } catch (error) {
        logger.error(`❌ checkGlobalExists failed with error`, error);
        exists = false;
    } finally {
        if(conn)
            conn.release(); // 연결 해제
        return exists;
    }
}

async function getSchemaVersion() {
    if(await checkGlobalExists()) {
        let version = 0;
        try {
            const record = await schemas.GlobalValue.findOne({
                attributes: ['schema_version'],
            });
            
            version = record?.schema_version ?? 0;
        } catch(e) {
            logger.error(`Error while loading schema version ${JSON.stringify(e)}`)
            throw new MigrateError("Error while loading schema version.");
        } finally {
            return version;
        }
    } else { return 0; }
};

async function dbMigrateSync() {
    const version = await getSchemaVersion();
    logger.info(`DB Version Detected: ${version} / Required: ${req_db_version}`);
    
    if(version == req_db_version) {
        logger.info(`✅ DB version is already met, nothing to do. Version : ${version}`);
    } else if(version > req_db_version) {
        throw new MigrateError(`❌ APP DB version is higher, Please update APP_REQUIERD_DB_VERSION to ${version}`) 
    } else {
        logger.info(`Updated required, migrating to version : ${req_db_version}`);
        for(let v = version; v < req_db_version; v += 1) {
            const prev_version = v;
            const target_version = v + 1;
            try {
                const conn = await postgres_pool.connect();
                try {
                    // 트랜잭션 시작
                    if(prev_version) //if version is zero, we need to exectue non transaction stuffs.
                        await conn.query('BEGIN'); 
       
                    await migrate[prev_version](conn);
            
                    // 트랜잭션 커밋
                    if(prev_version)
                        await conn.query('COMMIT');
                    logger.info(`✅ Migration code ${prev_version} -> ${target_version} complete`);
                } catch (error) {
                    await conn.query('ROLLBACK'); // 실패 시 롤백
                    logger.error(`❌ Migration code ${prev_version} -> ${target_version} failed with error`, error);
                } finally {
                    conn.release(); // 연결 해제
                }
                await updateVersionTo(target_version);
            } catch (e){
                if (e instanceof MigrateError) { throw e; }
                else { throw new MigrateError(`Error while update to version : ${v}`) }
            }
        }
    }
}

export {
    dbMigrateSync
}
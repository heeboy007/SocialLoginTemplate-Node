import { postgres_db, req_db_version } from "../../util/const.js";
import { logger } from "../../util/logger.js";
import { schemas } from "../db.js";
import { global_tablename } from "../model/global.js";
import { postgres_pool } from "../postgres.js";
import { migrate_001_init_db } from "./001_init_db.js";
import { MigrateError } from "./migrateError.js";

const migrate = [
    async () => {},
    migrate_001_init_db,
];

async function updateVersion(version) {
    const conn = await postgres_pool.connect();
    if(version > 1) {
        try {
            await conn.query("BEGIN");
    
            await conn.query(`UPDATE ${global_tablename} 
                SET schema_version=$1
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
    const conn = await postgres_pool.connect();
    let exists = true;
    try {
        const { rows } = await conn.query(`SELECT 1 FROM information_schema.tables 
            WHERE table_schema='public'
            AND table_catalog=$1
            AND table_name=$2;`, [postgres_db, global_tablename]);
        
        exists = rows.length > 0;

        logger.info(`GlobalValue table is set, good to select`);
    } catch (error) {
        logger.error(`❌ checkGlobalExists failed with error`, error);
    } finally {
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
            throw MigrateError("Error while loading schema version.");
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
        throw MigrateError(`❌ APP DB version is higher, Please update APP_REQUIERD_DB_VERSION to ${version}`) 
    } else {
        logger.info(`Updated required, migrating to version : ${req_db_version}`);
        for(let v = version + 1; v <= req_db_version; v += 1) {
            try {
                const migrate_func = migrate[v];
                await migrate_func();
                await updateVersion(v);
            } catch (e){
                if (e instanceof MigrateError) { throw e; }
                else { throw MigrateError(`Error while update to version : ${v}`) }
            }
        }
    }
}

export {
    dbMigrateSync
}
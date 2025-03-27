import pg from "pg";
import { postgres_db, postgres_host, postgres_pass, postgres_port, postgres_user } from "../util/const.js";
const { Pool } = pg;

const postgres_pool = new Pool({
    host: postgres_host,
    port: postgres_port,
    user: postgres_user,
    password: postgres_pass,
    database: postgres_db,
    max: 20, // 커넥션 풀 최대치
});

export { 
    postgres_pool
};
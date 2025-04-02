import { user_tablename } from "../model/user.js";

async function migrate_002_user_email_nullable(conn) {
    await conn.query(`ALTER TABLE ${user_tablename} ALTER COLUMN email DROP NOT NULL`);
}

export {
    migrate_002_user_email_nullable
}
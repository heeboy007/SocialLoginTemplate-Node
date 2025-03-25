import { friendship_tablename } from "./model/friendship";
import { user_tablename } from "./model/user";
import { postgres_pool } from "./postgres";



export {
    dbDrop,
    dbMigrateSync
}


import { migrate_001_init_db } from "./001_init_db.js";
import { migrate_002_user_email_nullable } from "./minorPatches.js";

const migrate = [
    migrate_001_init_db,
    migrate_002_user_email_nullable
];

export {
    migrate
}
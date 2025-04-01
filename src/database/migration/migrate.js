

import { migrate_001_init_db } from "./001_init_db.js";

const migrate = [
    migrate_001_init_db,
];

export {
    migrate
}
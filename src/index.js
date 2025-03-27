import https from 'https';
import { domain, mode, port } from './util/const.js';
import { backend } from './backend.js';
import { getHttpsCredentials } from './credentials.js';
import { logger } from './util/logger.js';
import { dbMigrateSync } from './database/migration/version.js';

function app() {
    dbMigrateSync()
    .then(() => {
        if(mode === 'PRODUCTION'){
            // HTTPS server setup
            const credentials = getHttpsCredentials();
            const sslServer = https.createServer(credentials, backend);
        
            sslServer.listen(port, () => logger.info(`Secure(HTTPS) server on ${domain}:${port}`));   
        } else {
            backend.listen(port, () => logger.info('Non-Sercure(HTTP) server on http://localhost:' + port));
        }
    })
    .catch((error) => {
        logger.error(`Cirital error while setting up db migration, as follows : `, error);
    })
}

app()
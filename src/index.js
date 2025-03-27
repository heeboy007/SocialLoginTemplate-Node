import https from 'https';
import { domain, mode, port } from './util/const.js';
import { logger } from './util/logger.js';
import { dbMigrateSync } from './database/migration/version.js';
import { backend, configureServer } from './api/backend.js';
import { getHttpsCredentials } from './api/credentials.js';

async function app() {
    try {
        await dbMigrateSync();
        await configureServer(backend);

        if(mode === 'PRODUCTION'){
            // HTTPS server setup
            const credentials = getHttpsCredentials();
            const sslServer = https.createServer(credentials, backend);
        
            sslServer.listen(port, () => logger.info(`Secure(HTTPS) server on ${domain}:${port}`));   
        } else {
            backend.listen(port, () => logger.info('Non-Sercure(HTTP) server on http://localhost:' + port));
        }
    } catch(e) { 
        logger.error(`Cirital error while setting up db migration, as follows : `, error);
    }
}

app()
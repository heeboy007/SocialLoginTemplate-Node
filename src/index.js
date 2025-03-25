import https from 'https';
import fs from 'fs';
import { https_cred_path, mode, port } from './util/const.js';
import { app } from './app.js';

if(mode === 'PRODUCTION'){
    // HTTPS server setup
    let credentials = {};
    
    const privateKey = fs.readFileSync(https_cred_path + '/privkey.pem', 'utf8');
    const certificate = fs.readFileSync(https_cred_path + '/cert.pem', 'utf8');
    const ca = fs.readFileSync(https_cred_path + '/chain.pem', 'utf8');

    credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
    };

    const sslServer = https.createServer(credentials, app);

    sslServer.listen(
        port,
        () => console.log('Secure(HTTPS) server on' + port)
    );   
} else {
    app.listen(
        port,
        () => console.log('Non-Sercure(HTTP) server on http://localhost:' + port)
    );
}

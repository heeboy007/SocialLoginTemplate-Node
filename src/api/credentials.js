import fs from 'fs';
import { https_cred_path } from "../util/const.js";

function getHttpsCredentials() {
    const privateKey = fs.readFileSync(https_cred_path + '/privkey.pem', 'utf8');
    const certificate = fs.readFileSync(https_cred_path + '/cert.pem', 'utf8');
    const ca = fs.readFileSync(https_cred_path + '/chain.pem', 'utf8');

    return {
        key: privateKey,
        cert: certificate,
        ca: ca
    };
}

export {
    getHttpsCredentials
}
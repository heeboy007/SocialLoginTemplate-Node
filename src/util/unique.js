import crypto from 'crypto';

//6 digits for EMAIL
function generate6Digits() {
    return crypto.randomInt(999999).toString().padStart(6, '0');
}

export {
    generate6Digits,
};
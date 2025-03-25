import crypto from 'crypto';

//6 digits for EMAIL
function generate_6_digits() {
    return crypto.randomInt(999999).toString().padStart(6, '0');
}

export {
    generate_6_digits,
};
import dotenv from 'dotenv';

dotenv.config();

const mode = process.env.APP_MODE ?? "PRODUCTION";
const port = process.env.APP_PORT ?? 8080;
const log_dir = process.env.APP_LOG_DIR;
const jwt_secret = process.env.APP_JWT_SECRETKEY;
const https_cred_path = process.env.APP_HTTPS_CREDENTIALS_PATH ?? "/etc/letsencrypt/live/your.domain.here.com";
const domain = process.env.APP_DOMAIN;
const req_db_version = process.env.APP_REQUIERD_DB_VERSION;
const official_mail_address = process.env.APP_OFFICIAL_MAIL;

const google_key = process.env.GOOGLE_OAUTH_CLIENT_KEY;
const google_mail_key = process.env.REDUNDANT_GOOGLE_MAIL_KEY;

const aws_arn = process.env.AWS_ROLE_ARN;
const aws_s3_name = process.env.AWS_S3_BUCKET;

const postgres_db = process.env.POSTGRES_DB;
const postgres_user = process.env.POSTGRES_USER;
const postgres_port = process.env.POSTGRES_PORT;
const postgres_pass = process.env.POSTGRES_PASSWORD;

export {
    mode,
    port,
    log_dir,
    jwt_secret,
    https_cred_path,
    domain,
    req_db_version,
    official_mail_address,

    google_key,
    google_mail_key,

    aws_arn,
    aws_s3_name,

    postgres_db,
    postgres_user,
    postgres_port,
    postgres_pass
}

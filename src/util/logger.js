
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

const { combine, timestamp, printf } = winston.format;

const logFormat = printf((info) => {
    return `[${info.timestamp}][${info.level}] : ${info.message}`;
})

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss a'
        }),
        logFormat
    ),
    transports: [
        new winstonDaily({
            level: 'http',
            datePattern: 'YYYY-MM-DD',
            dirname: log_dir,
            filename: `qplog-%DATE%.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),
        new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: log_dir + '/error',  // error.log 파일은 /logs/error 하위에 저장
            filename: `qplog-%DATE%.error.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),
        new winston.transports.Console({
            level: 'verbose',
            format: winston.format.combine(
                winston.format.colorize(),  // 색깔 넣어서 출력
                logFormat, 
            )
        })
    ]
});

export { logger }
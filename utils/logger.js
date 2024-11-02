import winston from 'winston';
import chalk from 'chalk';

// Define log themes using chalk
export const logTheme = {
    error: chalk.bold.red,
    warn: chalk.hex('#FFA500'),
    info: chalk.hex('#00CED1'),
    debug: chalk.hex('#98FB98'),
    success: chalk.hex('#32CD32')
};

// Create Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

// Console logging wrapper functions
export const consoleLog = {
    error: (message) => console.log(logTheme.error(message)),
    warn: (message) => console.log(logTheme.warn(message)),
    info: (message) => console.log(logTheme.info(message)),
    debug: (message) => console.log(logTheme.debug(message)),
    success: (message) => console.log(logTheme.success(message))
};

export default logger; 
import { pino } from 'pino';
import { loggerConfig } from './loggerConfig';

const logger = pino(loggerConfig);

export default logger;

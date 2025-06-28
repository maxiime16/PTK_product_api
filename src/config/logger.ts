import { pino } from 'pino';
import fs from 'fs';
import path from 'path';

// S'assurer que le dossier logs existe
const logDir = path.resolve('./logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = pino({}, fs.createWriteStream('./logs/app.log', { flags: 'a' }));

export default logger;

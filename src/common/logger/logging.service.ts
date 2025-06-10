import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const LOG_DIR = 'logs';
const MAX_LOG_SIZE_KB = parseInt(process.env.LOG_ROTATE_SIZE_KB || '100', 10);

@Injectable()
export class LoggingService {
  private logFile: string;
  private level: string;

  constructor() {
    this.level = process.env.LOG_LEVEL || 'debug';
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);
    this.logFile = path.join(LOG_DIR, 'app.log');
  }

  log(message: string) {
    this.writeLog('LOG', message);
  }

  error(message: string) {
    this.writeLog('ERROR', message);
  }

  debug(message: string) {
    if (this.level === 'debug') this.writeLog('DEBUG', message);
  }

  private writeLog(level: string, message: string) {
    const logMsg = `[${new Date().toISOString()}] ${level}: ${message}\n`;
    fs.appendFileSync(this.logFile, logMsg);
    this.rotateIfNeeded();
  }

  private rotateIfNeeded() {
    const stats = fs.statSync(this.logFile);
    if (stats.size > Number(process.env.LOG_ROTATE_SIZE_KB || 100) * 1024) {
      const timestamp = Date.now();
      fs.renameSync(this.logFile, `${this.logFile}.${timestamp}`);
      fs.writeFileSync(this.logFile, '');
    }
  }
}

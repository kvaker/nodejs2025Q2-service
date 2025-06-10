import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const LOG_DIR = process.env.LOG_DIR || 'logs';

@Injectable()
export class LoggingService {
  private readonly logFile: string;
  private readonly level: string;
  private readonly maxLogSizeKb: number;

  constructor() {
    this.level = process.env.LOG_LEVEL || 'debug';
    this.maxLogSizeKb = parseInt(process.env.LOG_ROTATE_SIZE_KB || '100', 10);

    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }

    this.logFile = path.join(LOG_DIR, 'app.log');
  }

  log(message: string) {
    this.writeLog('LOG', message);
  }

  error(message: string) {
    this.writeLog('ERROR', message);
  }

  debug(message: string) {
    if (this.level === 'debug') {
      this.writeLog('DEBUG', message);
    }
  }

  private writeLog(level: string, message: string) {
    const logMsg = `[${new Date().toISOString()}] ${level}: ${message}\n`;
    fs.appendFileSync(this.logFile, logMsg);
    this.rotateIfNeeded();
  }

  private rotateIfNeeded() {
    if (!fs.existsSync(this.logFile)) return;

    const stats = fs.statSync(this.logFile);
    if (stats.size > this.maxLogSizeKb * 1024) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const rotatedFile = `${this.logFile}.${timestamp}`;
      fs.renameSync(this.logFile, rotatedFile);
      fs.writeFileSync(this.logFile, '');
    }
  }
}

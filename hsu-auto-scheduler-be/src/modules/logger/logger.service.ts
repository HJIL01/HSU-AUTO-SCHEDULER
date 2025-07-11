import { ConsoleLogger, Injectable } from '@nestjs/common';
import { promises as fsPromises } from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerService extends ConsoleLogger {
  async logToFile(isError: boolean, entry: string) {
    const now = new Date();
    const formatTime = Intl.DateTimeFormat('ko-KR', {
      dateStyle: 'long',
      timeStyle: 'medium',
      timeZone: 'Asia/Seoul',
    }).format(now);

    try {
      const logDir = path.resolve(process.cwd(), 'logs');
      const logFile = path.join(logDir, isError ? 'errors.log' : 'logs.log');
      const logLine = `${formatTime}\t${entry}\n`;

      await fsPromises.mkdir(logDir, { recursive: true });
      await fsPromises.appendFile(logFile, logLine);
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
  }

  log(message: any, context?: string) {
    const entry = `${context}\t${JSON.stringify(message)}`;

    this.logToFile(false, entry);

    super.log(message, context);
  }

  error(message: any, stackOrContext?: string) {
    const entry = `${stackOrContext}\t${JSON.stringify(message)}`;

    this.logToFile(true, entry);

    super.error(message, stackOrContext);
  }
}

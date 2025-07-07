import { ConsoleLogger, Injectable } from '@nestjs/common';
import fsPromises from 'fs/promises';
import path from 'path';

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
    console.log(message, context);
    super.log(message, context);
  }

  error(message: any, stackOrContext?: string) {
    console.log(message, stackOrContext, '에러');

    super.error(message, stackOrContext);
  }
}

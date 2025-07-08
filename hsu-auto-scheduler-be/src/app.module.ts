import { Module, ValidationPipe } from '@nestjs/common';
import { CrawlerModule } from './modules/crawler/crawler.module';
import { LoggerModule } from './modules/logger/logger.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AllExceptionFilter } from './all-exception.filter';
import { DatabaseModule } from './modules/database/database.module';

@Module({
  imports: [CrawlerModule, LoggerModule, DatabaseModule],
  controllers: [],
  providers: [
    /* 
      글로벌 밸리데이션 파이프
      DI 의존성 주입을 통해 자동으로 plain object를 DTO 클래스의 인스턴스로 변환해준다
      dto에서 class validator로 유효성 검사를 하기 위해 의존성 등록 
    */
    {
      provide: APP_PIPE,
      useFactory: () => {
        return new ValidationPipe({
          transform: true,
        });
      },
    },
    /* 
      글로벌 전체 예외 필터
      마찬가지로 DI 의존성 주입을 사용
    */
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}

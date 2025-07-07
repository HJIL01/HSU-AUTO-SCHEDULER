import { Module } from '@nestjs/common';
import { CrawlerModule } from './modules/crawler/crawler.module';

@Module({
  imports: [CrawlerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

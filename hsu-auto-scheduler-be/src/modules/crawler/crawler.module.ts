import { Module } from '@nestjs/common';
import { CrawlerController } from './crawler.controller';
import { DatabaseModule } from '../database/database.module';
import { PersistenceService } from './services/persistence.service';
import { TransactionService } from './services/transaction.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CrawlerController],
  providers: [TransactionService, PersistenceService],
})
export class CrawlerModule {}

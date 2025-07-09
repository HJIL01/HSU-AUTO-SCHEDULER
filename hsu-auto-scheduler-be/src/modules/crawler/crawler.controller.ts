import { Controller, Post, Body } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { crawledDataDto } from './dto/crawlerData.dto';

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Post('postCrawledData')
  handleCrawledData(@Body() crawledData: crawledDataDto) {
    return this.crawlerService.handleCrawledData(crawledData);
  }
}

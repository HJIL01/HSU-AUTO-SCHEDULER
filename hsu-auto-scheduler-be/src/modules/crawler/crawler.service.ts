import { Injectable } from '@nestjs/common';
import { crawledDataDto } from './dto/crawlerData.dto';

@Injectable()
export class CrawlerService {
  handleCrawledData(crawledData: crawledDataDto) {
    console.log(crawledData);
    return JSON.stringify('okokok', null, 2);
  }
}

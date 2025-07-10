import { Controller, Post, Body } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { SemesterDto } from 'src/common/dto/01_semester.dto';
import { MajorDataDto } from './dto/majorData.dto';

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Post('postSemesterData')
  handleSemesterData(@Body() semesterData: SemesterDto) {
    // console.log(semesterData);
    return this.crawlerService.findOrCreateSemester(semesterData);
  }

  @Post('postMajorData')
  handleMajorData(@Body() majorData: MajorDataDto) {
    return this.crawlerService.createSemesterAndMajorTransactional(majorData);
  }
}

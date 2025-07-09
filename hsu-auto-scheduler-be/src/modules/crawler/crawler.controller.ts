import { Controller, Post, Body, ParseArrayPipe } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { CourseDto } from 'src/common/dto/03_course.dto';
import { SemesterDto } from '../../common/dto/01_semester.dto';
import { MajorDto } from '../../common/dto/02_major.dto';
import { CrawlerDataDto } from './dto/crawlerData.dto';

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Post('postCrawlerData')
  postCourses(@Body() body: CrawlerDataDto) {
    console.log(body);
    // return this.crawlerService.postCourses(courses);
    return 'Test';
  }
}

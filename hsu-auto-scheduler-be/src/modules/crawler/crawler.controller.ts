import { Controller, Post, Body } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { WrapArrayCourseDto } from 'src/common/dto/01_course.dto';

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Post('postCourses')
  postCourses(@Body() courses: WrapArrayCourseDto) {
    console.log(courses);
    return 'TEst';
    // return this.crawlerService.postCourses(courses);
  }
}

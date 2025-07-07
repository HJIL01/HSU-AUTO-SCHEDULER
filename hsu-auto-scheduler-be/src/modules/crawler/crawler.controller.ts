import { Controller, Post, Body, ParseArrayPipe } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { CourseDto } from 'src/common/dto/01_course.dto';

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Post('postCourses')
  postCourses(
    @Body(
      new ParseArrayPipe({
        items: CourseDto,
      }),
    )
    courses: CourseDto[] | null,
  ) {
    console.log(courses);
    return 'TEst';
    // return this.crawlerService.postCourses(courses);
  }
}

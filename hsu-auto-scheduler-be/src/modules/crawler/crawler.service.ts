import { Injectable } from '@nestjs/common';
import { WrapArrayCourseDto } from 'src/common/dto/01_course.dto';

@Injectable()
export class CrawlerService {
  postCourses(courses: WrapArrayCourseDto) {
    console.log(courses);
    return JSON.stringify('okokok', null, 2);
  }
}

import { Injectable } from '@nestjs/common';
import { CourseDto } from 'src/common/dto/01_course.dto';

@Injectable()
export class CrawlerService {
  postCourses(courses: CourseDto[] = []) {
    console.log(courses);
    return JSON.stringify('okokok', null, 2);
  }
}

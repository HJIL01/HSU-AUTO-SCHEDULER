import { Controller, Post, Body } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { SemesterDto } from 'src/common/dto/01_semester.dto';
import { MajorDataDto } from './dto/majorData.dto';
import { CourseDataDto } from './dto/courseData.dto';

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  // 학기 저장(학기 테이블)
  @Post('semester-data')
  handleSemesterData(@Body() semesterData: SemesterDto) {
    return this.crawlerService.findOrCreateSemester(semesterData);
  }

  // 전공 저장 로직(전공 테이블, 학기-전공 관계 테이블)
  @Post('major-data')
  handleMajorData(@Body() majorData: MajorDataDto) {
    return this.crawlerService.createMajorTransactional(majorData);
  }

  // 강의 저장 로직(강의 테이블, 오프라인 스케줄 테이블, 전공-강의 관계 테이블)
  @Post('course-data')
  handleCourseData(@Body() courseData: CourseDataDto) {
    return this.crawlerService.createCourseTransactional(courseData);
  }
}

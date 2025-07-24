import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ConstraintsDto } from './dto/constraints.dto';
import { ScheduleService } from './services/schedule.service';
import { GetCoursesDto } from './dto/getCourses.dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('get-semesters')
  getSemesters() {
    return this.scheduleService.getSemesters();
  }

  @Get('get-majors')
  getMajors(@Query('semesterId') semesterId: string) {
    return this.scheduleService.getMajors(semesterId);
  }

  // 필터가 너무 많으므로 POST로 바꿈
  @Post('get-courses')
  getCourses(@Body() getCoursesCondition: GetCoursesDto) {
    return this.scheduleService.getCourses(getCoursesCondition);
  }

  @Post('constraints')
  handleScheduleConstaraints(@Body() constaraints: ConstraintsDto) {
    return this.scheduleService.filterDataAndPostConstraints(constaraints);
  }
}

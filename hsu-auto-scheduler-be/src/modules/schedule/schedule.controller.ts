import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ConstraintsDto } from './dto/constraints.dto';
import { ScheduleService } from './schedule.service';

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

  @Post('constraints')
  handleScheduleConstaraints(@Body() constaraints: ConstraintsDto) {
    return this.scheduleService.filterDataAndPostConstraints(constaraints);
  }
}

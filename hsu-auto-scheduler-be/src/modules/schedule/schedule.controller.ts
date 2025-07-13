import { Body, Controller, Post } from '@nestjs/common';
import { ConstraintsDto } from './dto/constraints.dto';
import { ScheduleService } from './schedule.service';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('constraints')
  handleScheduleConstaraints(@Body() constaraints: ConstraintsDto) {
    return this.scheduleService.filterDataAndPostConstraints(constaraints);
  }
}

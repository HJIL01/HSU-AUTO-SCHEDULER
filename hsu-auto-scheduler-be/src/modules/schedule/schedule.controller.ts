import { Body, Controller, Post } from '@nestjs/common';
import { ConstraintsDto } from './dto/constraints.dto';
import { ScheduleService } from './schedule.service';

@Controller('schedule-constraints')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  handleScheduleConstaraints(@Body() constaraints: ConstraintsDto) {
    return this.scheduleService.filterDataAndPostConstraints(constaraints);
  }
}

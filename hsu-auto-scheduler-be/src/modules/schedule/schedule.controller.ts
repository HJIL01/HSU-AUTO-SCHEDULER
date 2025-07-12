import { Body, Controller, Post } from '@nestjs/common';
import { ScheduleConstraintsService } from './schedule-constraints.service';
import { ConstraintsDto } from './dto/constraints.dto';

@Controller('schedule-constraints')
export class ScheduleConstraintsController {
  constructor(
    private readonly scheduleConstraintsService: ScheduleConstraintsService,
  ) {}

  @Post()
  handleScheduleConstaraints(@Body() constaraints: ConstraintsDto) {
    return this.scheduleConstraintsService.filterDataAndPostConstraints(
      constaraints,
    );
  }
}

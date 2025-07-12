import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleConstraintsController } from './schedule-constraints.controller';
import { ScheduleConstraintsService } from './schedule-constraints.service';

describe('ScheduleConstraintsController', () => {
  let controller: ScheduleConstraintsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleConstraintsController],
      providers: [ScheduleConstraintsService],
    }).compile();

    controller = module.get<ScheduleConstraintsController>(ScheduleConstraintsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

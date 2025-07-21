import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleController } from '../schedule.controller';
import { ScheduleService } from '../services/schedule.service';

describe('ScheduleConstraintsController', () => {
  let controller: ScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleController],
      providers: [ScheduleService],
    }).compile();

    controller = module.get<ScheduleController>(ScheduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

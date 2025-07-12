import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleConstraintsService } from './schedule-constraints.service';

describe('ScheduleConstraintsService', () => {
  let service: ScheduleConstraintsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleConstraintsService],
    }).compile();

    service = module.get<ScheduleConstraintsService>(ScheduleConstraintsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

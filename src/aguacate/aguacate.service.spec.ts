import { Test, TestingModule } from '@nestjs/testing';
import { AguacateService } from './aguacate.service';

describe('AguacateService', () => {
  let service: AguacateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AguacateService],
    }).compile();

    service = module.get<AguacateService>(AguacateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

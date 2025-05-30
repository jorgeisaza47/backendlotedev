import { Test, TestingModule } from '@nestjs/testing';
import { AguacateController } from './aguacate.controller';
import { AguacateService } from './aguacate.service';

describe('AguacateController', () => {
  let controller: AguacateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AguacateController],
      providers: [AguacateService],
    }).compile();

    controller = module.get<AguacateController>(AguacateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

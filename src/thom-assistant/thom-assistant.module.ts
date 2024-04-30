import { Module } from '@nestjs/common';
import { ThomAssistantService } from './thom-assistant.service';
import { ThomAssistantController } from './thom-assistant.controller';

@Module({
  controllers: [ThomAssistantController],
  providers: [ThomAssistantService],
})
export class ThomAssistantModule {}

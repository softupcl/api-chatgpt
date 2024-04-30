import { Module } from '@nestjs/common';
import { GptModule } from './gpt/gpt.module';
import { ConfigModule } from '@nestjs/config';
import { ThomAssistantModule } from './thom-assistant/thom-assistant.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GptModule,
    ThomAssistantModule
  ],
})
export class AppModule {}

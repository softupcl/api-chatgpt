import { Body, Controller, Post } from '@nestjs/common';
import { ThomAssistantService } from './thom-assistant.service';
import { QuestionDto } from './dtos/question.dto';

@Controller('thom-assistant')
export class ThomAssistantController {
  constructor(private readonly thomAssistantService: ThomAssistantService) {}


  @Post('create-thread')
  async createThread(
  ){
    return await this.thomAssistantService.createThread();
  }

  @Post('user-question')
  async userQuestion(
    @Body() questionDto : QuestionDto
  ){
    return await this.thomAssistantService.userQuestions(questionDto);
  }
 


}

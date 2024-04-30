import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { createThreadUseCase } from './use-cases/create-thead.use-case';
import { QuestionDto } from './dtos/question.dto';
import { checkStatusUseCase, createMessageUseCase, createRunUseCase, getMessagesUseCase } from './use-cases';
import { get } from 'http';

@Injectable()
export class ThomAssistantService {

    private openai = new OpenAI({
        apiKey: process.env.OPENIA_API_KEY
    })

    async createThread() {
        return createThreadUseCase(this.openai);
    }

    async userQuestions(questionDto: QuestionDto) {

        const { threadId, question } = questionDto;

        //Se crea mensaje
        const message = await createMessageUseCase(this.openai, { threadId, question })
        
        //Se crea run
        const run = await createRunUseCase(this.openai, { threadId });

        //Se verifica el estado del run hasta que se complete
        await checkStatusUseCase(this.openai, { runId: run.id, threadId:threadId,  });

        //Se obtienen los mensajes del thread
        const messages = await getMessagesUseCase(this.openai, { threadId });

        return messages.reverse();
    }
}

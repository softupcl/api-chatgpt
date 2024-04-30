import { IsString } from "class-validator";

export class QuestionDto{
    @IsString()
    readonly question: string;

    @IsString()
    readonly threadId: string;
}
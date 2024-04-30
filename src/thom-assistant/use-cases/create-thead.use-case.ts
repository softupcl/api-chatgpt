import OpenAI from "openai";

export const createThreadUseCase = async (openia:OpenAI) => {
    const {id, created_at} = await openia.beta.threads.create();

    return {id, created_at} ;
}
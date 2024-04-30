import OpenAI from "openai";

interface Options{
    threadId:string;
    assistId?:string;
}

export const createRunUseCase = async (openia:OpenAI, options:Options ) => {

    const { threadId, assistId  = 'asst_csudP7waDxhXSODkYKPwe4Ry'} = options;

    const run = await openia.beta.threads.runs.create(threadId,{
        assistant_id: assistId
    });

    console.log(run);
    return run;

}
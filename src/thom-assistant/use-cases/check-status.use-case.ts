import OpenAI from "openai";

interface Options{
    threadId:string;
    runId:string;
}


export const checkStatusUseCase = async (openia:OpenAI, options:Options) => {
    const {threadId, runId} = options;

    const runStatus = await openia.beta.threads.runs.retrieve(threadId, runId);

    console.log({runStatus:runStatus.status});

    if(runStatus.status === 'completed'){
        return runStatus;
    }

    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            resolve(await checkStatusUseCase(openia, options));
        }, 1000);
    });

    

}
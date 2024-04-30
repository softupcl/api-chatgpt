import * as fs from "fs";
import OpenAI from "openai";


interface  Options {
    prompt?: string;
    audioFile: Express.Multer.File;
}

export const audioToTextUseCase = async (openia: OpenAI, options: Options) => {

    const { prompt,audioFile } = options;
    console.log({prompt,audioFile})

    const respose = await openia.audio.transcriptions.create({
        model:'whisper-1',
        file : fs.createReadStream(audioFile.path),
        prompt: prompt,
        language: 'es',
        //response_format: 'vtt','srt'
        response_format: 'verbose_json',
    });

    console.log(respose);
    return respose;

}
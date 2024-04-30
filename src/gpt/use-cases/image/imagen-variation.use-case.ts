import * as fs from "fs";
import OpenAI from "openai";
import { downloadImage } from "src/helpers";

interface Options {
    baseImage:string;
}


export const imageVariationUseCase = async (openai: OpenAI, { baseImage }: Options) => {
    
    const imagePath = await downloadImage(baseImage, true);

    const response = await openai.images.createVariation({
        model:'dall-e-2',
        image: fs.createReadStream(imagePath),
        n:1,
        size:'1024x1024',
        response_format:'url'
    });

    const fileName = await downloadImage(response.data[0].url);
    const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

    return {
        url: url,
        openIAPath: response.data[0].url,
        revised_prompt: response.data[0].revised_prompt
    }
}
import * as path from "path";
import * as fs from "fs";
import { Injectable, NotFoundException } from '@nestjs/common';
import OpenAI from 'openai';
import { audioToTextUseCase, imageDescriptionUseCase, imageGenerationUseCase, orthographyCheckUseCase, prosConsDicusserUseCase, prosConsStreamUseCase, textToAudioUseCase, translateUseCase } from './use-cases';
import { ProsConsDiscusserDto, TextToAudioDto, TranslateDto, OrthographyDto, ImageGenerationDto, ImageVarationDto } from './dtos';
import { AudioToTextDto } from './dtos/audioToText.dto';
import { imageVariationUseCase } from "./use-cases/image/imagen-variation.use-case";

@Injectable()
export class GptService {

    private openai = new OpenAI({
        apiKey: process.env.OPENIA_API_KEY
    })

    async orthographyCheck(orthographyDto: OrthographyDto) {
        return await orthographyCheckUseCase(this.openai, {
            prompt: orthographyDto.prompt
        });
    }

    async prosConsDicusser(prosConsDiscusserDto: ProsConsDiscusserDto) {
        return await prosConsDicusserUseCase(this.openai, {
            prompt: prosConsDiscusserDto.prompt
        });
    }

    async prosConsDicusserStream(prosConsDiscusserDto: ProsConsDiscusserDto) {
        return await prosConsStreamUseCase(this.openai, {
            prompt: prosConsDiscusserDto.prompt
        });
    }

    async translate(translateDto: TranslateDto) {
        return await translateUseCase(this.openai, {
            prompt: translateDto.prompt,
            lang: translateDto.lang
        });
    }

    async textToAudio({ prompt, voice }: TextToAudioDto) {
        return await textToAudioUseCase(this.openai, { prompt, voice });
    }

    async getAudioFile(fileId: string) {
        const filePath = path.resolve(__dirname, `../../files/audios/`, `${fileId}.mp3`);

        const findFile = fs.existsSync(filePath);

        if (!findFile) throw new NotFoundException(`Archivo ${fileId} no encontrado`);

        return filePath;
    }

    async audioToText(audioFile: Express.Multer.File, audioToTextDto: AudioToTextDto) {

        const { prompt } = audioToTextDto;
        return await audioToTextUseCase(this.openai, { audioFile, prompt });
    }


    async imageGeneration(imageGenerationDto: ImageGenerationDto) {
        return await imageGenerationUseCase(this.openai, {...imageGenerationDto});
    }


    async getImageFile(imageId: string) {
        const filePath = path.resolve(__dirname, `../../files/images/`, `${imageId}`);

        const findFile = fs.existsSync(filePath);

        if (!findFile) throw new NotFoundException(`Imagen ${imageId} no encontrada`);

        return filePath;
    }

    async imageVariation({baseImage}: ImageVarationDto) {
        return await imageVariationUseCase(this.openai, {baseImage});
    }

    async imageToText(imageFile: Express.Multer.File, prompt: string) {
        return await imageDescriptionUseCase(this.openai, { imageFile, prompt });
      }
}


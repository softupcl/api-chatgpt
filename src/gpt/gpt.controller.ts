import { Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GptService } from './gpt.service';
import { AudioToTextDto, ImageGenerationDto, ImageVarationDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage  } from 'multer';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}


  @Post('orthography-check')
  orthographyCheck(
    @Body() orthographyDto:OrthographyDto,
  ){
    return this.gptService.orthographyCheck(orthographyDto);
   
  }

  @Post('pros-cons-discusser')
  prosConsDicusser(
    @Body() prosConsDiscusserDto:ProsConsDiscusserDto,
  ){
    return this.gptService.prosConsDicusser(prosConsDiscusserDto);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDicusserStream(
    @Body() prosConsDiscusserDto:ProsConsDiscusserDto,
    @Res() res: Response 
  ){
    const stream= await this.gptService.prosConsDicusserStream(prosConsDiscusserDto);

    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await ( const chunk of stream){
        const piece = chunk.choices[0].delta.content || ''
        res.write(piece);
    }
    res.end();

  }

  @Post('translate')
  translate(
    @Body() translateDto:TranslateDto,
  ){
    return this.gptService.translate(translateDto);
  }

  @Post('text-to-audio')
  async textToAudio(
    @Body() texToAudioDto:TextToAudioDto,
    @Res() res: Response
  ){
    const filePath = await this.gptService.textToAudio(texToAudioDto);

    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }


  @Get('text-to-audio/:fileId')
  async getTextToAudio(
    @Param('fileId') fileId: string,
    @Res() res: Response
  ){
    
    const filePath = await this.gptService.getAudioFile(fileId);

    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);

  }



  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file',{
      storage : diskStorage({
        destination: './files/uploads',
        filename: (req, file, cb) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${Date.now()}.${fileExtension}`;
          return cb(null, fileName);
        }
      
      })
    })
  )
  async audioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
           new MaxFileSizeValidator({maxSize: 1000 * 1024 * 5, message: 'Archivo pesa mas de 5 MB'}),
           new FileTypeValidator({fileType:'audio/*'}),
        ]
      })
    ) file : Express.Multer.File,
    @Body() audioToTextDto : AudioToTextDto
  ){

    return this.gptService.audioToText(file, audioToTextDto);
  }


  @Post('image-generation')
  async imageGenration(
    @Body() imageGenerationDto:ImageGenerationDto,
  ){
    return this.gptService.imageGeneration(imageGenerationDto);
  }

  @Get('image-generation/:imageId')
  async getImage(
    @Param('imageId') imageId: string,
    @Res() res: Response
  ){
    
    const filePath = await this.gptService.getImageFile(imageId);

    //res.setHeader('Content-Type', 'image/png');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Post('image-variation')
  async imageVariation(
    @Body() imageVarationDto:ImageVarationDto,
  ){
    return this.gptService.imageVariation(imageVarationDto);
  }

  @Post('image-description')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files/uploads',
        filename: (req, file, callback) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${new Date().getTime()}.${fileExtension}`;
          return callback(null, fileName);
        },
      }),
    }),
  )
  async extractTextFromImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1000 * 1024 * 5,
            message: 'Archivo pesa mas de 5 MB ',
          }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body('prompt') prompt: string,
  ) {
    return this.gptService.imageToText(file, prompt);
  }
}







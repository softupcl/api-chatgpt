import { InternalServerErrorException } from "@nestjs/common";
import * as path from "path";
import * as fs from 'fs';
import * as sharp from 'sharp';

export const downloadImage = async (url: string, fullPath: boolean = false) => {

  const response = await fetch(url);
  if (!response.ok) throw new InternalServerErrorException('Error al descargar la imagen');

  const folderPatrh = path.resolve('./', './files/images/');
  fs.mkdirSync(folderPatrh, { recursive: true });

  const imageName = `${new Date().getTime()}.png`;
  const buffer = Buffer.from(await response.arrayBuffer());

  //fs.writeFileSync(path.resolve(folderPatrh, imageName), buffer);

  const completePath = path.join(folderPatrh, imageName);
  await sharp(buffer)
    .png()
    .ensureAlpha()
    .toFile(completePath);

  return fullPath ? completePath : imageName;

}


export const downloadBase64ImageAsPng = async (base64Image: string, fullPath: boolean = false) => {

  // Remover encabezado
  base64Image = base64Image.split(';base64,').pop();
  const imageBuffer = Buffer.from(base64Image, 'base64');

  const folderPath = path.resolve('./', './files/images/');
  fs.mkdirSync(folderPath, { recursive: true });

  const imageNamePng = `${new Date().getTime()}-64.png`;
  const completePath = path.join(folderPath, imageNamePng);

  // Transformar a RGBA, png // Así lo espera OpenAI
  await sharp(imageBuffer)
    .png()
    .ensureAlpha()
    .toFile(completePath);

  return fullPath ? completePath : imageNamePng;

}
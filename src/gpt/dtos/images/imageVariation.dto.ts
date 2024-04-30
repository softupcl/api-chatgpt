import { IsOptional, IsString } from "class-validator";

export class ImageVarationDto{

    @IsString()
    readonly baseImage: string;

}
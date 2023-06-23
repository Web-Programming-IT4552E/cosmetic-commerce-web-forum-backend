import { Expose } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdatePostDto {
  @Expose()
  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  attachment: string[];

  @Expose()
  @IsString()
  @IsNotEmpty()
  content: string;
}

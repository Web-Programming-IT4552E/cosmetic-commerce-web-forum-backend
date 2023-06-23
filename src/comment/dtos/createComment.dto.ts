import { Expose } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateCommentDto {
  @Expose()
  @IsMongoId()
  @IsOptional()
  reply_to_comment_id: string;

  @Expose()
  @IsArray()
  @IsOptional()
  @IsUrl({}, { each: true })
  attachment: string[];

  @Expose()
  @IsString()
  @IsNotEmpty()
  content: string;
}

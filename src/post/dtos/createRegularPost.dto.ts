import { Expose } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PostCategory } from '../enums/post-category.enum';

export class CreateRegularPostDto {
  @Expose()
  @IsOptional()
  @IsEnum(PostCategory)
  @IsIn([
    PostCategory.CHAT,
    PostCategory.GENERAL,
    PostCategory.REVIEW,
    PostCategory.TRADING,
  ])
  category: PostCategory;

  @Expose()
  @IsArray()
  @IsOptional()
  attachment: string[];

  @Expose()
  @IsString()
  @IsNotEmpty()
  content: string;
}

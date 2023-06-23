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

export class CreateAnnouncementPostDto {
  @Expose()
  @IsOptional()
  @IsEnum(PostCategory)
  @IsIn([PostCategory.RULE, PostCategory.USER_GUIDE])
  category: PostCategory;

  @Expose()
  @IsOptional()
  @IsArray()
  attachment: string[];

  @Expose()
  @IsString()
  @IsNotEmpty()
  content: string;
}

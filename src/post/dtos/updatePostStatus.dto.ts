import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { PostStatus } from '../enums/post-status.enum';

export class UpdatePostStatusDto {
  @Expose()
  @IsNotEmpty()
  @IsEnum(PostStatus)
  status: PostStatus;
}

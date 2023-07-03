import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dtos/paginationQuery.dto';

export class GetListPublicPostQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  category: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  author_id: string;
}

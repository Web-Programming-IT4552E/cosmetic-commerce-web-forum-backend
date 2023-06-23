import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dtos/paginationQuery.dto';

export class GetListPublicPostQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  status: string;

  @ApiPropertyOptional()
  category: string;

  @ApiPropertyOptional()
  author_id: string;
}

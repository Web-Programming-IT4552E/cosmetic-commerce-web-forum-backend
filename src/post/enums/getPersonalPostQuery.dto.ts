import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dtos/paginationQuery.dto';

export class GetListPersonalPostQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  status: string;
}

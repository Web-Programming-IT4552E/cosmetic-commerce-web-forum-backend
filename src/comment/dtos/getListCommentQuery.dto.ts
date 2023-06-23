import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetListCommentQueryDto {
  @ApiProperty({
    default: 5,
  })
  limitPerLoad: number = 5;

  @ApiPropertyOptional()
  lastPrevCommentId: string;
}

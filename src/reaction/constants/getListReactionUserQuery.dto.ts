import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetListReactionUserQueryDto {
  @ApiProperty({
    default: 5,
  })
  limitPerLoad: number = 5;

  @ApiPropertyOptional()
  lastPrevReactionId: string;
}

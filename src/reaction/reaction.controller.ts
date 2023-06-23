import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { JwtDecodedData, Roles } from 'src/common/decorators/auth.decorator';
import { UserType } from 'src/user/enums/user-type.enum';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtPayload } from 'src/auth/dtos/jwt-payload.dto';
import { ReactionService } from './reaction.service';
import { GetListReactionUserQueryDto } from './constants/getListReactionUserQuery.dto';

@ApiTags('reaction')
@Controller('/reaction')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Get('/list-user/:reacted_object_id')
  @ApiOperation({
    description: 'Get reactions of a post/comment',
  })
  @Roles([UserType.ADMIN, UserType.CUSTOMER])
  @ApiBearerAuth()
  async getPostReaction(
    @Param('reacted_object_id') reacted_object_id: string,
    @Query() getListReactionUserQueryDto: GetListReactionUserQueryDto,
  ) {
    const { lastPrevReactionId, limitPerLoad } = {
      ...getListReactionUserQueryDto,
    };
    return this.reactionService.getObjectReactedUserList(
      reacted_object_id,
      limitPerLoad,
      lastPrevReactionId,
    );
  }

  @Post('/:object_id')
  @Roles([UserType.ADMIN, UserType.CUSTOMER])
  @ApiOperation({
    description: 'toggle like/unlike',
  })
  @ApiBearerAuth()
  async toggleReaction(
    @Param('object_id') reacted_object_id: string,
    @JwtDecodedData() jwtPayload: JwtPayload,
  ) {
    await this.reactionService.toggleReaction(
      jwtPayload.userId,
      reacted_object_id,
    );
    return {
      message: 'Toggle reaction successfully',
    };
  }
}

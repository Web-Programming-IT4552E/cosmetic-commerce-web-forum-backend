import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtDecodedData, Roles } from 'src/common/decorators/auth.decorator';
import { UserType } from 'src/user/enums/user-type.enum';
import { JwtPayload } from 'src/auth/dtos/jwt-payload.dto';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dtos/createComment.dto';
import { GetListCommentQueryDto } from './dtos/getListCommentQuery.dto';

@ApiTags('comment')
@Controller('/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('/post-comment/:post_id')
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Get comments of a post',
  })
  @Roles([UserType.ADMIN, UserType.CUSTOMER])
  async getPostComment(
    @Param('post_id') post_id: string,
    @Query() getListCommentQueryDto: GetListCommentQueryDto,
  ) {
    const { limitPerLoad, lastPrevCommentId } = { ...getListCommentQueryDto };
    return this.commentService.getPostComment(
      post_id,
      limitPerLoad,
      lastPrevCommentId,
    );
  }

  @Get('/comment-replies/:comment_id')
  @ApiOperation({
    description: 'Get replies of a comment',
  })
  @ApiBearerAuth()
  @Roles([UserType.ADMIN, UserType.CUSTOMER])
  async getCommentReplies(
    @Param('comment_id') comment_id: string,
    @Query('limit_per_load') limitPerLoad: number,
    @Query('last_prev_comment_id') lastPrevCommentId: string,
  ) {
    return this.commentService.getCommentReplies(
      comment_id,
      limitPerLoad,
      lastPrevCommentId,
    );
  }

  @Post('/:post_id')
  @Roles([UserType.ADMIN, UserType.CUSTOMER])
  @ApiOperation({
    description: 'Create Comment',
  })
  @ApiBearerAuth()
  async createComment(
    @Param('post_id') post_id: string,
    @JwtDecodedData() jwtPayload: JwtPayload,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const data = await this.commentService.createComment(
      jwtPayload.userId,
      post_id,
      createCommentDto,
    );
    if (!data) {
      throw new NotFoundException('Cannot create : Not found !');
    }
    return data;
  }

  @Delete('/:comment_id')
  @Roles([UserType.ADMIN, UserType.CUSTOMER])
  @ApiOperation({
    description: 'Delete comment',
  })
  @ApiBearerAuth()
  async deleteComment(
    @JwtDecodedData() jwtPayload: JwtPayload,
    @Param('comment_id') comment_id: string,
  ) {
    if (
      !(await this.commentService.deleteComment(jwtPayload.userId, comment_id))
    ) {
      throw new NotFoundException('Cannot delete : Not found !');
    }
    return {
      message: 'Deleted Sucessfully !',
    };
  }
}

import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { JwtDecodedData, Roles } from 'src/common/decorators/auth.decorator';
import { UserType } from 'src/user/enums/user-type.enum';
import { JwtPayload } from 'src/auth/dtos/jwt-payload.dto';
import { CreateAnnouncementPostDto } from './dtos/createAnnouncementPost.dtos';
import { CreateRegularPostDto } from './dtos/createRegularPost.dto';
import { UpdatePostDto } from './dtos/updatePost.dto';
import { UpdatePostStatusDto } from './dtos/updatePostStatus.dto';
import { PostService } from './post.service';
import { GetListPublicPostQueryDto } from './enums/getListPublicPostQuery.dto';
import { GetListPersonalPostQueryDto } from './enums/getPersonalPostQuery.dto';

@Controller('/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/public')
  @ApiOperation({
    description: 'Get public post',
  })
  @ApiBearerAuth()
  @Roles([UserType.ADMIN, UserType.CUSTOMER])
  async getPublicPost(
    @Query() getListPublicPostQueryDto: GetListPublicPostQueryDto,
    @JwtDecodedData() jwtPayload: JwtPayload,
  ) {
    return this.postService.getPublicPost(
      getListPublicPostQueryDto,
      jwtPayload,
    );
  }

  @Get('/public/:post_id')
  @ApiOperation({
    description: 'Get public post details',
  })
  @ApiBearerAuth()
  @Roles([UserType.ADMIN, UserType.CUSTOMER])
  async getPublicPostDetails(@Param('post_id') post_id: string) {
    return this.postService.getPublicPostDetail(post_id);
  }

  @Get('/myPost')
  @ApiBearerAuth()
  @Roles([UserType.ADMIN, UserType.CUSTOMER])
  @ApiOperation({
    security: [{ BearerAuth: [] }],
    description: 'Get my post',
  })
  @ApiBearerAuth()
  @Roles([UserType.ADMIN, UserType.CUSTOMER])
  async getMyPosts(
    @Query() getPersonalPublicPostQueryDto: GetListPersonalPostQueryDto,
    @JwtDecodedData() jwtPayload: JwtPayload,
  ) {
    return this.postService.getMyPosts(
      jwtPayload.userId,
      getPersonalPublicPostQueryDto,
    );
  }

  @Get('/myPost/:post_id')
  @ApiBearerAuth()
  @Roles([UserType.ADMIN, UserType.CUSTOMER])
  @ApiOperation({
    description: 'Get my post post detail',
  })
  async getMyPostDetail(
    @JwtDecodedData() jwtPayload: JwtPayload,
    @Param('post_id') post_id: string,
  ) {
    return this.postService.getMyPostDetail(jwtPayload.userId, post_id);
  }

  @Post('/regular')
  @ApiBearerAuth()
  @Roles([UserType.ADMIN, UserType.CUSTOMER])
  @ApiOperation({
    description: 'Create regular (both customer and admin can create) Post',
  })
  async createRegularPost(
    @JwtDecodedData() jwtPayload: JwtPayload,
    @Body() createPostDto: CreateRegularPostDto,
  ) {
    if (
      !(await this.postService.createRegularPost(
        jwtPayload.userId,
        createPostDto,
      ))
    ) {
      throw new NotFoundException('Cannot create : Not found !');
    }
    return {
      message: 'Created Sucessfully',
    };
  }

  @Post('/announcement')
  @ApiBearerAuth()
  @Roles([UserType.ADMIN, UserType.CUSTOMER])
  @ApiOperation({
    description: 'Create announcement (only admin) Post',
  })
  async createAdminPermissionOnlyPost(
    @JwtDecodedData() jwtPayload: JwtPayload,
    @Body() createPostDto: CreateAnnouncementPostDto,
  ) {
    if (
      !(await this.postService.createRegularPost(
        jwtPayload.userId,
        createPostDto,
      ))
    ) {
      throw new NotFoundException('Cannot create : Not found !');
    }
    return {
      message: 'Created Sucessfully',
    };
  }

  @Put('/:post_id')
  @ApiBearerAuth()
  @Roles([UserType.ADMIN, UserType.CUSTOMER])
  @ApiOperation({
    description: 'Modify official post',
  })
  async updateOfficialPost(
    @JwtDecodedData() jwtPayload: JwtPayload,
    @Param('post_id') post_id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    if (
      !(await this.postService.updateOfficialPost(
        jwtPayload.userId,
        post_id,
        updatePostDto,
      ))
    )
      throw new NotFoundException('Cannot update : Not found !');
    return {
      message: 'Updated Sucessfully !',
    };
  }

  @Delete('/:post_id')
  @ApiBearerAuth()
  @Roles([UserType.ADMIN, UserType.CUSTOMER])
  @ApiOperation({
    description: 'Delete post',
  })
  async deletePost(
    @JwtDecodedData() jwtPayload: JwtPayload,
    @Param('post_id') post_id: string,
  ) {
    if (!(await this.postService.deletePost(jwtPayload.userId, post_id))) {
      throw new NotFoundException('Cannot delete : Not found !');
    }
    return {
      message: 'Deleted Sucessfully !',
    };
  }

  @Patch('/lock/:post_id')
  @ApiBearerAuth()
  @Roles([UserType.ADMIN, UserType.CUSTOMER])
  @ApiOperation({
    description: 'Lock post comment',
  })
  async lockPostComment(
    @JwtDecodedData() jwtPayload: JwtPayload,
    @Param('post_id') post_id: string,
  ) {
    if (!(await this.postService.lockPostComment(jwtPayload.userId, post_id))) {
      throw new NotFoundException('Cannot lock : Not found !');
    }
    return {
      message: 'Post Locked Sucessfully !',
    };
  }

  @Patch('/review/:post_id')
  @Roles([UserType.ADMIN])
  @ApiOperation({
    description: 'Admin approve/deny a post',
  })
  async approveAndDenyPost(
    @Param('post_id') post_id: string,
    @Body() updatePostStatusDto: UpdatePostStatusDto,
  ) {
    if (
      !(await this.postService.approveAndDenyPost(
        post_id,
        updatePostStatusDto.status,
      ))
    ) {
      throw new NotFoundException('Cannot approve : Not found !');
    }
    return {
      message: 'Update Sucessfully !',
    };
  }
}

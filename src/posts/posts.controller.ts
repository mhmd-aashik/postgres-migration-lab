import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import {
  JwtAuthGuard,
  type AuthenticatedRequest,
} from '../auth/guards/jwt-auth.guard.js';

import { CreatePostDto } from './dto/create-post.dto.js';
import { PostsService } from './posts.service.js';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Req() request: AuthenticatedRequest, @Body() dto: CreatePostDto) {
    return this.postsService.create(request.user.sub, dto);
  }

  @Get()
  findMine(@Req() request: AuthenticatedRequest) {
    return this.postsService.findByUser(request.user.sub);
  }
}

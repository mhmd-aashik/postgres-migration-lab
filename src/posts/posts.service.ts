import { Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';

import { DatabaseService } from '../database/database.service.js';
import { posts } from '../database/schema/posts.schema.js';
import { CreatePostDto } from './dto/create-post.dto.js';

@Injectable()
export class PostsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(userId: string, dto: CreatePostDto) {
    const [post] = await this.databaseService.db
      .insert(posts)
      .values({
        userId,
        title: dto.title,
        content: dto.content,
      })
      .returning();

    return post;
  }

  async findByUser(userId: string) {
    return this.databaseService.db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId))
      .orderBy(desc(posts.createdAt));
  }
}

import { ConflictException, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { DatabaseService } from '../database/database.service.js';
import { profiles } from '../database/schema/profiles.schema.js';
import { CreateProfileDto } from './dto/create-profile.dto.js';

@Injectable()
export class ProfilesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(userId: string, dto: CreateProfileDto) {
    const [existingProfile] = await this.databaseService.db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    if (existingProfile) {
      throw new ConflictException('Profile already exists');
    }

    const [profile] = await this.databaseService.db
      .insert(profiles)
      .values({
        userId,
        ...dto,
      })
      .returning();

    return profile;
  }
}

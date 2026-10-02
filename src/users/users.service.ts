import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { DatabaseService } from '../database/database.service.js';
import { users } from '../database/schema/users.schema.js';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findByEmail(email: string) {
    const [user] = await this.databaseService.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user;
  }

  async create(data: { name: string; email: string; passwordHash: string }) {
    const [user] = await this.databaseService.db
      .insert(users)
      .values(data)
      .returning();

    return user;
  }
}

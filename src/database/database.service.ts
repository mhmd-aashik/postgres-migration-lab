import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

import * as schema from './schema/index.js';

@Injectable()
export class DatabaseService {
  public readonly db: NeonHttpDatabase<typeof schema>;

  constructor(private readonly configService: ConfigService) {
    const databaseUrl = this.configService.getOrThrow<string>('DATABASE_URL');

    const sql = neon(databaseUrl);

    this.db = drizzle(sql, {
      schema,
    });
  }
}

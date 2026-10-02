import { Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';

import { DatabaseService } from '../database/database.service.js';
import { transactions } from '../database/schema/transactions.schema.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';

@Injectable()
export class TransactionsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(userId: string, dto: CreateTransactionDto) {
    const [transaction] = await this.databaseService.db
      .insert(transactions)
      .values({
        userId,
        type: dto.type,
        amount: dto.amount.toFixed(2),
        description: dto.description,
      })
      .returning();

    return transaction;
  }

  async findMine(userId: string) {
    return this.databaseService.db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt));
  }
}

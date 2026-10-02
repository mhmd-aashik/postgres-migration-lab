import {
  pgTable,
  uuid,
  varchar,
  numeric,
  timestamp,
} from 'drizzle-orm/pg-core';

import { users } from './users.schema.js';

export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),

  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),

  type: varchar('type', {
    length: 20,
  }).notNull(),

  amount: numeric('amount', {
    precision: 12,
    scale: 2,
  }).notNull(),

  description: varchar('description', {
    length: 255,
  }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});

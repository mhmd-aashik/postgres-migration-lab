import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';

import { users } from './users.schema.js';

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),

  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),

  title: varchar('title', {
    length: 200,
  }).notNull(),

  content: text('content').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});

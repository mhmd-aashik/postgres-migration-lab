import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';

import { users } from './users.schema.js';

export const profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),

  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),

  phone: varchar('phone', { length: 30 }),

  city: varchar('city', { length: 100 }),

  country: varchar('country', { length: 100 }),

  bio: text('bio'),

  avatarUrl: text('avatar_url'),

  createdAt: timestamp('created_at').defaultNow().notNull(),

  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

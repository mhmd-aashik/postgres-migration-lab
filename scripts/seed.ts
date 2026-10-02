import 'dotenv/config';

import { faker } from '@faker-js/faker';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as argon2 from 'argon2';

import {
  users,
  profiles,
  posts,
  transactions,
} from '../src/database/schema/index.js';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is missing');
}

const sql = neon(databaseUrl);

const db = drizzle(sql);

const USER_COUNT = 1_000;
const POSTS_PER_USER = 10;
const TRANSACTIONS_PER_USER = 50;

async function seed() {
  console.log('🌱 Starting seed...');

  const passwordHash = await argon2.hash('Password123!');

  // -------------------------
  // USERS
  // -------------------------

  console.log('Creating users...');

  const userRows = Array.from({
    length: USER_COUNT,
  }).map(() => ({
    name: faker.person.fullName(),

    email: faker.internet.email().toLowerCase(),

    passwordHash,
  }));

  const createdUsers = await db.insert(users).values(userRows).returning({
    id: users.id,
  });

  console.log(`✅ ${createdUsers.length} users created`);

  // -------------------------
  // PROFILES
  // -------------------------

  console.log('Creating profiles...');

  const profileRows = createdUsers.map((user) => ({
    userId: user.id,

    phone: faker.phone.number(),

    city: faker.location.city(),

    country: faker.location.country(),

    bio: faker.person.bio(),
  }));

  await db.insert(profiles).values(profileRows);

  console.log(`✅ ${profileRows.length} profiles created`);

  // -------------------------
  // POSTS
  // -------------------------

  console.log('Creating posts...');

  const postRows = createdUsers.flatMap((user) =>
    Array.from({
      length: POSTS_PER_USER,
    }).map(() => ({
      userId: user.id,

      title: faker.lorem.sentence({
        min: 3,
        max: 8,
      }),

      content: faker.lorem.paragraphs(2),
    })),
  );

  console.log(`Prepared ${postRows.length} posts`);

  // Insert in batches.
  for (let i = 0; i < postRows.length; i += 500) {
    const batch = postRows.slice(i, i + 500);

    await db.insert(posts).values(batch);

    console.log(
      `Posts: ${Math.min(i + 500, postRows.length)}/${postRows.length}`,
    );
  }

  // -------------------------
  // TRANSACTIONS
  // -------------------------

  console.log('Creating transactions...');

  const transactionRows = createdUsers.flatMap((user) =>
    Array.from({
      length: TRANSACTIONS_PER_USER,
    }).map(() => ({
      userId: user.id,

      type: faker.helpers.arrayElement(['credit', 'debit']),

      amount: faker.finance.amount({
        min: 1,
        max: 5000,
        dec: 2,
      }),

      description: faker.commerce.productName(),
    })),
  );

  console.log(`Prepared ${transactionRows.length} transactions`);

  for (let i = 0; i < transactionRows.length; i += 500) {
    const batch = transactionRows.slice(i, i + 500);

    await db.insert(transactions).values(batch);

    console.log(
      `Transactions: ${Math.min(
        i + 500,
        transactionRows.length,
      )}/${transactionRows.length}`,
    );
  }

  console.log('🎉 Seed completed');
}

seed()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

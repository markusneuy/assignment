import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const rights = mysqlTable('rights', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 256 }).unique(),
});

export type Right = typeof rights.$inferSelect;

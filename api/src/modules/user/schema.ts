import { mysqlTable, varchar, int, primaryKey } from 'drizzle-orm/mysql-core';
import { roles } from '../role/schema';
import { relations } from 'drizzle-orm';

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  firstName: varchar('first_name', { length: 256 }),
  lastName: varchar('last_name', { length: 256 }),
  email: varchar('email', { length: 256 }),
  phone: varchar('phone', { length: 256 }),
});

export const userRelations = relations(users, ({ many }) => ({
  roles: many(userRoles),
}));

export type User = typeof users.$inferSelect;

export const userRoles = mysqlTable('user_roles', {
  role: int('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
  user: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
}, (userRolesTable) => ({
  pk: primaryKey({ columns: [userRolesTable.user, userRolesTable.role] }),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  role: one(roles, {
    fields: [userRoles.role],
    references: [roles.id],
  }),
  user: one(users, {
    fields: [userRoles.user],
    references: [users.id],
  }),
}));

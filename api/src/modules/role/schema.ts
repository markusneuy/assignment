import { int, mysqlTable, primaryKey, varchar } from 'drizzle-orm/mysql-core';
import { rights } from '../right/schema';
import { relations } from 'drizzle-orm';
import { userRoles } from '../user/schema';

export const roles = mysqlTable('roles', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 256 }).unique(),
});

export type Role = typeof roles.$inferSelect;

export const roleRights = mysqlTable('role_rights', {
  roleId: int('role_id').references(() => roles.id, { onDelete: 'cascade' }),
  rightId: int('right_id').references(() => rights.id, { onDelete: 'cascade' })
}, (roleRightsTable) => ({
  pk: primaryKey({ columns: [roleRightsTable.roleId, roleRightsTable.rightId] }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(userRoles),
  rights: many(roleRights),
}));

export const roleRightsRelations = relations(roleRights, ({ one }) => ({
  role: one(roles, {
    fields: [roleRights.roleId],
    references: [roles.id],
  }),
  right: one(rights, {
    fields: [roleRights.rightId],
    references: [rights.id],
  }),
}));

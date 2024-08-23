import { MySql2Database } from 'drizzle-orm/mysql2';
import db from '../../common/db';
import { eq, sql } from 'drizzle-orm';
import { Role, roleRights, roles } from './schema';
import { notInArray } from 'drizzle-orm';

class RoleService {
  db: MySql2Database

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async getRoles(): Promise<Role[]> {
    const result = await db.query.roles.findMany({
      with: {
        rights: {
          with: {
            right: true
          },
        }
      },
    });

    return result;
  }

  async createRole(role: Omit<Role, 'id'>): Promise<number> {
    const result = await this.db.insert(roles).values(role).$returningId();

    return result?.[0].id;
  }

  async removeRole(id: number) {
    await this.db.delete(roles).where(eq(roles.id, id));
  }

  async assignRightToRole(roleId: number, rightIds: number[]): Promise<void> {
    const insertValues = rightIds.map((rightId) => ({ roleId, rightId }));

    if (!insertValues.length) {
      await this.db.delete(roleRights).where(eq(roleRights.roleId, roleId))
      return;
    }

    // transaction
    await this.db.delete(roleRights).where(notInArray(roleRights.rightId, rightIds))

    await this.db.insert(roleRights).values(insertValues).onDuplicateKeyUpdate({ set: { roleId: sql`role_id` } });
  }
}

export default new RoleService(db as unknown as MySql2Database);

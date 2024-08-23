import { MySql2Database } from 'drizzle-orm/mysql2';
import { User, userRoles, users } from './schema';
import { eq, sql } from 'drizzle-orm';
import db from '../../common/db';

class UserService {
  db: MySql2Database

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async getUsers(): Promise<User[]> {
    const result = await db.query.users.findMany({
      with: {
        roles: {
          with: {
            role: true
          },
        },
      },
    });

    return result;
  }

  async createUser(user: Omit<User, 'id'>): Promise<number> {
    const result = await this.db.insert(users).values(user).$returningId();

    return result?.[0].id;
  }

  async updateUser(userId: number, user: Omit<User, 'id'>): Promise<void> {
    await this.db.update(users).set(user).where(eq(users.id, userId));
  }

  async assignUserRole(userId: number, roleIds: number[]): Promise<void> {
    const values = roleIds.map((roleId) => ({ role: roleId, user: userId }));

    if (!values.length) {
      await this.db.delete(userRoles).where(eq(userRoles.user, userId))
      return;
    }

    await this.db.insert(userRoles).values(values).onDuplicateKeyUpdate({ set: { user: sql`user_id` } });

  }

  async removeUser(userId: number): Promise<void> {
    await this.db.delete(users).where(eq(users.id, userId))
  }
}

export default new UserService(db as unknown as MySql2Database);

import { MySql2Database } from 'drizzle-orm/mysql2';
import db from '../../common/db';
import { Right, rights } from './schema';
import { eq } from 'drizzle-orm';

class RightService {
  db: MySql2Database

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async getRights() {
    const result = await db.query.rights.findMany({});

    return result;
  }

  async getRight(id: number): Promise<Right | null> {
    const queryResult = await this.db.select().from(rights).where(eq(rights.id, id)).limit(1);

    const result = queryResult[0]

    return result;
  }

  async createRight(right: Omit<Right, 'id'>): Promise<number> {
    const result = await this.db.insert(rights).values(right).$returningId();

    return result?.[0].id;
  }

  async updateRight(id: number, right: Omit<Right, 'id'>): Promise<void> {
    await this.db.update(rights).set(right).where(eq(rights.id, id));
  }

  async removeRight(id: number) {
    await this.db.delete(rights).where(eq(rights.id, id));
  }
}

export default new RightService(db as unknown as MySql2Database);

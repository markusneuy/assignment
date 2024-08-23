import { migrate } from 'drizzle-orm/mysql2/migrator';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

import config from '../common/config';

const { host, user, database, password } = config.db;

const runMigrations = async () => {
  const connection = await mysql.createConnection({
    host,
    user,
    password,
    database,
    multipleStatements: true,
  });

  const db = drizzle(connection);

  await migrate(db, { migrationsFolder: './migrations' });

  await connection.end();
}

runMigrations();

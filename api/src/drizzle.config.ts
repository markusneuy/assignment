import { defineConfig } from 'drizzle-kit';
import config from './common/config'

const { host, user, database, password } = config.db;

export default defineConfig({
  schema: './src/modules/**/schema.ts',
  out: './migrations',
  dialect: 'mysql',
  dbCredentials: {
    host,
    user,
    password,
    database,
  },
});

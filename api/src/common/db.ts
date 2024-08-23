import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as userSchema from '../modules/user/schema';
import * as rightSchema from '../modules/right/schema';
import * as roleSchema from '../modules/role/schema';

import config from '../common/config';

const { host, user, database, password } = config.db;

const poolConnection = mysql.createPool({
  host,
  user,
  database,
  password,
});

const db = drizzle(poolConnection, {
  schema: {
    ...userSchema,
    ...rightSchema,
    ...roleSchema,
  },
  mode: 'default',
});

export default db;

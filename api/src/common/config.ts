import * as Joi from 'joi';

const logLevels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'];

export const schema = Joi.object({
  port: Joi.number().required(),
  logLevel: Joi.string().valid(...logLevels),
  db: {
    host: Joi.string().required(),
    user: Joi.string().required(),
    database: Joi.string().required(),
    password: Joi.string().required(),
  }
});

const config = {
  port: parseInt(process.env.PORT || '8080', 10),
  logLevel: process.env.LOG_LEVEL || 'warn',
  db: {
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER as string,
    database: process.env.DB_DATABASE as string,
    password: process.env.DB_PASSWORD as string,
  }
};

const { error } = schema.validate(config);

if (error) {
  // error on bootstrap, no logger available (+ circular dependency), so just use console.log
  console.log(
    JSON.stringify({
      message: 'ERROR: Failed to validate configuration.',
    }),
  );
  throw new Error('Config invalid');
}

export default config;

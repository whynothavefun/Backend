import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3000),

  PG_HOST: Joi.string().required(),
  PG_PORT: Joi.number().default(5432),
  PG_USER: Joi.string().required(),
  PG_PASSWORD: Joi.string().required(),
  PG_DATABASE: Joi.string().required(),
  AUTO_LOAD_SEQUELIZE_MODELS: Joi.boolean().default(true),
  SYNCHRONIZE_SEQUELIZE: Joi.boolean().default(true),

  PINATA_JWT: Joi.string().required(),
  PINATA_GATEWAY: Joi.string().required(),

  X_API_KEY: Joi.string().required(),
});

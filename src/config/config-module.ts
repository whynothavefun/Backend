import config from './env.config';
import { validationSchema } from './validation-schema.config';

export const configModuleConfig = {
  isGlobal: true,
  envFilePath: ['.env'],
  load: [config],
  validationSchema,
};

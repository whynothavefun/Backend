import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RedisIoAdapter } from './transaction/redis-adapter';
import { ExecException } from 'child_process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'x-api-key'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Whynothave.fun API')
    .setDescription('Backend for Frontend service')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
      },
      'x-api-key',
    )
    .addSecurityRequirements('x-api-key')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useWebSocketAdapter(new RedisIoAdapter(app));
  runMigrations();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();

export function runMigrations() {
  try {
    console.log('Connection has been established successfully.');

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { exec } = require('child_process');
    // eslint-disable-next-line sonarjs/no-os-command-from-path
    exec(`npx sequelize-cli db:migrate`, (err: ExecException | null, stdout: string, stderr: string) => {
      if (err) {
        console.error(`Error running migrations: ${err.message}`);
        return;
      }
      console.log(`Migrations result: ${stdout}`);
      if (stderr) {
        console.error(`Migrations stderr: ${stderr}`);
      }
    });
  } catch (error: unknown) {
    console.error('Unable to connect to the database:', error);
  }
}

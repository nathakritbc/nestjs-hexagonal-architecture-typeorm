import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
// import cookieParser from 'cookie-parser';
import { port } from './configs/app.config';

const corsOrigins = ['http://localhost:7000'];

async function bootstrap() {
  // eslint-disable-next-line @typescript-eslint/await-thenable
  // await otlpSdk.start();
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  setupSwagger(app);
  setupPipes(app);
  setupCors(app);
  // app.use(cookieParser());
  console.log('bootstrap DEFAULT_PASSWORD', process.env.DEFAULT_PASSWORD);

  const logger = setupLogger(app);
  await app.listen(port, () => {
    logger.log(`Server is running on port ${port}`);
    // logger.error({ message: 'test', data: { name: 'John', age: 30 } });
  });
}

void bootstrap();

function setupLogger(app: INestApplication): Logger {
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.flushLogs();
  return logger;
}

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Nest example API')
    .setDescription('The Nest example API description')
    .setVersion('1.0')
    .addTag('Nest example')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Enter JWT token',
    })
    .build();

  SwaggerModule.setup('api', app, () => SwaggerModule.createDocument(app, config));
}

function setupPipes(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // เปิดใช้งานการแปลงข้อมูลอัตโนมัติ
      whitelist: true, // ลบ properties ที่ไม่อยู่ใน DTO
      forbidNonWhitelisted: true,
    }),
  );
}

function setupCors(app: INestApplication) {
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
}

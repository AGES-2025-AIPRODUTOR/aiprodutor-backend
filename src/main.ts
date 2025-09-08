import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  // Define o prefixo global para a API
  app.setGlobalPrefix('api/v1', {
    exclude: ['/'],
  });

  // Configura o Swagger
  const config = new DocumentBuilder()
    .setTitle('API Ai Produtor')
    .setDescription(
      'Documentação da API para o sistema de gestão de produtores',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch((err) => console.error(err));
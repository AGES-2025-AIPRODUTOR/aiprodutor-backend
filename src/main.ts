import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  // Define o prefixo global PRIMEIRO
  app.setGlobalPrefix('api/v1', {
    exclude: ['/'], // Exclui a rota raiz do prefixo
  });


  const config = new DocumentBuilder() // Cria a configuração do Swagger
    .setTitle('API Ai Produtor')
    .setDescription(
      'Documentação da API para o sistema de gestão de produtores', 
    )
    .setVersion('1.0')
    // A linha abaixo informa à interface do Swagger qual o prefixo do servidor
    .addServer('/api/v1') 
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch((err) => console.error(err));
// src/app.controller.ts
import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiExcludeController, ApiOperation } from '@nestjs/swagger';

@Controller()
@ApiExcludeController() // Esconde este controller da documentação do Swagger
export class AppController {
  @Get()
  @Redirect('/api-docs', 302) // Redireciona a rota '/' para '/api-docs'
  redirectToDocs() {}

  @Get('health')
  @ApiOperation({
    summary: 'Health check endpoint',
    description: 'Verifica se a API está funcionando',
  })
  getHealth() {
    return {
      status: 'OK',
      service: 'AiProdutor Backend',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    };
  }
}

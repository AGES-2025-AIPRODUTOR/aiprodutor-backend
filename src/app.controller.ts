// src/app.controller.ts

import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller()
@ApiExcludeController() // Esconde este controller da documentação do Swagger
export class AppController {
  @Get()
  @Redirect('/api-docs', 302) // Redireciona a rota '/' para '/api-docs' para que não apareçam erros
  redirectToDocs() {
  }
}
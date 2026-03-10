const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  // Definições básicas da API
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Pedidos - Desafio Jitterbit',
      version: '1.0.0',
      description: 'API para gerenciar pedidos, incluindo criação, leitura, atualização, exclusão e autenticação com JWT.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento',
      },
    ],
    // Adiciona a definição de segurança para JWT
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Arquivo que contêm as anotações da API 
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};

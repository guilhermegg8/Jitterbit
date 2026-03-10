const express = require('express');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./utils/errorHandler');
const setupSwagger = require('../swagger');

const app = express();

// Middleware para interpretar o corpo da requisição como JSON
app.use(express.json());

// Configura e serve a documentação do Swagger na rota /api-docs
setupSwagger(app);

// Middleware para usar as rotas de pedido
app.use('/', orderRoutes);

// Middleware de tratamento de erros
app.use(errorHandler);

module.exports = app;

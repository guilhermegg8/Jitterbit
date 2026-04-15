const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./utils/errorHandler');
const setupSwagger = require('../swagger');

const app = express();

// Middleware de segurança para cabeçalhos HTTP
app.use(helmet());

// Limitação de taxa para evitar ataques de força bruta
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limite de 100 requisições por janela por IP
    message: 'Muitas requisições deste IP, tente novamente após 15 minutos.'
});
app.use(limiter);

// Middleware para interpretar o corpo da requisição como JSON com limite de tamanho
app.use(express.json({ limit: '10kb' }));

// Configura e serve a documentação do Swagger na rota /api-docs
setupSwagger(app);

// Middleware para usar as rotas de pedido
app.use('/', orderRoutes);

// Middleware de tratamento de erros
app.use(errorHandler);

module.exports = app;

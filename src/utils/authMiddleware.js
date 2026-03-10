const jwt = require('jsonwebtoken');
const { sendError } = require('./responseHandler');

const protect = (req, res, next) => {
    let token;
    
    // Verifica se o token está no cabeçalho de autorização e começa com "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Pega o token (remove a palavra "Bearer ")
            token = req.headers.authorization.split(' ')[1];

            // Verifica se o token é válido usando a chave secreta
            jwt.verify(token, process.env.JWT_SECRET);

            // Se o token for válido, passa para a próxima função (o controller)
            next();
        } catch (error) {
            return sendError(res, 401, 'Não autorizado, token inválido.');
        }
    }

    if (!token) {
        return sendError(res, 401, 'Não autorizado, nenhum token fornecido.');
    }
};

module.exports = { protect };
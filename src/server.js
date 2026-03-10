require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./services/database');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectDB(); // Garante que o banco conectou antes de subir o servidor
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
        console.log(`Endpoints disponíveis em http://localhost:${PORT}` );
    });
};

startServer();

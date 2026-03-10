const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // erro no console para depuração
    
    // Resposta de erro para o cliente
    res.status(500).json({
        success: false,
        error: 'Ocorreu um erro interno no servidor.'
    });
};

module.exports = errorHandler;

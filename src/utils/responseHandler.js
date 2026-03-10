const sendSuccess = (res, statusCode, data, message = 'Operação bem-sucedida.') => {
    // Para status 204 (No Content), não envie corpo na resposta
    if (statusCode === 204) {
        return res.status(204).send();
    }
    res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

const sendError = (res, statusCode, message) => {
    res.status(statusCode).json({
        success: false,
        error: message
    });
};

module.exports = { sendSuccess, sendError };

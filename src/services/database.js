const mongoose = require('mongoose');
require('dotenv').config();

// Schema para os itens dentro de um pedido (subdocumento)
const itemSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
}, { _id: false }); // _id: false para não criar um ID de item separado no MongoDB

// Schema principal para o Pedido (Order)
const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true, index: true },
    value: { type: Number, required: true },
    creationDate: { type: Date, required: true },
    items: [itemSchema]
}, { timestamps: true }); // timestamps: true adiciona os campos createdAt e updatedAt automaticamente

const Order = mongoose.model('Order', orderSchema);

// Função assíncrona para conectar ao banco de dados
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB conectado com sucesso!');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error.message);
        process.exit(1); // Encerra a aplicação com falha se não conseguir conectar
    }
};

module.exports = { connectDB, Order };

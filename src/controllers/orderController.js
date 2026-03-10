const { Order } = require('../services/database');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// CREATE - Criar um novo pedido
const createOrder = async (req, res, next) => {
    try {
        const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

        if (!numeroPedido || !valorTotal || !dataCriacao || !items) {
            return sendError(res, 400, 'Dados incompletos. Verifique o corpo da requisição.');
        }

        const mappedOrder = {
            orderId: numeroPedido,
            value: valorTotal,
            creationDate: new Date(dataCriacao),
            items: items.map(item => ({
                productId: item.idItem,
                quantity: item.quantidadeItem,
                price: item.valorItem
            }))
        };

        const newOrder = new Order(mappedOrder);
        await newOrder.save();

        sendSuccess(res, 201, newOrder, 'Pedido criado com sucesso.');
    } catch (error) {
        if (error.code === 11000) {
            return sendError(res, 409, 'Conflito: Já existe um pedido com este numeroPedido.');
        }
        next(error);
    }
};

// READ (All) - Listar todos os pedidos
const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({});
        sendSuccess(res, 200, orders);
    } catch (error) {
        next(error);
    }
};

// READ (One) - Obter um pedido pelo ID
const getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await Order.findOne({ orderId: id });

        if (!order) {
            return sendError(res, 404, 'Pedido não encontrado.');
        }
        sendSuccess(res, 200, order);
    } catch (error) {
        next(error);
    }
};

// UPDATE - Atualizar um pedido
const updateOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const mappedUpdate = {};
        if (updateData.valorTotal) mappedUpdate.value = updateData.valorTotal;
        if (updateData.items) {
            mappedUpdate.items = updateData.items.map(item => ({
                productId: item.idItem,
                quantity: item.quantidadeItem,
                price: item.valorItem
            }));
        }

        const updatedOrder = await Order.findOneAndUpdate({ orderId: id }, mappedUpdate, { new: true });

        if (!updatedOrder) {
            return sendError(res, 404, 'Pedido não encontrado para atualização.');
        }
        sendSuccess(res, 200, updatedOrder, 'Pedido atualizado com sucesso.');
    } catch (error) {
        next(error);
    }
};

// DELETE - Deletar um pedido
const deleteOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedOrder = await Order.findOneAndDelete({ orderId: id });

        if (!deletedOrder) {
            return sendError(res, 404, 'Pedido não encontrado para exclusão.');
        }
        sendSuccess(res, 204); // 204 No Content - sucesso, mas sem corpo de resposta
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder
};

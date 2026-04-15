const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../utils/authMiddleware');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * tags:
 *   - name: Autenticação
 *     description: Endpoint para obter token de autenticação JWT.
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Autentica o usuário e retorna um token.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 example: jitterbit
 *               password:
 *                 type: string
 *                 example: challenge
 *     responses:
 *       200:
 *         description: Autenticação bem-sucedida, token retornado.
 *       401:
 *         description: Credenciais inválidas.
 */
router.post('/login', (req, res) => {
    const { user, password } = req.body;
    const adminUser = process.env.ADMIN_USER || 'jitterbit';
    const adminPass = process.env.ADMIN_PASSWORD || 'challenge';

    if (user === adminUser && password === adminPass) {
        const token = jwt.sign({ id: user }, process.env.JWT_SECRET, {
            expiresIn: '1h' // Token com duração de 1 hora
        });
        res.json({ success: true, token });
    } else {
        res.status(401).json({ success: false, error: 'Credenciais inválidas.' });
    }
});

/**
 * @swagger
 * tags:
 *   - name: Pedidos
 *     description: Operações para gerenciamento de pedidos. Requer autenticação.
 */

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Cria um novo pedido.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso.
 *       401:
 *         description: Não autorizado (token inválido ou ausente).
 */
router.post('/order', protect, orderController.createOrder);

/**
 * @swagger
 * /order/list:
 *   get:
 *     summary: Retorna a lista de todos os pedidos.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso.
 *       401:
 *         description: Não autorizado.
 */
router.get('/order/list', protect, orderController.getAllOrders);

/**
 * @swagger
 * /order/{id}:
 *   get:
 *     summary: Retorna um pedido específico pelo seu ID.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: "O ID do pedido (ex: v10089016vdb-01)."
 *     responses:
 *       200:
 *         description: Dados do pedido retornados com sucesso.
 *       404:
 *         description: Pedido não encontrado.
 *       401:
 *         description: Não autorizado.
 */
router.get('/order/:id', protect, orderController.getOrderById);

/**
 * @swagger
 * /order/{id}:
 *   put:
 *     summary: Atualiza um pedido existente.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: O ID do pedido a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderUpdateInput'
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso.
 *       404:
 *         description: Pedido não encontrado.
 *       401:
 *         description: Não autorizado.
 */
router.put('/order/:id', protect, orderController.updateOrder);

/**
 * @swagger
 * /order/{id}:
 *   delete:
 *     summary: Deleta um pedido existente.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: O ID do pedido a ser deletado.
 *     responses:
 *       204:
 *         description: Pedido deletado com sucesso (sem conteúdo).
 *       404:
 *         description: Pedido não encontrado.
 *       401:
 *         description: Não autorizado.
 */
router.delete('/order/:id', protect, orderController.deleteOrder);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     ItemInput:
 *       type: object
 *       properties:
 *         idItem:
 *           type: string
 *           description: ID do produto.
 *           example: "2434"
 *         quantidadeItem:
 *           type: integer
 *           description: Quantidade do item.
 *           example: 1
 *         valorItem:
 *           type: number
 *           description: Preço unitário do item.
 *           example: 10000
 *     OrderInput:
 *       type: object
 *       required:
 *         - numeroPedido
 *         - valorTotal
 *         - dataCriacao
 *         - items
 *       properties:
 *         numeroPedido:
 *           type: string
 *           example: "v10089016vdb-01"
 *         valorTotal:
 *           type: number
 *           example: 10000
 *         dataCriacao:
 *           type: string
 *           format: date-time
 *           example: "2023-07-19T12:24:11.529Z"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ItemInput'
 *     OrderUpdateInput:
 *       type: object
 *       properties:
 *         valorTotal:
 *           type: number
 *           example: 12500.50
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ItemInput'
 */

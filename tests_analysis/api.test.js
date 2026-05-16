const request = require('supertest');
const app = require('../src/app');
const { Order } = require('../src/services/database');
const mongoose = require('mongoose');

// Mocking Order model and mongoose.connect
jest.mock('../src/services/database', () => {
    // Create a mock constructor
    const mockOrderInstance = {
        save: jest.fn()
    };
    const mockOrderConstructor = jest.fn(() => mockOrderInstance);

    // Add static methods to the mock constructor
    mockOrderConstructor.find = jest.fn();
    mockOrderConstructor.findOne = jest.fn();
    mockOrderConstructor.findOneAndUpdate = jest.fn();
    mockOrderConstructor.findOneAndDelete = jest.fn();

    return {
        Order: mockOrderConstructor,
        connectDB: jest.fn().mockResolvedValue(true)
    };
});

const MockOrder = require('../src/services/database').Order;

describe('API Tests', () => {
    let token;

    beforeAll(async () => {
        // Ensure JWT_SECRET is set for the tests
        process.env.JWT_SECRET = 'supersecretjwtkey123';

        // Authenticate to get a token
        const response = await request(app)
            .post('/login')
            .send({
                user: 'jitterbit',
                password: 'challenge'
            });
        token = response.body.token;
    });

    describe('POST /login', () => {
        it('should login successfully with correct credentials', async () => {
            const response = await request(app)
                .post('/login')
                .send({
                    user: 'jitterbit',
                    password: 'challenge'
                });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body).toHaveProperty('token');
        });

        it('should fail to login with incorrect credentials', async () => {
            const response = await request(app)
                .post('/login')
                .send({
                    user: 'wrong',
                    password: 'wrong'
                });
            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });

    describe('Order Endpoints', () => {
        const sampleOrder = {
            numeroPedido: 'v123',
            valorTotal: 500,
            dataCriacao: '2023-10-27T10:00:00Z',
            items: [
                { idItem: 'item1', quantidadeItem: 2, valorItem: 250 }
            ]
        };

        it('should create a new order', async () => {
            const mockInstance = MockOrder();
            mockInstance.save.mockResolvedValue({
                orderId: 'v123',
                value: 500,
                creationDate: new Date('2023-10-27T10:00:00Z'),
                items: [{ productId: 'item1', quantity: 2, price: 250 }]
            });

            const response = await request(app)
                .post('/order')
                .set('Authorization', `Bearer ${token}`)
                .send(sampleOrder);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
        });

        it('should list all orders', async () => {
            MockOrder.find.mockResolvedValue([
                { orderId: 'v123', value: 500 }
            ]);

            const response = await request(app)
                .get('/order/list')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        it('should get an order by ID', async () => {
            MockOrder.findOne.mockResolvedValue({
                orderId: 'v123',
                value: 500
            });

            const response = await request(app)
                .get('/order/v123')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.orderId).toBe('v123');
        });

        it('should return 404 for non-existent order', async () => {
            MockOrder.findOne.mockResolvedValue(null);

            const response = await request(app)
                .get('/order/nonexistent')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });

        it('should update an order', async () => {
            MockOrder.findOneAndUpdate.mockResolvedValue({
                orderId: 'v123',
                value: 600
            });

            const response = await request(app)
                .put('/order/v123')
                .set('Authorization', `Bearer ${token}`)
                .send({ valorTotal: 600 });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.value).toBe(600);
        });

        it('should return 404 for non-existent order during update', async () => {
            MockOrder.findOneAndUpdate.mockResolvedValue(null);

            const response = await request(app)
                .put('/order/nonexistent')
                .set('Authorization', `Bearer ${token}`)
                .send({ valorTotal: 600 });

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('Pedido não encontrado para atualização.');
        });

        it('should delete an order', async () => {
            MockOrder.findOneAndDelete.mockResolvedValue({
                orderId: 'v123'
            });

            const response = await request(app)
                .delete('/order/v123')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(204);
        });
    });

    describe('Unauthorized access', () => {
        it('should return 401 for access without token', async () => {
            const response = await request(app)
                .get('/order/list');
            expect(response.status).toBe(401);
        });
    });
});

const request = require('supertest');
const { User } = require('../../models/users');

let server;

describe('/api/user', () => {
    beforeEach( async () => {
        server = require('../../Server');
        await User.collection.insertMany([
            { firstName: 'Test1', lastName: 'Test1', email: 'test1@easydocs.com', password: '123412341234'},
            { firstName: 'Test2', lastName: 'Test2', email: 'test2@easydocs.com', password: '123412341234'}
        ])
    });
    afterEach( async () => {
        await User.deleteMany({});
        await server.close();
    })
    
    describe('GET /', () => {
        it('should return all users', async () => {
            const res = await request(server).get('/api/user');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(user => user.firstName === 'Test1')).toBeTruthy();
            expect(res.body.some(user => user.firstName === 'Test2')).toBeTruthy();
        });
    })

    describe('POST /', () => {
        it('Should return 200 if registration was successful', async () => {
            const res = await   request(server).
                                post('/api/user').
                                send({ email: 'test@easydocs.com', firstName: 'test', lastName: 'test', password: '1234123412'});
            expect(res.status).toBe(200);
        });
        it('Should return 400 if there is a validation error', async () => {
            const res = await   request(server).post('/api/user').
                                send({ firstName: '', lastName: 'test', email:'test@gmail.com', password:'1234123412'});
            expect(res.status).toBe(400);
        })
    })
});
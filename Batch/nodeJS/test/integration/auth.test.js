const request = require('supertest');
const { User } = require('../../models/users');

let server, token;

describe('auth middleware', () => {
    beforeEach( async () => {
        server = require('../../Server');
        await User.collection.insertMany([  // update test-db
            { firstName: 'Test1', lastName: 'Test1', email: 'test1@easydocs.com', password: '123412341234'},
            { firstName: 'Test2', lastName: 'Test2', email: 'test2@easydocs.com', password: '123412341234'}
        ]);

        const user = await User.findOne({ email: 'test1@easydocs.com'}); //query user
        token = await user.generateAuthToken(); //generate token
    });
    afterEach( async () => {
        await User.deleteMany({});
        await server.close();
    })

    describe('POST /', () => {

        let exec = async () => {
            return await request(server).get('/api/user').set('x-auth-token', token);
        }
        it('should return 200 if token is valid', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
        });
        it('should return 401 if no token is provided', async () => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        });
        it('should return 400 if provided token is invalid', async () => {
            token='1';
            const res = await exec();

            expect(res.status).toBe(400);
        });
    })
});
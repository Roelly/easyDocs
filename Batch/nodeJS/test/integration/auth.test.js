/**
 * @jest-environment node
 */

const request = require('supertest');
const { getToken } = require('./test-methods');

let server, token;

describe('auth middleware', () => {
    beforeEach( async () => {
        server = require('../../Server');
        token = await getToken();
    });
    afterEach( async () => {
        await server.close();
    })

    describe('POST /', () => {

        let exec = async () => {
            return await request(server).get('/api/users').set('x-auth-token', token);
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
/**
 * @jest-environment node
 */

const request = require('supertest');
const { populateDB_docs, populateDB, getToken, deleteFromDB } = require('./test-methods');

describe('api/docs', () => {
    let body, server, token = getToken();
    beforeAll( async () => {
        server = require('../../Server');
        await populateDB_docs();
        await populateDB();
    });
    afterAll(async () => {
        await deleteFromDB();
        await server.close();
    })
    describe('GET / :client/:type', () => {
        let type;
        beforeEach( async () => {
            
            type = 'company1/errc';
        });

        const exec = async () => {
            return await request(server).get('/api/docs/'+ type).set('x-auth-token',token);
        }

        it('Should return 200 if document id is valid', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
        });
        it('Should return 404 if document no document was found', async () => {
            type = 'company1/rc';
            const res = await request(server).get('/api/docs/erc').set('x-auth-token',token)
            
            expect(res.status).toBe(404);
        });
    });
    describe('POST /', () => { 
        const exec = async () => {
            return await request(server).
            post('/api/docs').
            set('x-auth-token',token).
            send({
                title: 'OJCV',
                body: body,
                typeID: '5c94c238ca26cf0d6c86e34f',
                clientID: '5c94c21bca26cf0d6c86e34d'
            });
        };
        it('Should return 200 if document was uploaded successfully', async () => {
            body = 'Variable substitution has failed, it must be checked and corrected';

            const res = await exec();
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('title');
            expect(res.body).toHaveProperty('type');
            expect(res.body).toHaveProperty('client');
        });
        it('Should return 400 if there is a validation error', async () => {
            body = '';

            const res = await exec();

            expect(res.status).toBe(400);
        });
    });
});
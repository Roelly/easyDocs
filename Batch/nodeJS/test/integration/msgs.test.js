/**
 * @jest-environment node
 */

const request = require('supertest');
const { getToken, populateDB_msgs, populateDB, deleteFromDB } = require('./test-methods');

let server;

describe('/api/msgs', () => {
    let token = getToken();
    let query;
    
    beforeAll(async () => {
        server = require('../../Server');// connecting to server
        await populateDB();             // populate test-db with users
        await populateDB_msgs();       // populate test-db with messages
    });
    afterAll( async () => {
        await deleteFromDB();  // delete from test-db
        await server.close();     // closing connection
    })
    describe('GET / ', ()=> {
        beforeEach(() => {
            query = '';
        })
        const exec = async () => {
            return await request(server).get('/api/msgs/'+query).set('x-auth-token', token);
        };
        it('Should return 200 if all messages are returned', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(4);
        });
        it('Should return 200 if all messages are displayed from Tamas', async () => {
            query = '?user.name=Tamas';
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
        });
        it('Should return 404 if no message found for Tomi', async () => {
            query = '?user.name=Tomi';
            const res = await exec();

            expect(res.status).toBe(404);
        });
    });

    describe('GET /:client', () => {
        beforeEach(() => {
            query ='';
        })
        const exec = async () => {
            return await request(server).get('/api/msgs/company1'+query).set('x-auth-token', token);
        };
        it('Should return 200 if :client is valid', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);
        });
        it('Should return 200 if :client message is displayed for Tamas', async () => {
            query = '?user.name=Tamas';
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
        });
        it('Should return 404 if :client message is not found for Tomi', async () => {
            query = '?user.name=Tomi'
            const res = await exec();

            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {
        let clientID,title;
        beforeEach(() => {
            clientID = '5c94c21bca26cf0d6c86e34d';
            title = 'Please beware of this';
        })

        const exec = async () => {
            return await request(server).post('/api/msgs')
            .set('x-auth-token', token)
            .send({ title, clientID, body: 'Once I will be a successful developer.' });
        }
        it('Should return 200 if upload was successfull', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('title');
            expect(res.body).toHaveProperty('body');
            expect(res.body).toHaveProperty('client._id');
            expect(res.body).toHaveProperty('user._id');
        });
        it('Should return 400 there is a validation error', async () => {
            title = '';
            const res = await exec();

            expect(res.status).toBe(400);
        });
    });
});
/**
 * @jest-environment node
*/

const request = require('supertest');
const { getToken, populateDB, deleteFromDB } = require('./test-methods');

describe('/api/users', () => {
    let server, email = 'test@easydocs.com', token = getToken();
    
    beforeAll( async () => {               // **Preparation**
        server = require('../../Server');   //connect   
    });
    afterAll( async () => {                // after the test
        await deleteFromDB();               //Delete from DB
        await server.close();               // close the connection
    });
    describe('GET /', () => {
        beforeAll(async () => {
            await populateDB();             //Prepopulate DB
        });

        it('should return all users', async () => {
            const res = await request(server).get('/api/users/').set('x-auth-token', token);

            expect(res.status).toBe(200);
            expect(res.body.some(user => user.firstName === 'test1')).toBeTruthy();
            expect(res.body.some(user => user.firstName === 'test2')).toBeTruthy();
        });
    });
    describe('POST /', () => {
        const exec = async () => {      // ** Factor function for HTTP POST request
            return await request(server).
                        post('/api/users').
                        send({ email: email, firstName: 'test', lastName: 'test', password: '1234123412'}).
                        set('x-auth-token', token);
        };
        it('Should return 200 if registration was successful', async () => {
            const res = await exec();
            
            expect(res.status).toBe(200);
        });
        it('Should return 400 if there is a validation error', async () => {
            email = 'abc';
            const res = await exec();

            expect(res.status).toBe(400);
        });
    });
});
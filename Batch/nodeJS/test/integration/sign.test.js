/**
 * @jest-environment node
 */

const request = require('supertest');
const { getToken, populateDB, deleteFromDB } = require('./test-methods');

let email, password ,server;
let token = getToken();;

describe('/api/sign', () => {
    beforeAll(async () => {
        server = require('../../Server');   // connecting to server 
        await populateDB();
    });
    afterAll( async () => {
        await deleteFromDB();       //deleting from test-db
        await server.close();       //closing connection
    })

    describe('POST / sign in', ()=> {
        beforeEach(async () => {
            email = "test1@easydocs.com";  //setting up valid email and pw
            password = "12345678";
        });
        const exec = async () => {         // Factory function for HTTP request
                        return await request(server).
                                    post('/api/sign').
                                    send({ email: email, password: password}).
                                    set('x-auth-token', token);
        };
        it('Should return 400 in case the email is invalid', async () => {
            email = 'invalidemail';
            const res = await exec();

            expect(res.status).toBe(400);
        });
        it('Should return 400 in case the password is invalid', async () => {
            password = 'invalidpassword';
            const res = await exec();

            expect(res.status).toBe(400);
        });
        it('Should return 200 in case the credentials are valid', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("token");
        });
    })

})
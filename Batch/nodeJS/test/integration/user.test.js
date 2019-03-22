const request = require('supertest');

const { getToken, populateDB } = require('./test-methods');
const { User } = require('../../models/users');

describe('/api/user', () => {
    let server;
    let token;

    beforeEach( async () => {               // **Preparation**
        server = require('../../Server');   //connect   
        token = await getToken();           //get auth-token
    });
    afterEach( async () => {                // after the test
        await User.deleteMany({});          // delete all in DB

        await server.close();               // close the connection
    })
    
    describe('GET /', () => {
        beforeEach(async () => {
            await populateDB();             //Prepopulate DB
        });

        it('should return all users', async () => {
            const res = await request(server).get('/api/user').set('x-auth-token', token);

            expect(res.status).toBe(200);
            expect(res.body.some(user => user.firstName === 'test1')).toBeTruthy();
            expect(res.body.some(user => user.firstName === 'test2')).toBeTruthy();
        });
    })

    describe('POST /', () => {
        let email = 'test@easydocs.com';

        const exec = async () => {      // ** Factor function for HTTP POST request
            return await request(server).
                        post('/api/user').
                        send({ email: email, firstName: 'test', lastName: 'test', password: '1234123412'}).
                        set('x-auth-token', token);
        }

        it('Should return 200 if registration was successful', async () => {
            const res = await exec();
            
            expect(res.status).toBe(200);
        });
        
        it('Should return 400 if there is a validation error', async () => {
            email = 'abc';
            const res = await exec();

            expect(res.status).toBe(400);
        })
    })
});
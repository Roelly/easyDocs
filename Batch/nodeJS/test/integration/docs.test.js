const request = require('supertest');
const { Document } = require('../../models/docs');
const { User } = require('../../models/users');
const { populateDB_docs, populateDB, getToken } = require('./test-methods');

let server, token;

describe('api/docs', () => {
    beforeEach( async () => {
        server = require('../../Server');
        token = await getToken();
    });
    afterEach(async () => {
        await Document.deleteMany({});
        await server.close();
    })
    describe('GET /', () => {
        let id;
        beforeEach(async () => {
            await populateDB_docs();
            const doc = await Document.findOne({ title: "SB37" });
            id = '/' + doc._id;
        })
        const exec = async () => {  // factory function
            return await request(server).get('/api/docs'+id).set('x-auth-token',token);
        };

        it('Should return 200 if all document is found', async () => {
            id = '';
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.some(doc => doc.title === 'SB37')).toBeTruthy();
            expect(res.body.some(doc => doc.title === 'IPL')).toBeTruthy();
        });
        it('Should return 200 if document id is valid', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("title");
            expect(res.body).toHaveProperty("body");
        });
        it('Should return 404 if document id is invalid', async () => {
            id = id.replace(/[^W]/,'0');    //change a character in the objectid
            const res = await exec();
            
            expect(res.status).toBe(404);
        });
        it('Should return 404 if document id is invalid', async () => {
            id = '1';    //change a character in the objectid
            const res = await exec();
            
            expect(res.status).toBe(404);
        });
    });
    let body, user;
    describe('POST /', () => {
        
        beforeEach( async () => {
            await populateDB();
            user = await User.findOne({ email: 'test2@easydocs.com'});
        })
        afterEach( async () => {
            await User.deleteMany({});
        })
        const exec = async () => {
            return await request(server).
            post('/api/docs').
            set('x-auth-token',token).
            send({
                title: 'OJCV',
                body: body,
                typeID: '5c94c238ca26cf0d6c86e34f',
                clientID: '5c94c21bca26cf0d6c86e34d',
                userID: user._id
            });
        }
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
        })
    });
});
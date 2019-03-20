const request = require('supertest');
const bcrypt = require('bcrypt');

const { Document } = require('../../models/docs');
const { User } = require('../../models/users');

let server, token;
const documents = [
    { title: "SB37", body: "Space issue", type: "ERRC", date: Date.now(), user:"id1", modified: "", modified_user: "", checked : [], checkCount : 0 },
    { title: "IPL", body: "How to implement IPL", type: "PROC", date: Date.now(), user:"id2", modified: "", modified_user: "", checked : [], checkCount : 0 }
];

describe('api/documents', () => {
    beforeEach( async () => {
        server = require('../../Server');

        await Document.collection.insertMany(documents);
        let pass = '12345678';
        const salt = bcrypt.genSalt(10);
        pass = await bcrypt.hash(pass, salt);
        await User.collection.insert({ email: "test@easydocs.com", firstName: "test", lastName: "test", password: pass});
        let user = User.findOne({ email: "test@easydocs.com" });
        token = user.generateAuthToken();
    })
    describe('GET /', () => {
        const exec = async () => {
            return await request(server).get('/api/document').set('x-auth-token', token);
        }

        it('Should return 200 if all document is listed', async () => {
        const res = await exec();

        expect(res).toBe(200);
        expect(res.body).not.toBe({});
        expect(res.body).toMatchObject(documents);

        })
        it('Should return 404 if no document found', async () => {
            
        })
        it('Should return 500 if something went wrong', async () => {
            
        })
    })
    describe('POST /', () => {
        
    })
});
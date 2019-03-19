const request = require('supertest');
const { User } = require('../../models/users');

const bcrypt = require('bcrypt');

let server;

describe('/api/sign', () => {
    beforeEach(async () => {
        server = require('../../Server');
        const password = '123412341234';
        const salt = await bcrypt.genSalt(10);
        const pass =  await bcrypt.hash(password,salt);
        let user = new User({
            email: "test@easydocs.com",
            firstName: "test",
            lastName: "test",
            password: pass
        });
        await user.save();
    });
    afterEach( async () => {
        await User.deleteMany({});
        await server.close();
    })

    describe('POST /', ()=> {
        it('Should return 400 in case the email is invalid', async () => {
            const res = await request(server).
                        post('/api/sign').
                        send({ email: "invalidemail@easydocs.com", password: "123412341234"});
            expect(res.status).toBe(400);
        });
        it('Should return 400 in case the password is invalid', async () => {
            const res = await request(server).
                        post('/api/sign').
                        send({ email: "test@easydocs.com", password: "invalidpassword"});
            expect(res.status).toBe(400);
        });
        it('Should return 200 in case the credentials are valid', async () => {
            const res = await request(server).
                        post('/api/sign').
                        send({ email: "test@easydocs.com", password: "123412341234"});
                        console.log(res.body);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("token");
        });
    })

})
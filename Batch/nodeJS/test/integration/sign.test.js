const request = require('supertest');
const { User } = require('../../models/users');

const bcrypt = require('bcrypt');

let user, email, password ,server;

describe('/api/sign', () => {
    beforeEach(async () => {
        server = require('../../Server');   // connecting to server 
        const password = '123412341234';    // creating user
        const salt = await bcrypt.genSalt(10);
        const pass =  await bcrypt.hash(password,salt);
        user = new User({
            email: "test@easydocs.com",
            firstName: "test",
            lastName: "test",
            password: pass
        });
        await user.save();
    });
    afterEach( async () => {
        await User.deleteMany({});  //deleting from test-db
        await server.close();       //closing connection
    })

    describe('POST / sign in', ()=> {
        let token;
        beforeEach(async () => {
            email = "test@easydocs.com";  //setting up valid email and pw
            password = "123412341234";
            token = await user.generateAuthToken();
        })
        
        const exec = async () => {

            return await request(server).
                        post('/api/sign').
                        send({ email: email, password: password}).
                        set('x-auth-token', token);
        }

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
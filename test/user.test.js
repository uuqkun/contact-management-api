import supertest from "supertest";
import { prismaClient } from "../src/application/database.js";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";
import { createUser, getTestUser, removeTestedUser } from "./test-util.js";
import { log } from "winston";
import bcrypt from "bcrypt";


describe('POST /api/users', () => {
    afterEach(async () => {
        await removeTestedUser();
    });

    test('should register new user', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: "test",
                password: "secret",
                name: "test"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test');
        expect(result.body.data.password).toBeUndefined();
        expect(result.body.data.name).toBe('test');

    })

    test('should reject if user is invalid', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: "",
                password: "",
                name: ""
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    test('should reject if username already exist', async () => {
        let result = await supertest(web)
            .post('/api/users')
            .send({
                username: "test",
                password: "secret",
                name: "test"
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test');
        expect(result.body.data.password).toBeUndefined();
        expect(result.body.data.name).toBe('test');

        result = await supertest(web)
            .post('/api/users')
            .send({
                username: "test",
                password: "secret",
                name: "test"
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();

    })
})

describe('POST /api/users/login', () => {
    beforeEach(async () => {
        await createUser();
    })

    afterEach(async () => {
        await removeTestedUser();
    })

    test('should logged in successfully', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'test',
                password: 'secret'
            });

        logger.info(result.body)

        expect(result.status).toBe(200);
        expect(result.body.data.token).toBeDefined();
        expect(result.body.data.token).not.toBe('test');
    })

    test('should reject login req if req is invalid', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: '',
                password: ''
            });

        logger.info(result.body)

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    })

    test('should reject login password is invalid', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'test',
                password: 'sss'
            });

        logger.info(result.body)

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    })

    test('should reject login username is invalid', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'fsfs',
                password: 'secret'
            });

        logger.info(result.body)

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    })
})

describe('GET /api/users/current', () => {
    beforeEach(async () => {
        await createUser();
    })

    afterEach(async () => {
        await removeTestedUser();
    })

    test('should get user data', async () => {
        const result = await supertest(web)
            .get('/api/users/current')
            .set('Authorization', 'test');

        logger.info(result.body)
        logger.info(result)

        expect(result.status).toBe(200);
        expect(result.request.method).toBe('GET')
        expect(result.body.data.username).toBe('test');
        expect(result.body.data.name).toBe('test');
    });

    test('should reject if invalid token', async () => {
        const result = await supertest(web)
            .get('/api/users/current')
            .set('Authorization', 'fsf');

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });

    test('should reject if unauthenticated', async () => {
        const result = await supertest(web)
            .get('/api/users/current');

        // logger.info(result)

        expect(result.status).toBe(401)
        expect(result.body.errors).toBe('Unauthorized')
    });
})

describe('PATCH /api/users/current', () => {
    beforeEach(async () => {
        await createUser();
    })

    afterEach(async () => {
        await removeTestedUser();
    })

    test('should update user', async () => {
        const result = await supertest(web)
            .patch('/api/users/current')
            .set("Authorization", 'test')
            .send({
                name: 'uqie',
                password: 'pass'
            });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test');
        expect(result.body.data.name).toBe('uqie');

        const user = await getTestUser();
        expect(await bcrypt.compare("pass", user.password)).toBe(true)

    });

    test('should only update user`s name', async () => {
        const result = await supertest(web)
            .patch('/api/users/current')
            .set("Authorization", 'test')
            .send({
                name: 'uqie'
            });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test');
        expect(result.body.data.name).toBe('uqie');
    });

    test('should only update user`s password', async () => {
        const result = await supertest(web)
            .patch('/api/users/current')
            .set("Authorization", 'test')
            .send({
                password: 'useruser'
            });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test');
        expect(result.body.data.name).toBe('test');

        const user = await getTestUser();
        expect(await bcrypt.compare("useruser", user.password)).toBe(true)
    });

    test('should reject if sent invalid token', async () => {
        const result = await supertest(web)
            .patch('/api/users/current')
            .set("Authorization", 'tokensalah')
            .send({
                password: 'useruser'
            });

        expect(result.status).toBe(401);
    });
});

describe('DELETE /api/users/logout', () => {
    beforeEach(async () => {
        await createUser();
    })

    afterEach(async () => {
        await removeTestedUser();
    })

    test('should be able to logout', async () => {
        const result = await supertest(web)
            .delete('/api/users/logout')
            .set("Authorization", 'test');

        expect(result.status).toBe(200);
        expect(result.body.data).toBe("OK");

        const user = await getTestUser();
        expect(user.token).toBeNull();
    });

    test('should reject if invalid token', async () => {
        const result = await supertest(web)
            .delete('/api/users/logout')
            .set("Authorization", 'wrong');

        expect(result.status).toBe(401);
    });

})

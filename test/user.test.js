import supertest from "supertest";
import { prismaClient } from "../src/application/database.js";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";
import { createUser, removeTestedUser } from "./test-util.js";
import { log } from "winston";


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

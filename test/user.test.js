import supertest from "supertest";
import { prismaClient } from "../src/application/database.js";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";


describe('POST /api/users', () => {
    afterEach(async () => {
        await prismaClient.user.deleteMany({
            where: {
                username: 'rchmd'
            }
        });
    });

    test('should register new user', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: "rchmd",
                password: "secret",
                name: "uqie rachmadie"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('rchmd');
        expect(result.body.data.password).toBeUndefined();
        expect(result.body.data.name).toBe('uqie rachmadie');

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
                username: "rchmd",
                password: "secret",
                name: "uqie rachmadie"
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('rchmd');
        expect(result.body.data.password).toBeUndefined();
        expect(result.body.data.name).toBe('uqie rachmadie');

        result = await supertest(web)
            .post('/api/users')
            .send({
                username: "rchmd",
                password: "secret",
                name: "uqie rachmadie"
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();

    })
})
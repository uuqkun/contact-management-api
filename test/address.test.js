import supertest from "supertest";
import { createTestContact, createUser, removeAllTestAddresses, removeAllTestContact, removeTestedUser } from "./test-util.js";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";


describe('POST /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
        await createUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContact();
        await removeTestedUser();
    });

    test('should able to create new address', async () => {
        const testContact = await createTestContact();

        const result = await supertest(web)
            .post(`/api/contacts/${testContact.id}/addresses`)
            .set('Authorization', 'test')
            .send({
                street: 'test', 
                city: 'test',
                province: 'test',
                country: 'test',
                postal_code: 'test'
            });

            expect(result.status).toBe(200);
            expect(result.body.data.id).toBeDefined();
            expect(result.body.data.city).toBe('test');
            expect(result.body.data.province).toBe('test');
            expect(result.body.data.country).toBe('test');
            expect(result.body.data.postal_code).toBe('test');
            expect(result.body.data.street).toBe('test');
    });

    test('should response 404 if contact is not found', async () => {
        const testContact = await createTestContact();

        const result = await supertest(web)
            .post(`/api/contacts/${(testContact.id + 1)}/addresses`)
            .set('Authorization', 'test')
            .send({
                street: 'test', 
                city: 'test',
                province: 'test',
                country: 'test',
                postal_code: 'test'
            });

            expect(result.status).toBe(404);
            expect(result.error).toBeDefined();
    });

    test('should response 401 if user unauthorized', async () => {
        const testContact = await createTestContact();

        const result = await supertest(web)
            .post(`/api/contacts/${testContact.id}/addresses`)
            .set('Authorization', '')
            .send({
                street: 'test', 
                city: 'test',
                province: 'test',
                country: 'test',
                postal_code: 'test'
            });

            expect(result.status).toBe(401);
            expect(result.error).toBeDefined();
    });

    test('should response 400 if there`s empty field', async () => {
        const testContact = await createTestContact();

        const result = await supertest(web)
            .post(`/api/contacts/${testContact.id}/addresses`)
            .set('Authorization', 'test')
            .send({
                street: 'test', 
                city: 'test',
                province: 'test',
                country: '',
                postal_code: ''
            });

            logger.info(result)
            expect(result.status).toBe(400);
            expect(result.error).toBeDefined();
    });
});
import supertest from "supertest";
import { createManyTestContact, createTestContact, createUser, getTestContact, removeAllTestContact, removeTestedUser } from "./test-util.js";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";

describe('POST /api/contacts', () => {

    beforeEach(async () => {
        await createUser();
    });

    afterEach(async () => {
        await removeAllTestContact();
        await removeTestedUser();
    });


    test('should be able to create new contact', async () => {
        const result = await supertest(web)
            .post('/api/contacts')
            .set('Authorization', 'test')
            .send({
                first_name: 'uqie',
                last_name: 'rach',
                email: 'uqierach@gmail.com',
                phone: '085755803320'
            });

        logger.info(result)

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined()
        expect(result.body.data.first_name).toBe('uqie');
        expect(result.body.data.last_name).toBe('rach');
        expect(result.body.data.email).toBe('uqierach@gmail.com');
        expect(result.body.data.phone).toBe('085755803320');
    });

    test('should reject if invalid token', async () => {
        const result = await supertest(web)
            .post('/api/contacts')
            .set('Authorization', 'invalid')
            .send({
                first_name: 'uqie',
                last_name: 'rach',
                email: 'uqierach@gmail.com',
                phone: '085755803320'
            });

        expect(result.status).toBe(401);
        expect(result.error).toBeDefined();
    });
});

describe('GET /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await createUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestContact();
        await removeTestedUser();
    });


    test('should return contact data of a spesific user', async () => {
        const contactId = await getTestContact();

        const result = await supertest(web)
            .get(`/api/contacts/${contactId.id}`)
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(contactId.id);
        expect(result.body.data.first_name).toBe(contactId.first_name);
        expect(result.body.data.last_name).toBe(contactId.last_name);
        expect(result.body.data.email).toBe(contactId.email);
        expect(result.body.data.phone).toBe(contactId.phone);
    })

    test('should response error 404 if contactId not found', async () => {
        const contactId = await getTestContact();

        const result = await supertest(web)
            .get(`/api/contacts/${(contactId.id + 2)}`)
            .set('Authorization', 'test');

        expect(result.status).toBe(404);
    })

    test('should response error 401 if invalid token', async () => {
        const contactId = await getTestContact();

        const result = await supertest(web)
            .get(`/api/contacts/${contactId.id}`)
            .set('Authorization', 'wrongtoken');

        expect(result.status).toBe(401);
    })
});

describe('PUT /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await createUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestContact();
        await removeTestedUser();
    });

    test('should able to update existing contact', async () => {
        const contactId = await getTestContact();

        const result = await supertest(web)
            .put(`/api/contacts/${contactId.id}`)
            .set("Authorization", 'test')
            .send({
                first_name: 'uqie',
                last_name: 'rach',
                email: 'uqierach@gmail.com',
                phone: '085755803320'
            });

        logger.warn(result)
        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(contactId.id);
        expect(result.body.data.first_name).toBe('uqie');
        expect(result.body.data.last_name).toBe('rach');
        expect(result.body.data.email).toBe('uqierach@gmail.com');
        expect(result.body.data.phone).toBe('085755803320');
    });

    test('should response 401 if user unauthorized', async () => {
        const contactId = await getTestContact();

        const result = await supertest(web)
            .put(`/api/contacts/${contactId.id}`)
            .set("Authorization", 'wrong token')
            .send({
                first_name: 'uqie',
                last_name: 'rach',
                email: 'uqierach@gmail.com',
                phone: '085755803320'
            });

        expect(result.status).toBe(401);
        expect(result.error).toBeDefined();
    });

    test('should response 400 if there`s empty field', async () => {
        const contactId = await getTestContact();

        const result = await supertest(web)
            .put(`/api/contacts/${contactId.id}`)
            .set("Authorization", 'test')
            .send({
                first_name: 'uqie',
                last_name: 'rach',
                email: '',
                phone: ''
            });

        expect(result.status).toBe(400);
        expect(result.error).toBeDefined();
    });
});

describe('DELETE /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await createUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestContact();
        await removeTestedUser();
    });

    test('should delete existing contact', async () => {
        const contactId = await getTestContact();

        const result = await supertest(web)
            .delete(`/api/contacts/${contactId.id}`)
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data).toBe("OK");
    });

    test('should reject if contact cannot be found', async () => {
        const contactId = await getTestContact();

        const result = await supertest(web)
            .delete(`/api/contacts/${(contactId.id + 1)}`)
            .set('Authorization', 'test');

        expect(result.status).toBe(404);
    });
});

describe('GET /api/contacts', () => {
    beforeEach(async () => {
        await createUser();
        await createManyTestContact();
    });

    afterEach(async () => {
        await removeAllTestContact();
        await removeTestedUser();
    });

    test('should able to search without params', async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(10);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_item).toBe(15);
    });

    test('should able to search to page 2', async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .query({
                page: 2
            })
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(5);
        expect(result.body.paging.page).toBe(2);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_item).toBe(15);
    });

    test('should able to search using name', async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .query({
                name: 'test 1'
            })
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(7);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(7);
    });

    test('should able to search using email', async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .query({
                email: 'test1'
            })
            .set('Authorization', 'test');

        logger.error(result)

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(7);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(7);
    });

    test('should able to search using phone', async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .query({
                phone: '07777772'
            })
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(1);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(1);
    });

});
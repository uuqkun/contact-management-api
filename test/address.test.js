import supertest from "supertest";
import { createManyTestAddress, createTestAddress, createTestContact, createUser, getTestAddress, getTestContact, removeAllTestAddresses, removeAllTestContact, removeTestedUser } from "./test-util.js";
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

        expect(result.status).toBe(400);
        expect(result.error).toBeDefined();
    });
});

describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await createUser();
        await createTestContact();
        await createTestAddress();
    });

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContact();
        await removeTestedUser();
    });

    test('should get address data', async () => {
        const testAddress = await getTestAddress();
        const testContact = await getTestContact();

        const result = await supertest(web)
            .get(`/api/contacts/${testContact.id}/addresses/${testAddress.id}`)
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(testAddress.id);
        expect(result.body.data.contact_id).toBe(testAddress.contact_id);
        expect(result.body.data.street).toBe(testAddress.street);
        expect(result.body.data.city).toBe(testAddress.city);
        expect(result.body.data.province).toBe(testAddress.province);
        expect(result.body.data.country).toBe(testAddress.country);
        expect(result.body.data.postal_code).toBe(testAddress.postal_code);
    });

    test('should response 404 if contact is not found', async () => {
        const testAddress = await getTestAddress();
        const testContact = await getTestContact();

        const result = await supertest(web)
            .get(`/api/contacts/${(testContact.id * 2)}/addresses/${testAddress.id}`)
            .set('Authorization', 'test');

        expect(result.status).toBe(404);
    });

    test('should response 404 if address is not found', async () => {
        const testAddress = await getTestAddress();
        const testContact = await getTestContact();

        const result = await supertest(web)
            .get(`/api/contacts/${(testContact.id)}/addresses/${(testAddress.id + 1)}`)
            .set('Authorization', 'test');

        expect(result.status).toBe(404);
    });

    test('should response 401 if sent an invalid token', async () => {
        const testAddress = await getTestAddress();
        const testContact = await getTestContact();

        const result = await supertest(web)
            .get(`/api/contacts/${(testContact.id)}/addresses/${(testAddress.id + 1)}`)
            .set('Authorization', 'testa');

        expect(result.status).toBe(401);
    });
});

describe('POST /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await createUser();
        await createTestContact();
        await createTestAddress();
    });

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContact();
        await removeTestedUser();
    });

    test('should update existing address', async () => {
        const address = await getTestAddress();
        const contact = await getTestContact();

        const result = await supertest(web)
            .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set('Authorization', 'test')
            .send({
                street: 'street',
                city: 'city',
                province: 'province',
                country: 'country',
                postal_code: '1111'
            });

        expect(result.status).toBe(200);
        expect(result.body.data.street).toBe('street')
        expect(result.body.data.city).toBe('city')
        expect(result.body.data.province).toBe('province')
        expect(result.body.data.country).toBe('country')
        expect(result.body.data.postal_code).toBe('1111')
    })

    test('should response 400 if there`s an empty mandatory field', async () => {
        const address = await getTestAddress();
        const contact = await getTestContact();

        const result = await supertest(web)
            .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set('Authorization', 'test')
            .send({
                street: 'street',
                city: 'city',
                province: 'province',
                country: 'country',
                postal_code: ''
            });

        expect(result.status).toBe(400);
    });

    test('should response 404 if contact is not found', async () => {
        const address = await getTestAddress();
        const contact = await getTestContact();

        const result = await supertest(web)
            .put(`/api/contacts/${(contact.id * 2)}/addresses/${address.id}`)
            .set('Authorization', 'test')
            .send({
                street: 'street',
                city: 'city',
                province: 'province',
                country: 'country',
                postal_code: '111'
            });

        expect(result.status).toBe(404);
    });

    test('should response 404 if address is not found', async () => {
        const address = await getTestAddress();
        const contact = await getTestContact();

        const result = await supertest(web)
            .put(`/api/contacts/${contact.id}/addresses/${(address.id * 2)}`)
            .set('Authorization', 'test')
            .send({
                street: 'street',
                city: 'city',
                province: 'province',
                country: 'country',
                postal_code: '111'
            });

        expect(result.status).toBe(404);
    });

    test('should response 401 if user is unauthorized', async () => {
        const address = await getTestAddress();
        const contact = await getTestContact();

        const result = await supertest(web)
            .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set('Authorization', '')
            .send({
                street: 'street',
                city: 'city',
                province: 'province',
                country: 'country',
                postal_code: '111'
            });

        expect(result.status).toBe(401);
    });
});


describe('DELETE /api/contacts/:contactId/addresses/:addressId', () => {  
    beforeEach(async () => {
        await createUser();
        await createTestContact();
        await createTestAddress();
    });

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContact();
        await removeTestedUser();
    });

    test('should delete existing address', async () => {  
        const address = await getTestAddress();
        const contact = await getTestContact();
        
        const result = await supertest(web)
            .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set('Authorization', 'test');

            expect(result.status).toBe(200);
            expect(result.body.data).toBe("OK");
    });

    test('should response 404 if contact is not found', async () => {  
        const address = await getTestAddress();
        const contact = await getTestContact();
        
        const result = await supertest(web)
            .delete(`/api/contacts/${(contact.id * 2)}/addresses/${address.id}`)
            .set('Authorization', 'test');

            expect(result.status).toBe(404);
    });

    test('should response 404 if address not found', async () => {  
        const address = await getTestAddress();
        const contact = await getTestContact();
        
        const result = await supertest(web)
            .delete(`/api/contacts/${contact.id}/addresses/${(address.id * 2)}`)
            .set('Authorization', 'test');

            expect(result.status).toBe(404);
    });

    test('should response 401 if user unauthorized', async () => {  
        const address = await getTestAddress();
        const contact = await getTestContact();
        
        const result = await supertest(web)
            .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set('Authorization', '');

            expect(result.status).toBe(401);
    });
});

describe('list GET /api/contacts/:contactId', () => { 
    beforeEach(async () => {
        await createUser();
        await createTestContact();
        await createManyTestAddress();
    });

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContact();
        await removeTestedUser();
    });

    test('should retrieve all related address', async () => {  
        const contact = await getTestContact();

        const result = await supertest(web)
            .get(`/api/contacts/${contact.id}/addresses`)
            .set('Authorization', 'test');
        
        expect(result.status).toBe(200);
        expect(result.body.data).toBeDefined();
        expect(result.body.data.length).not.toBeNull();
    });

    test('should response 403 if addresses not found', async () => {  
        const contact = await getTestContact();
        await removeAllTestAddresses();

        const result = await supertest(web)
            .get(`/api/contacts/${contact.id}/addresses`)
            .set('Authorization', 'test');
        
        expect(result.status).toBe(403);
    });

    test('should response 404 if contact not found', async () => {  
        const contact = await getTestContact();

        const result = await supertest(web)
            .get(`/api/contacts/${(contact.id * 3)}/addresses`)
            .set('Authorization', 'test');
        
        expect(result.status).toBe(404);
        expect(result.error).toBeDefined();
    });

    test('should response 401 if user unauthorized', async () => {  
        const contact = await getTestContact();

        const result = await supertest(web)
            .get(`/api/contacts/${contact.id}/addresses`)
            .set('Authorization', 'wrongtoken');
        
        expect(result.status).toBe(401);
        expect(result.error).toBeDefined();
    });
});
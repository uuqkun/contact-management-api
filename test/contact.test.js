import supertest from "supertest";
import { createUser, removeAllTestContact, removeTestedUser } from "./test-util.js";
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
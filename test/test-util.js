import { prismaClient } from "../src/application/database.js"
import bcrypt from "bcrypt"

export const removeTestedUser = async () => {
    await prismaClient.user.deleteMany({
        where: {
            username: "test"
        }
    })
}

export const createUser = async () => {
    await prismaClient.user.create({
        data: {
            username: "test",
            password: await bcrypt.hash('secret', 10),
            name: "test",
            token: "test"
        }
    })
}

export const getTestUser = async () => {
    return prismaClient.user.findUnique({
        where: {
            username: 'test'
        }
    });
}

export const removeAllTestContact = async () => {
    return prismaClient.contact.deleteMany({
        where: {
            username: 'test'
        }
    });
}

export const createTestContact = async () => {
    return prismaClient.contact.create({
        data: {
            username: 'test',
            first_name: 'test',
            last_name: 'test',
            email: 'test@gmail.com',
            phone: '0777777'
        }
    });
}
export const createManyTestContact = async () => {
    for (let i = 1; i <= 15; i++) {
        await prismaClient.contact.create({
            data: {
                username: `test`,
                first_name: `test ${i}`,
                last_name: `test ${i}`,
                email: `test${i}@gmail.com`,
                phone: `0777777${i}`,
            }
        });
    }
}

export const getTestContact = async () => {
    return prismaClient.contact.findFirst({
        where: {
            username: 'test'
        }
    });
}

export const createTestAddress = async () => {
    const contactId = await getTestContact();

    return prismaClient.address.create({
        data: {
            contact_id: contactId.id,
            street: 'klojen', 
            city: 'malang',
            province: 'east java', 
            country: 'indonesia',
            postal_code: '65116'
        }
    })
}

export const getTestAddress = async() => {
    return prismaClient.address.findFirst({
        where: {
            contact: {
                username: 'test'
            }
        }
    })
}

export const removeAllTestAddresses = async () => {
    return prismaClient.address.deleteMany({
        where: {
            contact: {
                username: 'test'
            }
        }
    });
}

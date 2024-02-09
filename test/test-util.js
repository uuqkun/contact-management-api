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
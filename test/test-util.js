import { prismaClient } from "../src/application/database"
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
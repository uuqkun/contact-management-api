import { prismaClient } from "../application/database.js";
import { logger } from "../application/logging.js";
import { ResponseError } from "../error/error.js";
import { createContactValidation, getContactValidation, updateContactValidation } from "../validation/contact-validation.js"
import { validate } from "../validation/validation.js"


const create = async (user, request) => {
    const contact = validate(createContactValidation, request);
    contact.username = user.username;

    return prismaClient.contact.create({
        data: contact,
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true
        }
    });
}

const get = async (user, contactId) => {
    contactId = validate(getContactValidation, contactId);

    const contact = await prismaClient.contact.findFirst({
        where: {
            username: user.username,
            id: contactId
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true
        }
    });

    if (!contact) {
        throw new ResponseError(404, "Contact is Not Found");
    }

    return contact;
}

const update = async (user, request) => {
    const contact = validate(updateContactValidation, request);

    const countInDatabase = await prismaClient.contact.count({
        where: {
            username: user.username,
            id: contact.id
        }
    });

    if (countInDatabase !== 1) throw new ResponseError(404, "User is Not Found");

    return prismaClient.contact.update({
        where: {
            id: contact.id
        },
        data: {
            first_name: contact.first_name,
            last_name: contact.last_name,
            email: contact.email,
            phone: contact.phone,
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true
        }
    });
}

const remove = async (user, contactId) => {
    contactId = validate(getContactValidation, contactId);

    const countInDatabase = await prismaClient.contact.count({
        where: {
            username: user.username,
            id: contactId
        }
    });

    if (countInDatabase !== 1) throw new ResponseError(404, "User is Not Found");

    return prismaClient.contact.delete({
        where: {
            id: contactId
        }
    });
}

export default {
    create,
    get,
    update,
    remove
}
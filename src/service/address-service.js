import { prismaClient } from "../application/database.js";
import { logger } from "../application/logging.js";
import { ResponseError } from "../error/error.js";
import { createAddressValidation, getAddressValidation, updateAddressValidation } from "../validation/address-validation.js";
import { getContactValidation } from "../validation/contact-validation.js";
import { validate } from "../validation/validation.js"


const checkContactMustAvailableInDb = async (user, contactId) => {
    // validate incoming contactId
    contactId = await validate(getContactValidation, contactId);

    // check contact availability
    const countInDatabase = await prismaClient.contact.count({
        where: {
            username: user.username,
            id: contactId
        }
    });

    if (countInDatabase !== 1) {
        throw new ResponseError(404, "Contact is Not Found");
    }

    return contactId;
}

const create = async (user, contactId, request) => {
    contactId = await checkContactMustAvailableInDb(user, contactId);

    // validate incoming request
    const newAddress = validate(createAddressValidation, request);

    // set validated contactId to incoming request
    newAddress.contact_id = contactId;

    return prismaClient.address.create({
        data: newAddress,
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true
        }
    });
}

const get = async (user, contactId, addressId) => {
    // validate incoming contactId
    contactId = await checkContactMustAvailableInDb(user, contactId);

    addressId = await validate(getAddressValidation, addressId);

    const address = await prismaClient.address.findFirst({
        where: {
            id: addressId,
            contact_id: contactId
        },
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true,
            contact_id: true
        }
    });

    if (!address) {
        throw new ResponseError(404, "Address is Not Found");
    }

    return address;
}

const update = async (user, contactId, request) => {
    contactId = await checkContactMustAvailableInDb(user, contactId);

    const address = validate(updateAddressValidation, request);

    const addressCount = await prismaClient.address.count({
        where: {
            id: address.id,
            contact_id: contactId
        }
    });
    
    if (addressCount !== 1) {
        throw new ResponseError(404, "Address is not found");
    }

    return prismaClient.address.update({
        where: {
            id: address.id,
        },
        data: {
            street: request.street,
            city: request.city,
            province: request.province,
            country: request.country,
            postal_code: request.postal_code,
        },
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true
        }
    });
};

const remove = async (user, contactId, addressId) => {
    contactId = await checkContactMustAvailableInDb(user, contactId);

    addressId = validate(getAddressValidation, addressId);

    const countAddressInDb = await prismaClient.address.count({
        where: {
            id: addressId
        }
    })
 
    if (!countAddressInDb) {
        throw new ResponseError(404, "Address is not found");
    }
    
    return prismaClient.address.delete({
        where: {
            id: addressId,
            contact_id: contactId
        }
    });
    
}

export default {
    create,
    get,
    update,
    remove
}
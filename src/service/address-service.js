import { prismaClient } from "../application/database.js";
import { logger } from "../application/logging.js";
import { ResponseError } from "../error/error.js";
import { createAddressValidation, getAddressValidation } from "../validation/address-validation.js";
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

export default {
    create,
    get
}
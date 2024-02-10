import { prismaClient } from "../application/database.js";
import { logger } from "../application/logging.js";
import { ResponseError } from "../error/error.js";
import { createAddressValidation } from "../validation/address-validation.js";
import { getContactValidation } from "../validation/contact-validation.js";
import { validate } from "../validation/validation.js"

const create = async (user, contactId, request) => {
    // validate incoming contactId
    contactId = validate(getContactValidation, contactId);

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

export default { 
    create
}
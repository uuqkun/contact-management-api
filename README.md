# Project Contact Management API Documentation

## Built With

- **[@prisma/client](https://www.prisma.io/docs/)**: ^5.9.1
- **[bcrypt](https://www.npmjs.com/package/bcrypt)**: ^5.1.1
- **[express](https://expressjs.com/)**: ^4.18.2
- **[joi](https://joi.dev/)**: ^17.12.1
- **[uuid](https://www.npmjs.com/package/uuid)**: ^9.0.1
- **[winston](https://github.com/winstonjs/winston)**: ^3.11.0

## Unit Test Tools
- **[jest](https://jestjs.io/)**: ^29.7.0
- **[supertest](https://www.npmjs.com/package/supertest)**: ^6.3.4
## Author

- **[Achmad Furqon Rachmadie](https://github.com/uuqkun)**

## Description

The Contact Management API is a web service designed for managing user contacts. It provides functionalities for user registration, login, updating user information, reading user data, and logging out. Additionally, it supports contact-related features such as creating contacts, retrieving contact information, updating contacts, searching for contacts based on name, email, or phone, and deleting contacts. Furthermore, the API includes address-related features like creating addresses, updating addresses, retrieving address data, deleting addresses, and obtaining a list of addresses associated with a specific contact.

## User Features

1. **Registration**
    - Endpoint: `/api/users`
    - Method: `POST`
    - Description: Allows users to register and create an account.

2. **Login**
    - Endpoint: `/api/users/login`
    - Method: `POST`
    - Description: Enables users to log in and obtain authentication tokens.

3. **Update User**
    - Endpoint: `/api/users/current`
    - Method: `PATCH`
    - Description: Allows users to update their information based on the provided user ID.

4. **Read Data User**
    - Endpoint: `/api/users/current`
    - Method: `GET`
    - Description: Retrieves user data based on the provided user ID.

5. **Logout**
    - Endpoint: `/api/users/logout`
    - Method: `POST`
    - Description: Logs the user out, invalidating authentication tokens.

## Contact Features

1. **Create Contact**
    - Endpoint: `/api/contacts`
    - Method: `POST`
    - Description: Allows the creation of a new contact.

2. **Get Contact Data**
    - Endpoint: `/api/contacts/:id`
    - Method: `GET`
    - Description: Retrieves contact information based on the provided contact ID.

3. **Update Contact**
    - Endpoint: `/api/contacts/:id`
    - Method: `PUT`
    - Description: Allows the update of contact information based on the provided contact ID.

4. **Search Contacts**
    - Endpoint: `/api/contacts/`
    - Method: `GET`
    - Description: Searches for contacts based on name, email, or phone.

5. **Delete Contact**
    - Endpoint: `/api/contacts/:id`
    - Method: `DELETE`
    - Description: Deletes a contact based on the provided contact ID.

## Address Features

1. **Create Address**
    - Endpoint: `/api/contacts/:contactId/addresses`
    - Method: `POST`
    - Description: Allows the creation of a new address.

2. **Update Address**
    - Endpoint: `/api/contacts/:contactId/addresses/:addressId`
    - Method: `PUT`
    - Description: Allows the update of address information based on the provided address ID.

3. **Get Address Data**
    - Endpoint: `/api/contacts/:contactId/addresses/:addressId`
    - Method: `GET`
    - Description: Retrieves address information based on the provided address ID.

4. **Delete Address**
    - Endpoint: `/api/contacts/:contactId/addresses/:addressId`
    - Method: `DELETE`
    - Description: Deletes an address based on the provided address ID.

5. **Get Addresses of a Contact**
    - Endpoint: `/api/contacts/:contactId/addresses`
    - Method: `GET`
    - Description: Retrieves a list of addresses associated with a specific contact.

Feel free to use this documentation as a reference for implementing or interacting with the Contact Management API.

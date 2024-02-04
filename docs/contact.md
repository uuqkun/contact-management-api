# Contact API Spec

## Create Contact API
Endpoint : POST /api/contacts

Headers : 
- Authorization : token

Request Body : 

```json
{
    "firstName" : "Uqie",
    "lastName" : "Rachmadie",
    "email" : "uqie@gmail.com",
    "phone": "085755803320"
}
```

Response Body Success: 

```json
{
    "data": {
        "id": 1, 
        "firstName" : "Uqie",
        "lastName" : "Rachmadie",
        "email" : "uqie@gmail.com",
        "phone": "085755803320"
    }
}
```

Response Body Error: 

```json
{
    "errors" : "Invalid email format"
}
```

## Update Contact API
Endpoint : PUT /api/contacts/:id

Headers : 
- Authorization : token

Request Body : 

```json
{
    "firstName" : "Uqie",
    "lastName" : "Rachmadie",
    "email" : "uqie@gmail.com",
    "phone": "085755803320"
}
```

Response Body Success: 

```json
{
    "data": {
        "id": 1, 
        "firstName" : "Uqie",
        "lastName" : "Rachmadie",
        "email" : "uqie@gmail.com",
        "phone": "085755803320"
    }
}
```

Response Body Error: 

```json
{
    "errors" : "Invalid email format"
}
```
## GET Contact API
Endpoint : GET /api/contacts/:id

Headers : 
- Authorization : token


Response Body Success: 

```json
{
    "data": {
        "id": 1, 
        "firstName" : "Uqie",
        "lastName" : "Rachmadie",
        "email" : "uqie@gmail.com",
        "phone": "085755803320"
    }
}
```

Response Body Error: 

```json
{
    "errors" : "Data couldn't be found"
}
```

## Search Contact API
Endpoint : GET /api/contacts/

Headers : 
- Authorization : token

Query Params: 
- name : Search by firstName or lastName, opt
- email : Search by email, opt
- phone : Search by phone, opt
- page : number of page, default 1
- size : size per page, default 10

Response Body Success: 

```json
{
    "data": [
      {
          "id": 1, 
          "firstName" : "Uqie",
          "lastName" : "Rachmadie",
          "email" : "uqie@gmail.com",
          "phone": "085755803320"
      },
      {
          "id": 2, 
          "firstName" : "jane",
          "lastName" : "jane doe",
          "email" : "jane@gmail.com",
          "phone": "085755803320"
      },
      {
          "id": 3, 
          "firstName" : "dian",
          "lastName" : "kate",
          "email" : "dian@gmail.com",
          "phone": "085755803320"
      },
    ],
    "paging": {
        "page" : 1, 
        "total_page" : 2, 
        "contacts" : 20
    }
}
```

Response Body Error: 

```json
{
    "errors" : "Data couldn't be found"
}
```

## Delete Contact API
Endpoint : DELETE /api/contacts/:id

Headers : 
- Authorization : token


Response Body Success: 

```json
{
    "data": "OK"
}
```

Response Body Error: 

```json
{
    "errors" : "Data couldn't be found"
}
```


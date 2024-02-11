# Address API Spec
 
## Create address API

Endpoint : POST /api/contacts/:contactId/addresses

Headers : 
- Authorization : token

Request Body :

```json 
{
    "street" : "nama jalan",
    "city" : "nama Kota",
    "province" : "nama province",
    "country" : "nama country",
    "postal_code" : "Kode pos",

}
```

Response Body :

```json 
{
    "data" : {
        "id": 1,
        "street" : "nama jalan",
        "city" : "nama Kota",
        "province" : "nama province",
        "country" : "nama country",
        "postal_code" : "Kode pos",
    }

}
```


Response Body Error :

```json 
{
    "errors" : "Country is required"
}
```


## Update address API

Endpoint : PUT /api/contacts/:contactId/addresses/:addressId

Headers : 
- Authorization : token

Request Body :

```json 
{
    "street" : "nama jalan",
    "city" : "nama Kota",
    "province" : "nama province",
    "country" : "nama country",
    "postal_code" : "Kode pos",

}
```

Response Body :

```json 
{
    "data" : {
        "id": 1,
        "street" : "nama jalan",
        "city" : "nama Kota",
        "province" : "nama province",
        "country" : "nama country",
        "postal_code" : "Kode pos",
    }

}
```


Response Body Error :

```json 
{
    "errors" : "Country is required"
}
```

## Get address API

Endpoint : GET /api/contacts/:id/addresses/:addressId

Headers : 
- Authorization : token

Response Body :

```json 
{
    "data" : {
        "id": 1,
        "street" : "nama jalan",
        "city" : "nama Kota",
        "province" : "nama province",
        "country" : "nama country",
        "postal_code" : "Kode pos",
    }

}
```


Response Body Error :

```json 
{
    "errors" : "Contact is not found"
}
```

## List address API

Endpoint : GET /api/contacts/:contactId/addresses

Headers : 
- Authorization : token
    
Response Body :

```json 
{
    "data": [
        {
            "id" : 1,
            "street" : "nama jalan",
            "city" : "nama Kota",
            "province" : "nama province",
            "country" : "nama country",
            "postal_code" : "Kode pos",
        },
        {
            "id" : 2,
            "street" : "nama jalan",
            "city" : "nama Kota",
            "province" : "nama province",
            "country" : "nama country",
            "postal_code" : "Kode pos",
        },

    ]
}
```


Response Body Error :

```json 
{
    "errors" : "Contact is not found"
}
```


## Remove address API

Endpoint : DELETE /api/contacts/:contactId/addresses/:addressId

Headers : 
- Authorization : token

Response Body Success : 

```json 
{
    "data" : "OK"
}
```

Response Body Error : 

```json 
{
    "errors" : "Address is not found"
}
```



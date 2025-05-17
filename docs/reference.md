# API Reference

This is a comprehensive guide of all the endpoints currently supported.

## Authentication

To make each and every call to the api endpoints you will first need to authenticate.
This will give you two JSON Web Tokens: the `authToken` and the `refreshToken`.

All API calls (authentication excluded) will need the `authToken` to be provided on every request header like so:

```
Authorization: Bearer authToken
```

Where `authToken` is provided during authentication.

By default every token expires after 24h.

When an `authToken` expires you will use the `refreshToken` to generate a new one. It is therefore imperative to not loose the refresh token.

In the eventuality that you loose the `refreshToken` you may recover it by logging in again through the `/recover` endpoint (see below).

### `/register`

This endpoint creates and stores a new user and return both the `authToken` and the `refreshToken`.

#### POST

Set the content type header to json:

```
Content-Type: application/json
```

Then send a both the email and a password as the body of the request.
The email must be unique, failing to do so will return a status code `409`.

```ts
{
    email: string,
    password: string
}
```

Will respond with:

```ts
{
    authToken: string,
    refreshToken: string
}
```

Reference table:

| field | required? |
| --- | --- |
| email | yes |
| password | yes |

### `/token`

Given a valid `refreshToken` will return a new `authToken`.

#### POST

Set the content type header to json:

```
Content-Type: application/json
```

Then send your `refreshToken` in the body of the request like so:

```ts
{
    token: string,
}
```

Will respond with:

```ts
{
    authToken: string,
}
```

Reference table:

| field | required? |
| --- | --- |
| token | yes |


### `/logout`

Given a valid `refreshToken` will return a new `authToken`.

#### DELETE

Set the content type header to json:

```
Content-Type: application/json
```

Then send your `refreshToken` in the body of the request like so:

```ts
{
    token: string
}
```

Will respond with a simple `200` status code.

Reference table:

| field | required? |
| --- | --- |
| token | yes |

### `/recover`

Given a valid email and password combination returns a new set of `authToken` and `refreshToken`.

#### POST

Set the content type header to json:

```
Content-Type: application/json
```

Then send a both the email and a password as the body of the request.
The email-password combination must exists and be valid.

```ts
{
    email: string,
    password: string
}
```

Will respond with:

```ts
{
    authToken: string,
    refreshToken: string
}
```

Reference table:

| field | required? |
| --- | --- |
| email | yes |
| password | yes |

## Categories

### `/categories`


#### GET

Returns all the available categories.

Set the authorization header to:

```
Authorization: Bearer authToken
```

Where `authToken` is the generated token during authentication.


Will respond with:

```ts
{
    id: number,
    name: string
}
```

### `/categories/:id`

Where `:id` is a `number`.

#### GET

Returns a specific category matching the specific id.

Set the authorization header to:

```
Authorization: Bearer authToken
```

Where `authToken` is the generated token during authentication.

Will respond with:

```ts
{
    id: number,
    name: string
}
```

## Manufacturers

### `/manufacturers`

#### GET

Returns all the available manufacturers.

Set the authorization header to:

```
Authorization: Bearer authToken
```

Where `authToken` is the generated token during authentication.


Will respond with:

```ts
{
    id: number,
    name: string
}
```

### `/manufacturers/:id`

Where `:id` is a `number`.

#### GET

Returns a specific manufacturer matching the specific id.

Set the authorization header to:

```
Authorization: Bearer authToken
```

Where `authToken` is the generated token during authentication.

Will respond with:

```ts
{
    id: number,
    name: string
}
```

## Products

### `/products`

#### POST

Creates a product and publishes it for anyone to see.

Set the following headers:

```
Authorization: Bearer authToken
Content-Type: application/json
```
Where `authToken` is the generated token during authentication.

Then set the body of the request as follows:

```ts
{
    category: {
        id: number,
        name: string,
    },
    manufacturer: {
        id: number,
        name: string,
    },
    name: string,
    price: string,
    gpu: string,
    cpu: string,
    keyboardLayout: string,
    display: string,
    ram: string,
    drives: string,
    memory: string,
    storage: string,
    ports: string,
    webcam: string,
}
```

| field | required? |
| --- | --- |
| category.id | yes |
| category.name | yes |
| manufacturer.id | yes |
| manufacturer.name | yes |
| name | yes |
| price | yes |
| gpu | yes |
| cpu | yes |
| keyboardLayout | yes |
| display | yes |
| ram | yes |
| drives | yes |
| memory | yes |
| storage | yes |
| ports | yes |
| webcam | no |

On success will respond with a status `200`.

#### GET

Returns all the available products.

Set the authorization header to:

```
Authorization: Bearer authToken
```

Where `authToken` is the generated token during authentication.


Will respond with a list of products, each with the following structure:

```ts
{
    id: number,
    user: {
        id: number,
        email: string,
    },
    category: {
        id: number,
        name: string,
    },
    manufacturer: {
        id: number,
        name: string,
    },
    name: string,
    price: string,
    gpu: string,
    cpu: string,
    keyboardLayout: string,
    display: string,
    ram: string,
    drives: string,
    memory: string,
    storage: string,
    ports: string,
    webcam: string,
}
```

### `/products/:id`

Where `:id` is a `number`.

#### GET

Returns a specific product matching the specific id.

Set the authorization header to:

```
Authorization: Bearer authToken
```

Where `authToken` is the generated token during authentication.

On success will respond with:

```ts
{
    id: number,
    user: {
        id: number,
        email: string,
    },
    category: {
        id: number,
        name: string,
    },
    manufacturer: {
        id: number,
        name: string,
    },
    name: string,
    price: string,
    gpu: string,
    cpu: string,
    keyboardLayout: string,
    display: string,
    ram: string,
    drives: string,
    memory: string,
    storage: string,
    ports: string,
    webcam: string,
}
```

#### DELETE

Deletes specific product matching the specific id.

WARNING: only the owner of the product may use this endpoint!

Set the authorization header to:

```
Authorization: Bearer authToken
```

Where `authToken` is the generated token during authentication.

On success will respond with a status code of `200`.

#### PUT

Updates a specific product matching the specific id.

WARNING: only the owner of the product may use this endpoint!

Set the following headers:

```
Authorization: Bearer authToken
Content-Type: application/json
```
Where `authToken` is the generated token during authentication.

Then set the body of the request as follows:

```ts
{
    category: {
        id: number,
        name: string,
    },
    manufacturer: {
        id: number,
        name: string,
    },
    name: string,
    price: string,
    gpu: string,
    cpu: string,
    keyboardLayout: string,
    display: string,
    ram: string,
    drives: string,
    memory: string,
    storage: string,
    ports: string,
    webcam: string,
}
```

| field | required? |
| --- | --- |
| category.id | yes |
| category.name | yes |
| manufacturer.id | yes |
| manufacturer.name | yes |
| name | yes |
| price | yes |
| gpu | yes |
| cpu | yes |
| keyboardLayout | yes |
| display | yes |
| ram | yes |
| drives | yes |
| memory | yes |
| storage | yes |
| ports | yes |
| webcam | no |


### `/products/:id/:prop`

Where `:id` is a `number` and `:prop` is a `string`.

#### GET

Returns a specific product's property matching the specific prop name.

Set the authorization header to:

```
Authorization: Bearer authToken
```

Where `authToken` is the generated token during authentication.

On success will respond with the plain data or object.

Currently supports only one layer deep queries.


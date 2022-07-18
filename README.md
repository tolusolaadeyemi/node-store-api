this is a simple product search API. you can access the data programmatically using a REST API. this documentation describes how to request data from the API and how to interpret the response. there are 23 products in total. 
## :shopping_cart: products
`GET` `https://tolu-store-api.herokuapp.com/api/v1/products`

returns json of all 23 products and their `_id` `rating` `featured` (*true or false*) `createdAt` `name` `price` and `company`

### sample response
```
{
"products":[{
"featured":false,
"rating":4,
"createdAt":"2022-07-18T15:07:24.571Z",
"_id":"62d5772ea2c0f8e90815a782",
"name":"accent chair",
"price":25,
"company":"marcos",
"__v":0
},

```
## :mag_right: search
products can be sorted/filtered by name, price, company and rating

### sample queries
`GET` `https://tolu-store-api.herokuapp.com/api/v1/products?company=ikea`

`GET` `https://tolu-store-api.herokuapp.com/api/v1/products?numericFilters=price>40,rating>=4`

| parameter   | description |  type       | 
| ----------- | ----------- | ----------- |             
| `name=`     | filter on a specific product name      |  string     |             
| `company=`   | filter on a specific company. available companies: `ikea`, `liddy`,`caressa`, `marcos`        |  string       |
| `numericFilters=`    | filter on a specific numerical condition (<, <=, =, > or >=). available numerical fields: `price` , `rating`    |  string       |
| `page=`   | page number       |  integer      |


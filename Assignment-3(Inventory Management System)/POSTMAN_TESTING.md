# Postman testing guide

Set `baseUrl` to `http://localhost:5000`.

## 1. Create product
POST `{{baseUrl}}/api/products`
Body (raw JSON):
```json
{
  "name": "Gaming Mouse",
  "sku": "GM-101",
  "category": "Electronics",
  "price": 1500,
  "quantity": 25,
  "reorderLevel": 5,
  "supplier": "Logitech"
}
```
Expected: `201 Created`. Copy `_id` from the response.

## 2. Get all
GET `{{baseUrl}}/api/products`
Expected: `200 OK`, with pagination metadata and products array.

## 3. Filter, search, sort and paginate
- GET `{{baseUrl}}/api/products?category=Electronics`
- GET `{{baseUrl}}/api/products?search=mouse`
- GET `{{baseUrl}}/api/products?sort=price&order=asc`
- GET `{{baseUrl}}/api/products?page=1&limit=5`

## 4. Get by ID
GET `{{baseUrl}}/api/products/PASTE_ID_HERE`

## 5. Update
PUT `{{baseUrl}}/api/products/PASTE_ID_HERE`
```json
{
  "price": 1600,
  "quantity": 30
}
```

## 6. Stock adjustment
PATCH `{{baseUrl}}/api/products/PASTE_ID_HERE/stock`
```json
{ "change": 10 }
```
Try `{ "change": -3 }` to record a sale.

## 7. Low-stock report
Create a product with `quantity: 2` and `reorderLevel: 5`, then:
GET `{{baseUrl}}/api/products/low-stock`

## 8. Category summary
GET `{{baseUrl}}/api/products/summary`

## 9. Delete
DELETE `{{baseUrl}}/api/products/PASTE_ID_HERE`

## Validation checks
- Try creating a product without `name` -> should return `400`.
- Try a negative price -> should return `400`.
- Try using an already-used SKU -> should return `409`.
- Try selling more units than available -> should return `400`.

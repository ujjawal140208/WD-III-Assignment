# Inventory and Data Management System
**Web Dev III - Assignment 3 (Unit 3)**

A RESTful inventory backend built with Node.js, Express.js, MongoDB and Mongoose.

## Features
- Mongoose Product schema with field-level validation and unique SKU.
- Create, read, update and delete product APIs.
- Product filtering by category and text search.
- Sorting and pagination.
- Single product lookup by MongoDB ID.
- Low-stock report (`quantity <= reorderLevel`).
- Category-wise aggregation: item count, total quantity, stock value and average price.
- Safe stock adjustment: positive `change` adds stock; negative `change` records a sale. Stock cannot become negative.
- Centralized error handling and dotenv configuration.

## Requirements
- Node.js 18 or later
- MongoDB local service or MongoDB Atlas connection string
- Postman (for API testing)

## Setup
1. Open this project folder in VS Code / terminal.
2. Install packages:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env`.
4. Set `MONGODB_URI` in `.env`. For local MongoDB:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/inventory_management
   NODE_ENV=development
   ```
   For MongoDB Atlas, use the connection string supplied by Atlas.
5. Start the server:
   ```bash
   npm run dev
   ```
   Or:
   ```bash
   npm start
   ```
6. The API runs at `http://localhost:5000`.

## API reference

Base URL: `http://localhost:5000/api/products`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/` | Create product |
| GET | `/` | List, filter, sort and paginate products |
| GET | `/:id` | Get one product |
| PUT | `/:id` | Update product fields |
| DELETE | `/:id` | Delete product |
| GET | `/low-stock` | Get products at/below reorder level |
| GET | `/summary` | Category-wise inventory aggregation |
| PATCH | `/:id/stock` | Adjust stock quantity |

### Create product
`POST /api/products`, Body -> raw -> JSON:
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

### List products
- `GET /api/products`
- `GET /api/products?category=Electronics`
- `GET /api/products?search=mouse`
- `GET /api/products?sort=price&order=asc`
- `GET /api/products?page=1&limit=5`
- Combine parameters: `GET /api/products?category=Electronics&sort=price&order=desc&page=1&limit=5`

Allowed sort fields: `name`, `price`, `quantity`, `category`, `createdAt`. `order` is `asc` or `desc`.

### Get one product
`GET /api/products/PRODUCT_ID`

### Update product
`PUT /api/products/PRODUCT_ID`
```json
{
  "price": 1600,
  "quantity": 30
}
```

### Adjust stock
`PATCH /api/products/PRODUCT_ID/stock`
```json
{ "change": 10 }
```
A positive value restocks; a negative value records a sale, e.g. `{ "change": -3 }`. The API rejects a sale that would make stock negative.

### Delete product
`DELETE /api/products/PRODUCT_ID`

### Low stock report
`GET /api/products/low-stock`

A product is considered low stock when its quantity is less than or equal to its reorder level.

### Category summary
`GET /api/products/summary`

The aggregation groups documents by category and calculates total product documents, total units, total stock value (`price × quantity`) and average price.

## Suggested Postman testing order
1. POST at least 3 products in different categories.
2. GET all products and copy one `_id`.
3. GET the copied ID.
4. PUT the copied ID to update a field.
5. PATCH the copied ID with a positive stock change, then a negative change.
6. Test category filter, search, sorting and pagination.
7. GET `/low-stock` after creating a product with low quantity.
8. GET `/summary`.
9. DELETE the test product.

## Project structure
```text
config/db.js
controllers/productController.js
middleware/errorHandler.js
models/Product.js
routes/productRoutes.js
.env.example
.gitignore
server.js
package.json
```

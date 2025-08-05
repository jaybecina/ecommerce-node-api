# Ecommerce Node REST API

A modern, production-ready ecommerce REST API built with Node.js, Express, TypeScript, Drizzle ORM, and NeonDB (PostgreSQL). Includes JWT authentication, role-based access control, Cloudflare R2 image storage, and more.

## Features

- User registration & login (JWT authentication)
- Role-based access control (user, seller, admin)
- Product CRUD with image upload to Cloudflare R2
- Order management
- Rate limiting & validation middleware
- Type-safe with TypeScript
- Uses Drizzle ORM and NeonDB (PostgreSQL)

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Drizzle ORM
- NeonDB (PostgreSQL)
- Cloudflare R2 (S3-compatible storage)
- Zod (validation)
- JWT (authentication)

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd ecommerce-node-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory. Example:

```
# Database
DATABASE_URL=your_neon_db_url

# JWT
JWT_SECRET=your_jwt_secret

# Cloudflare R2
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_ACCOUNT_ID=your_r2_account_id
R2_BUCKET_NAME=your_r2_bucket_name
R2_PUBLIC_URL=your_r2_public_url
```

**Note:** Do not share your secret keys. Use your own values for the above variables.

### 4. Run database migrations

```bash
npm run db:generate
npm run db:migrate
```

### 5. Start the development server

```bash
npm run dev
```

The API will be available at `http://localhost:5000` by default.

## API Endpoints

### Auth

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and get JWT token

### Products

- `GET /api/products` — List all products
- `GET /api/products/:id` — Get product by ID
- `POST /api/products` — Create product (seller/admin only)
- `PUT /api/products/:id` — Update product (seller/admin only)
- `DELETE /api/products/:id` — Delete product (seller/admin only)
- `POST /api/products/upload-image` — Upload product image (seller/admin only)

### Orders

- `POST /api/orders` — Create order
- `GET /api/orders` — List orders
- `GET /api/orders/:id` — Get order by ID
- `PUT /api/orders/:id` — Update order status

## Notes

- All protected routes require `Authorization: Bearer <token>` header.
- Product images are stored in Cloudflare R2 and served via public URL.
- For production, set up a custom domain for R2 public access.

## License

MIT

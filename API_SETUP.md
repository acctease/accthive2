# Accthive API Setup Guide

## Prerequisites

1. **MongoDB Database**: You need a MongoDB database. You can use:
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)
   - Local MongoDB installation

2. **Environment Variables**: Create a `.env` file in the project root:

```bash
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/accthive?retryWrites=true&w=majority"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

## Setup Steps

### 1. Generate Prisma Client

```bash
npx prisma generate
```

### 2. Push Database Schema

```bash
npx prisma db push
```

### 3. Seed Database with Dummy Services

```bash
npx prisma db seed
```

Add this to your `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

Then install ts-node:

```bash
pnpm add -D ts-node
```

## API Endpoints

### Authentication

#### POST `/api/auth/signup`

Create a new user account with wallet.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

#### POST `/api/auth/login`

Login with existing credentials.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET `/api/auth/me`

Get current user profile (requires authentication).

**Headers:**

```
Authorization: Bearer <jwt-token>
```

### Wallet

#### GET `/api/wallet/balance`

Get current wallet balance (requires authentication).

#### POST `/api/wallet/deposit`

Deposit funds to wallet (dummy payment simulation).

**Request:**

```json
{
  "amount": 100.0
}
```

#### GET `/api/wallet/transactions`

Get transaction history with pagination.

**Query Parameters:**

- `page` (default: 1)
- `limit` (default: 10)

### Services

#### GET `/api/services`

List all active services.

**Query Parameters:**

- `category` (optional): Filter by category

#### GET `/api/services/[category]`

Get services by category.

**Categories:**

- `social-boost`
- `social-accounts`
- `sms-service`
- `gifting`

### Orders

#### GET `/api/orders`

List user orders with pagination (requires authentication).

**Query Parameters:**

- `page` (default: 1)
- `limit` (default: 10)

#### POST `/api/orders`

Create a new order without payment (requires authentication).

**Request:**

```json
{
  "serviceId": "service-id-here",
  "details": {
    "customField": "value"
  }
}
```

### Checkout

#### POST `/api/checkout`

Process checkout with wallet payment (requires authentication).

**Request:**

```json
{
  "serviceId": "service-id-here",
  "details": {
    "customField": "value"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "orderId": "order-id",
    "amount": 29.99,
    "newBalance": 70.01,
    "status": "PROCESSING"
  },
  "message": "Checkout successful"
}
```

## Testing the API

### Using curl

```bash
# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get services
curl http://localhost:3000/api/services

# Deposit (with token)
curl -X POST http://localhost:3000/api/wallet/deposit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"amount":100}'

# Checkout (with token)
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"serviceId":"SERVICE_ID_HERE"}'
```

## Database Models

- **User**: User accounts with email/password authentication
- **Wallet**: User wallet with balance tracking
- **Transaction**: Transaction history (deposits, payments)
- **Service**: Available services across categories
- **Order**: User orders with status tracking

## Next Steps

1. **Set up MongoDB**: Configure your DATABASE_URL in `.env`
2. **Run migrations**: `npx prisma db push`
3. **Seed database**: `npx prisma db seed`
4. **Test endpoints**: Use the curl commands above or Postman
5. **Integrate frontend**: Connect your React components to these APIs

## Troubleshooting

- **Prisma Client not found**: Run `npx prisma generate`
- **Database connection error**: Check your DATABASE_URL in `.env`
- **Unauthorized errors**: Ensure you're sending the JWT token in the Authorization header

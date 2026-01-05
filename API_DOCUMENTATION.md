# API Documentation

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Rate Limiting

- **API Endpoints**: 100 requests per minute
- **Authentication**: 5 attempts per 15 minutes
- **File Upload**: 50 uploads per hour

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset time (ISO 8601)
- `Retry-After`: Seconds until reset (429 responses)

## Endpoints

### Pages

#### GET /api/pages
Get all pages or a single page by slug or ID.

**Query Parameters:**
- `slug` (optional): Page slug
- `id` (optional): Page ID

**Response:**
```json
{
  "success": true,
  "data": [...]
}
```

#### POST /api/pages
Create a new page (requires authentication).

**Request Body:**
```json
{
  "title": "Page Title",
  "slug": "page-slug",
  "status": "published"
}
```

#### PUT /api/pages
Update a page (requires authentication).

#### DELETE /api/pages
Delete a page (requires authentication).

### Page Blocks

#### GET /api/pages/blocks
Get blocks for a page.

**Query Parameters:**
- `pageId`: Page ID

#### PUT /api/pages/blocks
Update a block (requires authentication).

**Request Body:**
```json
{
  "id": "block-id",
  "content": {...}
}
```

### Authentication

#### POST /api/auth/login
Login endpoint.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

### Media

#### GET /api/media
Get media files.

#### POST /api/media
Upload a media file (requires authentication).

**Form Data:**
- `file`: File to upload
- `category`: Category name
- `alt_text`: Alt text for image

### Services

#### GET /api/services
Get all services.

#### POST /api/services
Create a service (requires authentication).

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message"
}
```

**Status Codes:**
- `200`: Success
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests (Rate Limited)
- `500`: Internal Server Error


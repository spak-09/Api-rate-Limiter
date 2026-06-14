# RateShield Backend

RateShield is a production-grade MERN backend infrastructure project built with Node.js, Express, MongoDB, Redis, and Socket.IO.

## Features

- User registration and login with JWT authentication
- Admin management for algorithm and rate limit configuration
- Multiple rate limiting algorithms implemented in Redis
- Request logging and blocked request auditing
- Realtime analytics events with Socket.IO
- Feature-based folder structure with modular ES modules

## Setup

1. Copy the `.env` file and update values if needed.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server in development:
   ```bash
   npm run dev
   ```
4. Start production server:
   ```bash
   npm start
   ```

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/user/profile`
- `GET /api/user/usage`
- `GET /api/user/blocked`
- `POST /api/admin/algorithm`
- `POST /api/admin/limits`
- `GET /api/admin/users`
- `GET /api/admin/stats`
- `GET /api/admin/top-users`
- `GET /api/analytics/requests`
- `GET /api/analytics/blocked`
- `GET /api/analytics/overview`

## Notes

- MongoDB database name is fixed to `rateshield`.
- Redis is used for rate limiting state and key management.
- Admin user and fallback settings are created automatically on startup.

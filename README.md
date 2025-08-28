Notes App (Node + React)

Backend: Express + MongoDB (Mongoose)
Frontend: React (Vite, JS)
Auth: Password, Email OTP, Google (ID token demo)

Prerequisites
- Node 18+
- MongoDB running locally

Environment
- Edit `configs/db.config.js` for `DB_URL`
- JWT secret in `configs/auth.config.js`
- Server port in `configs/server.config.js` (default 8888)

Install & Run (Backend)
```
npm install
npm run dev
```

API Overview
- POST `/ecomm/api/v1/auth/signup` { name, userId, email, password }
  - Optional: `dob` (ISO date string)
- POST `/ecomm/api/v1/auth/signin` { userId, password }
- POST `/ecomm/api/v1/auth/request-otp` { email, name?, userId? }
  - Optional: `dob` (stored for new users)
- POST `/ecomm/api/v1/auth/verify-otp` { email, otp }
- POST `/ecomm/api/v1/auth/google` { idToken, name? }
  - Optional: `dob`
- GET `/api/v1/notes` (x-access-token)
- POST `/api/v1/notes` { title, content } (x-access-token)
- DELETE `/api/v1/notes/:id` (x-access-token)

Install & Run (Frontend)
```
cd client
npm install
npm run dev
```
App runs at `http://localhost:5173`, backend at `http://localhost:8888`.

Environment files
- Copy `env.example` to `.env` in backend
- Copy `client/env.example` to `client/.env`
- Update `MONGODB_URI`, `JWT_SECRET`, and `VITE_API_BASE_URL`

Notes
- OTP is returned in response for demo; in production send via email/SMS.
- Google login uses decoded ID token for demo; verify with Google in production.

Deploy
- Backend: Render/Railway/Heroku
- Frontend: Vercel/Netlify
- Update `client/.env` `VITE_API_BASE_URL` after deploying backend.



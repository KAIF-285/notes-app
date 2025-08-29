Full‑Stack Notes App

I built a notes app with password, email OTP, and Google login. JWT authorizes creating and deleting notes. This document explains what I implemented, how I structured it, and how to run and test it.

Tech I used
- Backend: Node.js (Express) + MongoDB (Mongoose)
- Frontend: React (Vite, JavaScript)
- Auth: JWT, bcrypt for password hashing, simple OTP for demo

What I implemented
- Signup/Login with email + password
- Email OTP signup/login (OTP returned in response for demo)
- Google login (assignment‑friendly simulation)
- Notes page after login with create and delete
- JWT‑protected endpoints with ownership checks
- Mobile‑friendly auth UI that mirrors the provided mock
- Date of Birth captured and stored at signup

How it’s organized
- `server.js` — Express app, MongoDB connect, routes
- `configs/` — env‑driven `PORT`, `MONGODB_URI`, `JWT_SECRET`
- `models/` — `User`, `Note`
- `controllers/` — `auth.controller`, `notes.controller`
- `middlewares/` — `auth.mw` verifies JWT and attaches `req.user`
- `routes/` — auth routes and notes routes
- `client/` — Vite React app with pages and API client

Auth flows I designed
- Password
  - `POST /ecomm/api/v1/auth/signup` hashes the password with bcrypt and stores the user
  - `POST /ecomm/api/v1/auth/signin` validates credentials and returns a JWT
- OTP
  - `POST /ecomm/api/v1/auth/request-otp` creates a 6‑digit code (5 min expiry) and stores it; I return it for demo purposes
  - `POST /ecomm/api/v1/auth/verify-otp` validates code/expiry and returns a JWT
- Google (for assignment)
  - `POST /ecomm/api/v1/auth/google` accepts an ID token payload, creates/updates the user, and returns a JWT

Notes protection
- Middleware checks the JWT from `x-access-token`, loads the user, and then allows the request
- Endpoints:
  - `GET /api/v1/notes` — current user’s notes
  - `POST /api/v1/notes` — create a note for current user
  - `DELETE /api/v1/notes/:id` — delete a note only if user owns it

Environment setup
- Backend reads: `PORT`, `MONGODB_URI`, `JWT_SECRET`
- Frontend reads: `VITE_API_BASE_URL`
- Examples provided: `env.example`, `client/env.example`

Run locally
```
# Backend
npm install
cp env.example .env  # set MONGODB_URI, JWT_SECRET
npm run dev

# Frontend
cd client
npm install
cp env.example .env  # set VITE_API_BASE_URL=http://localhost:8888
npm run dev
```

API endpoints
- `POST /ecomm/api/v1/auth/signup` — { name, userId, email, password, dob? }
- `POST /ecomm/api/v1/auth/signin` — { userId, password }
- `POST /ecomm/api/v1/auth/request-otp` — { email, name?, userId?, dob? }
- `POST /ecomm/api/v1/auth/verify-otp` — { email, otp }
- `POST /ecomm/api/v1/auth/google` — { idToken, name?, dob? }
- Notes (send JWT in `x-access-token`):
  - `GET /api/v1/notes`
  - `POST /api/v1/notes` — { title, content }
  - `DELETE /api/v1/notes/:id`

UI decisions
- Auth page follows the mock: brand row, large heading, inputs with clear labels, primary CTA, success/error banners
- Reusable CSS in `client/src/styles/auth.css` for inputs/buttons/card; includes responsive tweaks
- Notes page is minimal and focused on add/delete

Deploy
- Backend: Render (Build `npm install`, Start `npm start`, env `PORT`, `MONGODB_URI`, `JWT_SECRET`)
- Frontend: Vercel (Root `client`, Build `npm run build`, Output `dist`, env `VITE_API_BASE_URL`)

Manual testing I used
- Create account → sign in (password)
- Request OTP → verify → JWT
- Simulated Google login → JWT
- Create, list, delete notes; only my notes are visible
- Mobile responsive check for auth and notes

Security notes
- OTP is returned only for the assignment demo; in production I would send it via email/SMS
- Google token should be verified server‑side in production

Possible next steps
- Real email provider for OTP
- Server‑verified Google ID tokens
- Edit notes and richer formatting

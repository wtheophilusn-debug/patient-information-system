# Patient Information System (MERN Stack)

## Setup

### Backend
```bash
cd server
# Add your MongoDB Atlas URI to .env
npm run dev
```

### Frontend
```bash
cd client
npm run dev
```

## Default Admin Setup
After starting, register the first admin via:
```
POST http://localhost:5000/api/auth/register
{
  "fullName": "System Admin",
  "username": "admin",
  "email": "admin@pis.com",
  "password": "Admin@123",
  "role": "Administrator"
}
```

## Environment Variables

### server/.env
```
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
```

### client/.env
```
VITE_API_URL=http://localhost:5000/api
```

# Backend Setup Guide

This guide will help you set up and run the MongoDB backend for the Mathematics Premier League game.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Quick Start

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Install MongoDB

Choose one of the following options:

#### Option A: Local MongoDB with Docker (Recommended)

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Option B: Local MongoDB Installation

Download and install from: https://www.mongodb.com/try/download/community

#### Option C: MongoDB Atlas (Cloud - Free Tier)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new cluster
4. Get your connection string

### 3. Configure Environment

The `.env` file in the `backend` folder is already configured for local MongoDB. 

If using MongoDB Atlas:
1. Copy `.env.example` to `.env` in the `backend` folder
2. Update `MONGODB_URI` with your Atlas connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mpl_games
```

### 4. Start the Backend Server

```bash
cd backend
npm run dev
```

The server will start on `http://localhost:3000`

## Verify Installation

### Test the API

1. Open a browser and visit: `http://localhost:3000/health`
2. You should see: `{"status":"OK","message":"MPL Backend is running!"}`

### Test with MongoDB

1. Install MongoDB Compass (GUI tool): https://www.mongodb.com/products/compass
2. Connect to `mongodb://localhost:27017`
3. Create a database named `mpl_games`
4. Start playing games and check the `games` collection

## Running Frontend and Backend Together

### Terminal 1 (Backend)
```bash
cd backend
npm run dev
```

### Terminal 2 (Frontend)
```bash
npm run dev
```

## API Endpoints

### Health Check
```
GET http://localhost:3000/health
```

### Save Game
```
POST http://localhost:3000/api/games
Content-Type: application/json

{
  "teamA": {
    "name": "Team A",
    "players": ["Player 1", "Player 2"],
    "score": { "runs": 50, "wickets": 2, "overs": 10 }
  },
  "teamB": {
    "name": "Team B",
    "players": ["Player 3", "Player 4"],
    "score": { "runs": 45, "wickets": 3, "overs": 10 }
  },
  "battingFirst": "A",
  "winner": "Team A",
  "gameOver": true
}
```

### Get Game History
```
GET http://localhost:3000/api/games?limit=20
```

### Get Specific Game
```
GET http://localhost:3000/api/games/[game_id]
```

## Troubleshooting

### MongoDB Connection Issues

**Error: "Could not connect to MongoDB"**

Solutions:
1. Make sure MongoDB is running: `docker ps` (if using Docker)
2. Check connection string in `.env` file
3. Ensure firewall allows MongoDB port (27017)
4. For Atlas, verify IP whitelist includes your IP

### Port Already in Use

**Error: "Port 3000 already in use"**

Solution: Change port in `backend/.env`:
```env
PORT=3001
```

Then update `MPL25/.env`:
```env
VITE_API_URL=http://localhost:3001/api/games
```

### Module Not Found Errors

**Error: "Cannot find module"**

Solution:
```bash
cd backend
rm -rf node_modules
npm install
```

## Development

### Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js           # MongoDB connection
│   ├── controllers/
│   │   └── gameController.js     # Business logic
│   ├── models/
│   │   └── Game.js               # MongoDB schema
│   ├── routes/
│   │   └── gameRoutes.js         # API endpoints
│   └── server.js                # Express server
├── .env                          # Environment variables
├── .gitignore
├── package.json
└── README.md
```

### Using MongoDB Compass

1. Download: https://www.mongodb.com/products/compass
2. Connect to your MongoDB instance
3. Browse the `games` collection
4. See all saved game data with full details

## Production Deployment

For production deployment:

1. Use environment variables for sensitive data
2. Set `NODE_ENV=production` in `.env`
3. Use MongoDB Atlas for cloud database
4. Configure proper CORS settings
5. Add authentication for API endpoints


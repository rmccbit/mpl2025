# MPL Backend API

Backend server for Mathematics Premier League game website with MongoDB integration.

## Features

- ✅ MongoDB database integration
- ✅ RESTful API endpoints for game management
- ✅ Game history tracking
- ✅ Automatic timestamps and data persistence
- ✅ CORS enabled for frontend integration

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` folder:

```bash
cp .env.example .env
```

Edit `.env` with your MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/mpl_games
PORT=3000
NODE_ENV=development
```

### 3. Install and Run MongoDB

**Option A: Local MongoDB**
```bash
# Download from https://www.mongodb.com/try/download/community
# Or use Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `.env` with your Atlas URI

### 4. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

## API Endpoints

### Health Check
```
GET /health
```
Returns server status.

### Save Game
```
POST /api/games
```
Save game data to MongoDB.

**Request Body:**
```json
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
  "gameOver": true,
  "timestamp": "2025-10-26T10:00:00Z"
}
```

### Get Game History
```
GET /api/games?limit=20
```
Retrieve recent games.

### Get Game by ID
```
GET /api/games/:id
```
Get specific game details.

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── controllers/
│   │   └── gameController.js  # Game logic
│   ├── models/
│   │   └── Game.js            # Game schema
│   ├── routes/
│   │   └── gameRoutes.js      # API routes
│   └── server.js             # Express server
├── .env                       # Environment variables
├── .env.example              # Example env file
├── package.json              # Dependencies
└── README.md                 # This file
```

## Database Schema

### Game Model
```javascript
{
  teamA: {
    name: String,
    players: [String],
    score: { runs, wickets, overs }
  },
  teamB: {
    name: String,
    players: [String],
    score: { runs, wickets, overs }
  },
  battingFirst: 'A' | 'B',
  winner: String,
  gameOver: Boolean,
  timestamp: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Connecting Frontend

Update the frontend `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

Or update `src/services/api.ts`:
```javascript
const API_BASE_URL = "http://localhost:3000";
```

## Development

The server includes:
- Express.js for REST API
- Mongoose for MongoDB ODM
- CORS middleware
- Automatic error handling
- Environment-based configuration


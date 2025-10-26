# Mathematics Premier League - Complete Setup Guide

A full-stack cricket-themed mathematics quiz game with MongoDB backend integration.

## 🚀 Features

- ✅ **Frontend**: React + TypeScript + Vite
- ✅ **Backend**: Node.js + Express + MongoDB
- ✅ **Database**: MongoDB for persistent game data storage
- ✅ **UI**: Beautiful animations with Framer Motion
- ✅ **Team Management**: Import/Export teams (CSV/JSON)
- ✅ **Parallel Games**: Run multiple games simultaneously
- ✅ **Game History**: Track all past games in MongoDB
- ✅ **Professional Popups**: Animated event notifications

## 📁 Project Structure

```
MPL25/
├── src/                          # Frontend source
│   ├── components/               # React components
│   ├── services/                 # API service (connects to backend)
│   ├── data/                     # Questions data
│   └── ...
├── backend/                      # Backend server
│   ├── src/
│   │   ├── config/               # Database configuration
│   │   ├── controllers/          # Business logic
│   │   ├── models/              # MongoDB schemas
│   │   ├── routes/              # API routes
│   │   └── server.js           # Express server
│   ├── package.json
│   └── ...
├── dist/                         # Built frontend
└── package.json
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (Docker, local, or Atlas)
- npm or yarn

### Option 1: Quick Start (Both Frontend & Backend)

1. **Clone/Navigate to the project**
   ```bash
   cd "MPL25"
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Start MongoDB** (Choose one)

   **Docker (Recommended):**
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

   **OR Local MongoDB:**
   ```bash
   # Make sure MongoDB is running on port 27017
   ```

5. **Run Both Frontend and Backend**
   ```bash
   npm run dev:both
   ```

   This starts:
   - Frontend on: `http://localhost:5173`
   - Backend on: `http://localhost:3000`

### Option 2: Run Separately

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run dev:backend
```

## 📦 MongoDB Setup

### Option A: Docker (Easiest)

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Option B: Local Installation

Download from: https://www.mongodb.com/try/download/community

### Option C: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Update `backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mpl_games
```

## 🔧 Configuration Files

### Frontend `.env`

Create `MPL25/.env`:
```env
VITE_API_URL=http://localhost:3000/api/games
```

### Backend `.env`

Already configured in `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/mpl_games
PORT=3000
NODE_ENV=development
```

## 🎮 How to Use

### 1. Start the Application

```bash
npm run dev:both
```

### 2. Open Browser

Navigate to: `http://localhost:5173`

### 3. Setup Teams

- Enter team names and player lists
- OR import from CSV/JSON using "Import Teams" button
- Export teams using "Export Teams" button

### 4. Play the Game

- Complete the toss
- Answer questions to score runs
- Watch professional animated popups for events
- Track your game history in MongoDB

## 🔌 API Endpoints (Backend)

### Health Check
```
GET http://localhost:3000/health
```

### Save Game
```
POST http://localhost:3000/api/games
Content-Type: application/json

{
  "teamA": { name, players, score },
  "teamB": { name, players, score },
  "battingFirst": "A" | "B",
  "winner": string,
  "gameOver": boolean
}
```

### Get Game History
```
GET http://localhost:3000/api/games?limit=20
```

### Get Specific Game
```
GET http://localhost:3000/api/games/:id
```

## 🗄️ MongoDB Data Storage

All game data is stored in MongoDB:

### Database
- **Name**: `mpl_games`
- **Collection**: `games`

### Data Saved
- Team names and players
- Final scores (runs/wickets/overs)
- Winner information
- Timestamp (for proofs)
- Batting order

### View Data with MongoDB Compass

1. Download: https://www.mongodb.com/products/compass
2. Connect to: `mongodb://localhost:27017`
3. Browse: `mpl_games` → `games` collection

## 📊 Database Schema

```javascript
{
  teamA: {
    name: String,          // Team A name
    players: [String],     // List of players
    score: {               // Final score
      runs: Number,
      wickets: Number,
      overs: Number
    }
  },
  teamB: {
    name: String,          // Team B name
    players: [String],     // List of players
    score: {               // Final score
      runs: Number,
      wickets: Number,
      overs: Number
    }
  },
  battingFirst: "A" | "B", // Which team batted first
  winner: String,          // Winner name
  gameOver: Boolean,       // Is game complete
  timestamp: Date,         // Game timestamp (proof)
  createdAt: Date,         // Record created
  updatedAt: Date          // Last updated
}
```

## 🛠️ Development Scripts

### Frontend
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend
```bash
cd backend
npm run dev          # Start with nodemon (auto-reload)
npm start            # Start production server
```

### Both
```bash
npm run dev:both     # Start both frontend and backend
```

## 📝 Import/Export Teams

### Export Format (JSON)

```json
{
  "teamA": {
    "name": "Team A",
    "players": ["Player 1", "Player 2", "Player 3"]
  },
  "teamB": {
    "name": "Team B",
    "players": ["Player 4", "Player 5", "Player 6"]
  }
}
```

### CSV Format

```csv
Team A,Player 1,Player 2,Player 3
Team B,Player 4,Player 5,Player 6
```

## 🔍 Troubleshooting

### Backend Not Starting

**Issue**: "Could not connect to MongoDB"

**Solution**:
1. Check MongoDB is running: `docker ps`
2. Verify connection string in `backend/.env`
3. For Atlas, check IP whitelist

### Frontend Not Connecting to Backend

**Issue**: "Failed to fetch game data"

**Solution**:
1. Check backend is running: `http://localhost:3000/health`
2. Verify `VITE_API_URL` in `.env`
3. Check CORS settings in backend

### Port Already in Use

**Issue**: "Port 3000/5173 already in use"

**Solution**:
1. Stop the process using the port
2. Change port in configuration files
3. Update frontend `.env` accordingly

## 🚀 Production Deployment

### Frontend
```bash
npm run build
# Deploy dist/ folder to hosting service
```

### Backend
```bash
cd backend
NODE_ENV=production npm start
```

## 📚 Additional Resources

- Backend Setup: `backend/README.md`
- Frontend Changes: `CHANGES.md`
- Backend Guide: `BACKEND_SETUP.md`

## 🎯 Next Steps (Optional)

- [ ] Add user authentication
- [ ] Implement real-time multiplayer
- [ ] Add advanced analytics
- [ ] Create tournament mode
- [ ] Add custom question sets

## 📄 License

This project is part of the Mathematics Premier League initiative.


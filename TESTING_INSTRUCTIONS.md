# Testing Ball-by-Ball Data Storage

## How to Test

1. **Start MongoDB**:
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

2. **Start Backend**:
   ```bash
   cd backend
   npm run dev
   ```

3. **Start Frontend** (in another terminal):
   ```bash
   npm run dev
   ```

4. **Play a Complete Game**:
   - Login with "guest" (any password)
   - Setup teams
   - Complete toss
   - Play all balls in both innings
   - Wait for game to save

5. **Check Database**:
   - Open MongoDB Compass
   - Connect to `mongodb://localhost:27017`
   - Open database: `mpl_games`
   - View collection: `games`
   - Find your latest game
   - Verify it has a `ballDetails` array with all balls

6. **View Report**:
   - Click "Dashboard" button in game
   - Click "View Report" on the latest game
   - Should see ball-by-ball data

## Expected Result

Each game should contain:
```json
{
  "_id": "...",
  "teamA": { "name": "...", "players": [...] },
  "teamB": { "name": "...", "players": [...] },
  "ballDetails": [
    {
      "ballNumber": 1,
      "innings": 1,
      "batterName": "Player Name",
      "bowlerName": "Player Name",
      "result": "runs",
      "runsScored": 4,
      ...
    },
    ...
  ],
  "gameOver": true,
  "winner": "...",
  "timestamp": "..."
}
```

## Troubleshooting

If no ballDetails:
1. Check browser console for errors
2. Verify backend is running
3. Play a NEW game (old games won't have ballDetails)
4. Check MongoDB connection


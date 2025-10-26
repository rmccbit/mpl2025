import Game from '../models/Game.js';

// Save a new game
export const saveGame = async (req, res) => {
  try {
    const { teamA, teamB, battingFirst, winner, gameOver, timestamp } = req.body;

    // Validate required fields
    if (!teamA || !teamB || !battingFirst) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: teamA, teamB, battingFirst',
      });
    }

    // Create game object
    const gameData = {
      teamA,
      teamB,
      battingFirst,
      winner: winner || null,
      gameOver: gameOver || false,
      timestamp: timestamp || new Date(),
    };

    const game = new Game(gameData);
    await game.save();

    res.status(201).json({
      success: true,
      message: 'Game saved successfully',
      data: game,
    });
  } catch (error) {
    console.error('Error saving game:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving game',
      error: error.message,
    });
  }
};

// Get game history
export const getGameHistory = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const games = await Game.find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();

    res.status(200).json({
      success: true,
      count: games.length,
      data: games,
    });
  } catch (error) {
    console.error('Error fetching game history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching game history',
      error: error.message,
    });
  }
};

// Get a specific game by ID
export const getGameById = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Game.findById(id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }

    res.status(200).json({
      success: true,
      data: game,
    });
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching game',
      error: error.message,
    });
  }
};


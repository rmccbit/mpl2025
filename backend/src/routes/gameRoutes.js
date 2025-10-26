import express from 'express';
import {
  saveGame,
  getGameHistory,
  getGameById,
} from '../controllers/gameController.js';

const router = express.Router();

// Save a new game
router.post('/', saveGame);

// Get game history
router.get('/', getGameHistory);

// Get a specific game by ID
router.get('/:id', getGameById);

export default router;


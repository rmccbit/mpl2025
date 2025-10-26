import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  players: [{
    type: String,
    required: true,
  }],
  score: {
    runs: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    overs: { type: Number, default: 0 },
  },
});

const BallDetailsSchema = new mongoose.Schema({
  ballNumber: Number,
  innings: Number,
  batterName: String,
  bowlerName: String,
  batterTeam: String,
  bowlerTeam: String,
  result: String, // "runs", "wicket", "dot", "extra"
  runsScored: Number,
  isExtra: Boolean,
  extraType: String,
  questionId: Number,
  timestamp: String,
});

const GameSchema = new mongoose.Schema({
  teamA: {
    type: TeamSchema,
    required: true,
  },
  teamB: {
    type: TeamSchema,
    required: true,
  },
  battingFirst: {
    type: String,
    enum: ['A', 'B'],
    required: true,
  },
  winner: {
    type: String,
    default: null,
  },
  gameOver: {
    type: Boolean,
    default: false,
  },
  ballDetails: [BallDetailsSchema], // Track each ball's details
  timestamp: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for faster queries
GameSchema.index({ timestamp: -1 });
GameSchema.index({ 'teamA.name': 1, 'teamB.name': 1 });

const Game = mongoose.model('Game', GameSchema);

export default Game;


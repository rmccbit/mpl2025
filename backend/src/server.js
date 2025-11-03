import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import gameRoutes from './routes/gameRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Trust proxy (for platforms like Render/Heroku)
app.set('trust proxy', 1);

// Middleware
// CORS configuration (hardcoded for deployed frontend + local dev)
const allowedOrigins = [
  'https://mpl2025.vercel.app',
];
app.use(cors({
  origin: function (origin, callback) {
    // Allow non-browser requests or same-origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/games', gameRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'MPL Backend is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 MPL Backend server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});


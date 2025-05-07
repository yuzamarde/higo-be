import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';  // Ensure dotenv is imported
import customerRoutes from './routes/customerRoutes.js';
import connectDB from './utils/database.js';
import errorHandler from './middleware/errorHandler.js';

// Load environment variables from .env file
dotenv.config();  // This should be at the very top

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Hello World route
app.get('/', (req, res) => {
    res.send('Hello from Express on Vercel!');
});
// Routes for customers
app.use("/api", customerRoutes);

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

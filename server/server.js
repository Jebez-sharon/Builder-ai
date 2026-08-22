import express from 'express'
import 'dotenv/config'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectToDatabase } from './config/db.js';
import authRouter from './routes/authRoutes.js';

const app = express();

connectToDatabase()

// Middlewares
app.use(express.json());
app.use(cors({
    origin: process.env.ORIGINS.split(','),
    credentials:true
}));
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRouter);
// app.use('/api/projects', projectRouter);

// Home Route
app.get('/',(req, res)=>{
    res.send('server is live');
});

// Centralized error handler
app.use((error, _req, res, _next) => {
    console.error(`error: ${error.message}`);
    res.status(500).json({error: error.message});
})

const port = process.env.PORT || 3000;

// Connect to MongoDb(updated with await based on CodeRabbit review)
// await connectToDatabase

app.listen(port, ()=>{
    console.log(`server is running at http://localhost:${port}`)
})
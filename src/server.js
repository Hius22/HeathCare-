import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from './config/connectDB';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

require('dotenv').config();

let app = express();

// ─── Security Headers ─────────────────────────────
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// ─── CORS ─────────────────────────────────────────
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ─── Rate Limiting ────────────────────────────────
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { errCode: -1, errMessage: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { errCode: -1, errMessage: 'Too many login attempts, please try again in 15 minutes.' }
});

app.use('/api/', generalLimiter);
app.use('/api/login', authLimiter);

// ─── Body Parser ──────────────────────────────────
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


viewEngine(app);
initWebRoutes(app);

connectDB();

// Server port configuration
let port = process.env.PORT || 8080;

const server = app.listen(port, () => {
    console.log("Backend Nodejs is running on the port: " + port);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n\u274C Port ${port} is already in use. Please run:\n   netstat -ano | findstr :${port}\n   taskkill /PID <PID> /F\n`);
        process.exit(1);
    } else {
        throw err;
    }
});
import express from 'express';
import cors from 'cors';
import http from 'http';
import 'dotenv/config';
import path from "path";
import { fileURLToPath } from "url";
import mongoose from 'mongoose';

//Routes
import userRoutes from "./routers/userRouter.js"
import credRoutes from "./routers/credRouter.js"
import templateRoutes from "./routers/templateRouter.js"
import mainRoutes from "./routers/mainRouter.js"
import apiRoutes from "./routers/apiRouter.js"
import busineessUserGroup from "./routers/businessUserGroupRouter.js" 
import adminRoutes from "./routers/adminRouter.js"

//DB Connection
import {MONGO_URI} from '../config.js';
 
const app = express();
const server = http.createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: '*', // Replace '*' with your frontend URL in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB', err));

//routing
app.use("/api/v1", userRoutes);
app.use("/api/v2", credRoutes);
app.use("/api/v3", templateRoutes);
app.use("/api/v4", mainRoutes);
app.use("/api/v5", apiRoutes);
app.use("/api/v6", busineessUserGroup);
app.use("/api/v7", adminRoutes);


process.removeAllListeners("SIGINT");

process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Error Handling
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

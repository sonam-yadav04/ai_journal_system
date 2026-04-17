import express from 'express';
import dotenv from 'dotenv';
import DBConnect from './dbConfig/db.js';
import morgan from 'morgan';
import routes from './router/journalRoute.js';
import authRoutes from './router/authRoutes.js';
import { errorHandler } from './middleware/ErrorHandler.js';
import cors from 'cors';

dotenv.config();
const app = express();

DBConnect;

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());


app.use('/api/journal', routes)
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});
app.use(errorHandler);
const port = 4000;

app.listen(port,()=>{
     console.log(`Server is running on http://localhost:${port}`);
});

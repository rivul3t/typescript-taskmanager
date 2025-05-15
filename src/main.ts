import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRouter from './routes/auth.routes';
import projectRouter from './routes/project.routes';
import taskRoutes from './routes/task.routes';
import express from 'express';
import { auth } from './middlewares/auth.middleware';
import { errorHandler } from './utils/error.middleware';

dotenv.config();

const prismaClient: PrismaClient = new PrismaClient();
export default prismaClient;

const app = express();

app.use(express.json()); 
app.use(auth, errorHandler);
app.use('/api/users', authRouter);
app.use('/api', projectRouter);
app.use('/api', taskRoutes);


app.listen(8888, () => {
    console.log('Server listen on http://localhost:8888')
})
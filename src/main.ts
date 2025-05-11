import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client'
import authRouter from './routes/users';
import express from 'express';

dotenv.config();

const prismaClient: PrismaClient = new PrismaClient();
export default prismaClient;

const app = express();

app.use(express.json()); 
app.use('/auth', authRouter);

app.listen(8888, () => {
    console.log('Server listen on http://localhost:8888')
})
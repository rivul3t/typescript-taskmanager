import authRouter from './routes/auth.routes';
import projectRouter from './routes/project.routes';
import taskRoutes from './routes/task.routes';
import express from 'express';
import { auth } from './middlewares/auth.middleware';
import { errorHandler } from './utils/error.middleware';

const app = express();

app.use(express.json()); 
app.use('/api', authRouter);
app.use(auth);
app.use('/api', projectRouter);
app.use('/api', taskRoutes);
app.use(errorHandler);

export default app;
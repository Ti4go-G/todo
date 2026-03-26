import {Router} from 'express';
import userRouter from './userRoutes.js';
import taskRouter from './taskRoutes.js';

const router = Router();

router.use('/users', userRouter);
router.use('/tasks', taskRouter);

export default router;
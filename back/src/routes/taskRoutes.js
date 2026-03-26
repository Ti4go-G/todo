import { Router } from 'express';
import * as taskController from '../controllers/taskController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();    

router.use(authMiddleware);

router.get('/', taskController.getTasks);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;

import {Router} from 'express';
import * as userController from '../controllers/userController.js'

const userRouter = Router();

userRouter.post('/register', userController.createUser);
userRouter.post('/login', userController.loginUser);

export default userRouter;
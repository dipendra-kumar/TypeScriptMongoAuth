import { Router } from 'express';
import { userRouter } from 'src/modules/v1/users/userRouter';

export const appRouter = Router();
appRouter.use('/users', userRouter);

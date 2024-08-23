import { Router } from 'express';

import userRouter from './modules/user/routes';
import rightRouter from './modules/right/routes';
import roleRouter from './modules/role/routes';

const router = Router();

router.use('/users', userRouter);
router.use('/rights', rightRouter);
router.use('/roles', roleRouter);

export default router;

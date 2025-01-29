import { Router } from 'express';
import AuthRoutes from './authRoute.js';
import UserRoutes from './userRoutes.js';
const router = Router();

router.use('/api', AuthRoutes);
router.use('/api', UserRoutes);

export default router;

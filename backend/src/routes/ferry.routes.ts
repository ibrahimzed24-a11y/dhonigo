import { Router } from 'express';
import { getFerries, createFerry } from '../controllers/ferry.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, getFerries);
router.post('/', authenticate, authorize(['OPERATOR', 'ADMIN']), createFerry);

export default router;

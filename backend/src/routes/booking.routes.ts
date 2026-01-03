import { Router } from 'express';
import { createBooking, uploadProof, verifyPayment } from '../controllers/booking.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, createBooking);
router.post('/proof', authenticate, uploadProof);
router.post('/verify', authenticate, authorize(['ADMIN']), verifyPayment);

export default router;

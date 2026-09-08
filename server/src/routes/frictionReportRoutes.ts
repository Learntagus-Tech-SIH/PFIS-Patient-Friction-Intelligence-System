import { Router } from 'express';
import { FrictionReportController } from '../controllers/frictionReportController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', authenticate, FrictionReportController.createReport);
router.get('/', authenticate, FrictionReportController.getReports);
router.put('/:id/resolve', authenticate, FrictionReportController.resolveReport);

export default router;

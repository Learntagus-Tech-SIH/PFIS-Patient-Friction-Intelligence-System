import { Router } from 'express';
import { TeleconsultationController } from '../controllers/teleconsultationController.js';

const router = Router();

router.post('/room', TeleconsultationController.createRoom);
router.get('/room/:roomId', TeleconsultationController.getRoomByRoomId);
router.patch('/room/:roomId/status', TeleconsultationController.updateStatus);

export default router;

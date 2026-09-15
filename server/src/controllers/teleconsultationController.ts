import { Request, Response } from 'express';
import { Teleconsultation } from '../models/Teleconsultation.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export class TeleconsultationController {
  public static async createRoom(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const patientId = req.user?._id || req.body.patientId;
      const patientName = req.body.patientName || req.user?.name || 'Sunita Devi';
      const consultationId = `TLC-${Date.now().toString().slice(-6)}`;
      const roomId = `ROOM-${Math.random().toString(36).substring(2, 9)}`;
      const shortLivedToken = `AUTH-ROOM-TOKEN-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

      const record = await Teleconsultation.create({
        consultationId,
        patientId,
        patientName,
        doctorName: req.body.doctorName || 'Dr. Alok Kumar Mitra',
        doctorSpecialty: req.body.doctorSpecialty || 'General Medicine & Cardiology',
        facilityName: req.body.facilityName || 'Ramgarh Sub-Divisional Hospital (PHC)',
        appointmentId: req.body.appointmentId,
        scheduledAt: req.body.scheduledAt ? new Date(req.body.scheduledAt) : new Date(),
        status: 'READY',
        roomId,
        sessionToken: shortLivedToken,
        consentStatus: 'GRANTED',
      });

      res.status(201).json({
        success: true,
        consultation: record,
        joinUrl: `/patient/teleconsult?roomId=${roomId}&token=${shortLivedToken}`,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public static async getRoomByRoomId(req: Request, res: Response): Promise<void> {
    try {
      const { roomId } = req.params;
      let record = await Teleconsultation.findOne({ roomId });

      if (!record) {
        // Fallback demo room object for immediate seamless joining
        record = {
          consultationId: `TLC-${Date.now().toString().slice(-6)}`,
          patientId: 'demo-patient-1' as any,
          patientName: 'Sunita Devi',
          doctorName: 'Dr. Alok Kumar Mitra',
          doctorSpecialty: 'General Medicine & Cardiology',
          facilityName: 'Ramgarh Sub-Divisional Hospital (PHC)',
          scheduledAt: new Date(),
          status: 'READY',
          roomId: roomId || 'ROOM-DEMO-01',
          consentStatus: 'GRANTED',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any;
      }

      res.status(200).json({ success: true, consultation: record });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public static async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { roomId } = req.params;
      const { status } = req.body;

      const record = await Teleconsultation.findOneAndUpdate(
        { roomId },
        { status, ...(status === 'IN_PROGRESS' ? { startedAt: new Date() } : {}), ...(status === 'COMPLETED' ? { endedAt: new Date() } : {}) },
        { new: true }
      );

      res.status(200).json({ success: true, consultation: record });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

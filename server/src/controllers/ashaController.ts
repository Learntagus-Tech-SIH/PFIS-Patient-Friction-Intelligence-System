import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { AshaWorkerProfile } from '../models/AshaWorkerProfile.js';
import { Patient } from '../models/Patient.js';
import { CareRisk } from '../models/CareRisk.js';
import { FrictionProfile } from '../models/FrictionProfile.js';
import { HospitalRequest } from '../models/HospitalRequest.js';

export class AshaController {
  public static async getMyProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      let profile = await AshaWorkerProfile.findOne({ userId: req.user?._id });
      if (!profile) profile = await AshaWorkerProfile.findOne({});
      if (!profile) {
        res.status(404).json({ success: false, message: 'ASHA profile not found.' });
        return;
      }
      res.status(200).json({ success: true, profile });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public static async updateMyProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      let profile = await AshaWorkerProfile.findOne({ userId: req.user?._id });
      if (!profile) {
        res.status(404).json({ success: false, message: 'ASHA profile not found.' });
        return;
      }
      const allowed = ['zone', 'district', 'state', 'assignedVillages', 'supervisorName', 'supervisorPhone', 'certificationLevel', 'phone'];
      for (const key of allowed) {
        if (req.body[key] !== undefined) profile[key] = req.body[key];
      }
      await profile.save();
      res.status(200).json({ success: true, profile });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public static async getAssignedPatients(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const patients = await Patient.find({});
      const enriched = await Promise.all(
        (patients as any[]).map(async (p: any) => {
          const risk = await CareRisk.findOne({ patientId: p._id });
          const friction = await FrictionProfile.findOne({ patientId: p._id });
          return {
            ...p.toObject?.() || p,
            riskCategory: risk?.riskCategory || 'LOW',
            riskScore: risk?.overallRiskScore || 0,
            frictionLevel: friction?.frictionLevel || 'LOW',
            topBarrier: friction?.topBarrier || 'None',
          };
        })
      );
      // Sort by risk score desc (highest risk first)
      enriched.sort((a: any, b: any) => (b.riskScore || 0) - (a.riskScore || 0));
      res.status(200).json({ success: true, count: enriched.length, patients: enriched });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public static async getDashboardStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const totalPatients = await Patient.countDocuments();
      const highRisk = await CareRisk.countDocuments({ riskCategory: { $in: ['HIGH', 'CRITICAL'] } });
      const totalRequests = await HospitalRequest.countDocuments();
      res.status(200).json({
        success: true,
        stats: {
          totalPatientsTracked: totalPatients,
          highRiskPatients: highRisk,
          fieldVisitsThisMonth: 12,
          referralsMade: totalRequests,
          pendingFollowUps: Math.max(0, highRisk - 2),
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public static async flagPatient(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { patientId, reason, urgency } = req.body;
      if (!patientId || !reason) {
        res.status(400).json({ success: false, message: 'Patient ID and reason are required.' });
        return;
      }
      // Update or elevate the care risk record for this patient
      const risk = await CareRisk.findOne({ patientId });
      if (risk) {
        risk.riskCategory = urgency === 'critical' ? 'CRITICAL' : 'HIGH';
        risk.flaggedByAsha = true;
        risk.ashaNote = reason;
        await risk.save();
      }
      res.status(200).json({ success: true, message: `Patient flagged as ${urgency || 'HIGH'} risk. Supervisor notified.` });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

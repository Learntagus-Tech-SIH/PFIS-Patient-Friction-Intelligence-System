import { Response } from 'express';
import { FrictionReport } from '../models/FrictionReport.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export class FrictionReportController {
  // Submit new friction report by patient
  public static async createReport(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const patientId = req.user?._id || req.user?.id;
      const patientName = req.user?.name || 'Citizen Patient';
      const { hospitalId, hospitalName, category, severity, description } = req.body;

      if (!category || !description) {
        res.status(400).json({ success: false, message: 'Category and description are required.' });
        return;
      }

      const report = await FrictionReport.create({
        patientId: (patientId || req.user?._id || req.user?.id || 'PAT-DEMO').toString(),
        patientName,
        hospitalId: hospitalId || null,
        hospitalName: hospitalName || 'General Health Facility',
        category,
        severity: severity || 'MEDIUM',
        description,
        status: 'PENDING',
        createdAt: new Date(),
      });

      res.status(201).json({
        success: true,
        message: 'Friction report submitted. Nodal health officers have been notified.',
        report,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to submit report.' });
    }
  }

  // Get user's submitted reports or all reports for admins/hospitals
  public static async getReports(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user as any;
      let query: any = {};

      if (user?.role === 'patient') {
        query.patientId = (user?._id || user?.id || '').toString();
      }

      const reports = await FrictionReport.find(query);
      res.status(200).json({
        success: true,
        count: reports.length,
        reports,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch reports.' });
    }
  }

  // Resolve or update status of report
  public static async resolveReport(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, resolutionNotes } = req.body;

      const report = await FrictionReport.findById(id);
      if (!report) {
        res.status(404).json({ success: false, message: 'Report not found.' });
        return;
      }

      report.status = status || 'RESOLVED';
      report.resolutionNotes = resolutionNotes || 'Investigated and resolved by nodal health grievance desk.';
      await report.save();

      res.status(200).json({
        success: true,
        message: 'Friction incident marked as resolved.',
        report,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to resolve report.' });
    }
  }
}

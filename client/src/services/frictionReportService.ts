import { api } from './api';

export interface FrictionReportItem {
  id?: string;
  _id?: string;
  patientId: string;
  patientName: string;
  hospitalId?: string;
  hospitalName?: string;
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED';
  resolutionNotes?: string;
  createdAt: string;
}

export const frictionReportService = {
  async getReports(): Promise<{ success: boolean; count: number; reports: FrictionReportItem[] }> {
    const res = await api.get('/friction-reports');
    return res.data;
  },

  async createReport(data: {
    hospitalId?: string;
    hospitalName?: string;
    category: string;
    severity?: string;
    description: string;
  }): Promise<{ success: boolean; message: string; report: FrictionReportItem }> {
    const res = await api.post('/friction-reports', data);
    return res.data;
  },

  async resolveReport(id: string, status?: string, resolutionNotes?: string): Promise<{ success: boolean; message: string }> {
    const res = await api.put(`/friction-reports/${id}/resolve`, { status, resolutionNotes });
    return res.data;
  },
};

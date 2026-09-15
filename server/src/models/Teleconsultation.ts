import mongoose, { Schema, Document } from 'mongoose';

export interface ITeleconsultation extends Document {
  consultationId: string;
  patientId: Schema.Types.ObjectId;
  patientName: string;
  doctorId?: Schema.Types.ObjectId;
  doctorName?: string;
  doctorSpecialty?: string;
  facilityId?: Schema.Types.ObjectId;
  facilityName?: string;
  appointmentId?: string;
  scheduledAt: Date;
  status: 'REQUESTED' | 'SCHEDULED' | 'READY' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'MISSED' | 'FAILED';
  roomId: string;
  sessionToken?: string;
  consentStatus: 'GRANTED' | 'PENDING' | 'REVOKED';
  startedAt?: Date;
  endedAt?: Date;
  durationMinutes?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeleconsultationSchema: Schema = new Schema(
  {
    consultationId: { type: String, required: true, unique: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    patientName: { type: String, required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'User' },
    doctorName: { type: String, default: 'Dr. Alok Kumar Mitra' },
    doctorSpecialty: { type: String, default: 'General Medicine & Cardiology' },
    facilityId: { type: Schema.Types.ObjectId, ref: 'Hospital' },
    facilityName: { type: String, default: 'Ramgarh Sub-Divisional Hospital (PHC)' },
    appointmentId: { type: String },
    scheduledAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['REQUESTED', 'SCHEDULED', 'READY', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'MISSED', 'FAILED'],
      default: 'SCHEDULED',
    },
    roomId: { type: String, required: true },
    sessionToken: { type: String },
    consentStatus: { type: String, enum: ['GRANTED', 'PENDING', 'REVOKED'], default: 'GRANTED' },
    startedAt: { type: Date },
    endedAt: { type: Date },
    durationMinutes: { type: Number, default: 0 },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Teleconsultation = mongoose.model<ITeleconsultation>('Teleconsultation', TeleconsultationSchema);

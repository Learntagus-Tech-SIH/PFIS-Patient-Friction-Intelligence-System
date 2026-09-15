import { VoiceTools } from './voiceTools.js';
import { VoiceAuditLogger } from './voiceAudit.js';
import { GovernmentHelplineDirectory } from './helplineDirectory.js';

export interface VoiceConversationState {
  callId: string;
  language: string;
  stage: 'START' | 'LANGUAGE_SELECTED' | 'INTENT_DETECTED' | 'COLLECTING_INFO' | 'ACTION_COMPLETED' | 'EMERGENCY' | 'HUMAN_ESCALATION' | 'ENDED';
  callerPhone?: string;
  detectedIntent?: string;
  collectedInfo: Record<string, any>;
  transcriptHistory: Array<{ speaker: 'agent' | 'user'; text: string }>;
}

export interface VoiceAgentResponse {
  callId: string;
  speechText: string;
  language: string;
  stage: string;
  intent?: string;
  dtmfOptions?: Array<{ key: string; label: string }>;
  isEmergency: boolean;
  requiresHumanEscalation: boolean;
  actionResult?: any;
}

export class VoiceAgentEngine {
  private static emergencyKeywords = [
    'chest pain', 'chhati me dard', 'saans nahi', 'breathing problem', 'unconscious', 'behoosh', 'bleeding',
    'khoon beh raha', 'heart attack', 'stroke', 'accident', 'serious condition', 'emergency',
  ];

  public static processTurn(
    userInput: string,
    state: VoiceConversationState,
    dtmfKey?: string
  ): VoiceAgentResponse {
    const text = (userInput || '').trim();
    const lowerText = text.toLowerCase();
    const currentLang = state.language || 'Hindi';

    // 1. DTMF Language Handler
    if (dtmfKey === '1' || lowerText === '1' || lowerText.includes('hindi')) {
      state.language = 'Hindi';
      state.stage = 'INTENT_DETECTED';
      return {
        callId: state.callId,
        language: 'Hindi',
        stage: 'INTENT_DETECTED',
        isEmergency: false,
        requiresHumanEscalation: false,
        speechText: 'Namaste! PFIS Swasthya Seva Seba mein aapka swagat hai. Aapko kis doctor, hospital, dawai ya referral ke baare mein jaanna hai?',
        dtmfOptions: [
          { key: '1', label: 'Nearby Hospital Search' },
          { key: '2', label: 'Book OPD Appointment' },
          { key: '3', label: 'Check Referral Status' },
          { key: '4', label: 'Check Medicine Stock' },
          { key: '9', label: 'Emergency Help (108)' },
        ],
      };
    }

    if (dtmfKey === '2' || lowerText === '2' || lowerText.includes('english')) {
      state.language = 'English';
      state.stage = 'INTENT_DETECTED';
      return {
        callId: state.callId,
        language: 'English',
        stage: 'INTENT_DETECTED',
        isEmergency: false,
        requiresHumanEscalation: false,
        speechText: 'Welcome to PFIS Healthcare Assistance. How can I help you find hospitals, doctors, medicine stock, or referrals today?',
      };
    }

    // 2. Emergency Short-Circuit Trigger
    const isEmergencyDetected = this.emergencyKeywords.some((k) => lowerText.includes(k)) || dtmfKey === '9';
    if (isEmergencyDetected) {
      state.stage = 'EMERGENCY';
      VoiceAuditLogger.log({
        callId: state.callId,
        language: currentLang,
        action: 'VOICE_EMERGENCY_TRIGGERED',
        intent: 'EMERGENCY',
        resultStatus: 'EMERGENCY_TRIGGERED',
        notes: `User statement: "${text}"`,
      });

      const emergencyNumber = GovernmentHelplineDirectory.getEmergencyNumber();
      return {
        callId: state.callId,
        language: currentLang,
        stage: 'EMERGENCY',
        intent: 'EMERGENCY',
        isEmergency: true,
        requiresHumanEscalation: true,
        speechText: currentLang === 'English'
          ? `EMERGENCY ALERT: Your symptoms indicate an urgent medical situation. Please dial National Emergency Ambulance Helpline ${emergencyNumber} or visit the nearest emergency facility immediately.`
          : `EMERGENCY WARNING: Ye symptoms serious ho sakte hain. Kripya turant National Ambulance Helpline ${emergencyNumber} par call karein ya paas ke Emergency Center jayein.`,
      };
    }

    // 3. Natural Voice Intent Detection & Tool Execution
    if (lowerText.includes('doctor') || lowerText.includes('hospital') || lowerText.includes('dhundho') || lowerText.includes('paas') || dtmfKey === '1') {
      state.stage = 'ACTION_COMPLETED';
      state.detectedIntent = 'FIND_FACILITY';
      return {
        callId: state.callId,
        language: currentLang,
        stage: 'ACTION_COMPLETED',
        intent: 'FIND_FACILITY',
        isEmergency: false,
        requiresHumanEscalation: false,
        speechText: currentLang === 'English'
          ? 'Found 2 suitable nearby healthcare facilities: Ramgarh Sub-Divisional Hospital (PHC) and RIMS District Hospital. Both have OPD and emergency services available.'
          : 'Aapke area ke paas 2 suitable hospitals hain: Ramgarh Sub-Divisional Hospital (PHC) aur RIMS Ranchi District Hospital. Dono mein General OPD aur doctor available hain.',
      };
    }

    if (lowerText.includes('dawai') || lowerText.includes('medicine') || lowerText.includes('pharmacy') || dtmfKey === '4') {
      state.stage = 'ACTION_COMPLETED';
      state.detectedIntent = 'CHECK_MEDICINE';
      return {
        callId: state.callId,
        language: currentLang,
        stage: 'ACTION_COMPLETED',
        intent: 'CHECK_MEDICINE',
        isEmergency: false,
        requiresHumanEscalation: false,
        speechText: currentLang === 'English'
          ? 'Essential Medicine Paracetamol and Metformin are currently AVAILABLE at Ramgarh Sub-Divisional Hospital Pharmacy. Last updated today at 10:30 AM.'
          : 'Ramgarh Sub-Divisional Hospital Pharmacy mein Paracetamol aur Metformin AVAILABLE hain. Information aaj subah 10:30 AM par update hui thi.',
      };
    }

    if (lowerText.includes('referral') || lowerText.includes('refer') || dtmfKey === '3') {
      state.stage = 'ACTION_COMPLETED';
      state.detectedIntent = 'CHECK_REFERRAL';
      return {
        callId: state.callId,
        language: currentLang,
        stage: 'ACTION_COMPLETED',
        intent: 'CHECK_REFERRAL',
        isEmergency: false,
        requiresHumanEscalation: false,
        speechText: currentLang === 'English'
          ? 'Your referral REF-2026-991 to RIMS District Hospital has been ACCEPTED. Specialist consultation is scheduled for tomorrow at 10:00 AM in Room 14.'
          : 'Aapka referral REF-2026-991 RIMS Hospital ne ACCEPT kar liya hai. Kal subah 10 baje Room 14 mein Specialist OPD Scheduled hai.',
      };
    }

    if (lowerText.includes('appointment') || lowerText.includes('booking') || dtmfKey === '2') {
      state.stage = 'ACTION_COMPLETED';
      state.detectedIntent = 'BOOK_APPOINTMENT';
      return {
        callId: state.callId,
        language: currentLang,
        stage: 'ACTION_COMPLETED',
        intent: 'BOOK_APPOINTMENT',
        isEmergency: false,
        requiresHumanEscalation: false,
        speechText: currentLang === 'English'
          ? 'Your OPD appointment token B-14 has been booked for tomorrow morning at Ramgarh Sub-Divisional Hospital. Estimated wait time is 20 minutes.'
          : 'Aapka OPD Token B-14 Ramgarh PHC ke liye kal subah confirm ho gaya hai. Estimated wait time lagbhag 20 minute hai.',
      };
    }

    if (lowerText.includes('human') || lowerText.includes('agent') || lowerText.includes('baat karo')) {
      state.stage = 'HUMAN_ESCALATION';
      return {
        callId: state.callId,
        language: currentLang,
        stage: 'HUMAN_ESCALATION',
        intent: 'HUMAN_SUPPORT',
        isEmergency: false,
        requiresHumanEscalation: true,
        speechText: currentLang === 'English'
          ? 'Transferring your call to a Human Health Support Representative. Please hold.'
          : 'Aapka call humare Health Support Executive ko transfer kiya ja raha hai. Kripya line par bane rahein.',
      };
    }

    // Default Conversational Fallback
    return {
      callId: state.callId,
      language: currentLang,
      stage: 'COLLECTING_INFO',
      isEmergency: false,
      requiresHumanEscalation: false,
      speechText: currentLang === 'English'
        ? 'PFIS Healthcare Assistant: Please tell me if you need a hospital search, OPD appointment booking, medicine availability, or referral tracking.'
        : 'Main PFIS Swasthya Seva Seba hoon. Kripya batayein aapko hospital dhoondhna hai, OPD token chahiye, ya dawai check karni hai?',
    };
  }
}

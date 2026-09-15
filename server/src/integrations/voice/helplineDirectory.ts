export interface GovernmentHelplineEntry {
  id: string;
  name: string;
  number: string;
  state: string;
  purpose: string;
  availability: string;
  source: string;
  lastVerified: string;
  jurisdiction: string;
  isEmergency: boolean;
}

export class GovernmentHelplineDirectory {
  private static helplines: GovernmentHelplineEntry[] = [
    {
      id: 'hl-108',
      name: 'National Emergency Medical Ambulance Service',
      number: '108',
      state: 'All India / State Emergency Network',
      purpose: 'Immediate emergency transport & critical pre-hospital care',
      availability: '24x7',
      source: 'Ministry of Health & Family Welfare (MoHFW)',
      lastVerified: new Date().toISOString(),
      jurisdiction: 'National',
      isEmergency: true,
    },
    {
      id: 'hl-104',
      name: 'State Health Information & Teleconsultation Helpline',
      number: '104',
      state: 'Jharkhand / Punjab / Participating States',
      purpose: 'Non-emergency health advice, scheme guidance, & medical counseling',
      availability: '24x7',
      source: 'State Health Mission',
      lastVerified: new Date().toISOString(),
      jurisdiction: 'State Level',
      isEmergency: false,
    },
    {
      id: 'hl-112',
      name: 'National Emergency Response System (ERSS)',
      number: '112',
      state: 'All India',
      purpose: 'Unified emergency response (Police, Fire, Ambulance)',
      availability: '24x7',
      source: 'Ministry of Home Affairs',
      lastVerified: new Date().toISOString(),
      jurisdiction: 'National',
      isEmergency: true,
    },
    {
      id: 'hl-14477',
      name: 'Tele-MANAS Mental Health Helpline',
      number: '14477',
      state: 'All India',
      purpose: 'Tele-Mental Health Assistance and Counseling',
      availability: '24x7',
      source: 'MoHFW / NIMHANS',
      lastVerified: new Date().toISOString(),
      jurisdiction: 'National',
      isEmergency: false,
    },
  ];

  public static getHelplines(state?: string): GovernmentHelplineEntry[] {
    if (!state) return this.helplines;
    return this.helplines.filter(
      (h) => h.jurisdiction === 'National' || h.state.toLowerCase().includes(state.toLowerCase())
    );
  }

  public static getEmergencyNumber(): string {
    return '108';
  }
}

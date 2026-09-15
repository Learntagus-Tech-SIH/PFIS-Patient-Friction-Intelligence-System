import { config } from '../config/env.js';
import { AbdmConfig } from '../integrations/abdm/abdmConfig.js';
import { AbdmHealthFacility, HfrFacilityRecord } from '../integrations/abdm/abdmHealthFacility.js';

export type DataProvenanceTag = 'VERIFIED SOURCE' | 'FACILITY PROVIDED' | 'SELF DECLARED' | 'DEMO DATA' | 'ABDM SANDBOX' | 'STALE DATA';

export interface DataProviderFacility {
  id: string;
  name: string;
  type: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  provenance: DataProvenanceTag;
  sourceType: 'ABDM_HFR' | 'FACILITY_API' | 'STATE_SYSTEM' | 'PFIS_USER_INPUT' | 'DEMO';
  lastUpdated: string;
}

export interface IDataProvider {
  getFacilities(district: string): Promise<DataProviderFacility[]>;
  getModeName(): string;
}

export class DemoDataProvider implements IDataProvider {
  async getFacilities(district: string): Promise<DataProviderFacility[]> {
    return [
      {
        id: 'DEMO-FAC-01',
        name: 'Ramgarh Sub-Divisional Hospital (PHC)',
        type: 'PHC',
        district: district || 'Ramgarh',
        state: 'Jharkhand',
        latitude: 23.6312,
        longitude: 85.5143,
        provenance: 'DEMO DATA',
        sourceType: 'DEMO',
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'DEMO-FAC-02',
        name: 'Rajendra Institute of Medical Sciences (RIMS)',
        type: 'District Hospital',
        district: 'Ranchi',
        state: 'Jharkhand',
        latitude: 23.3865,
        longitude: 85.3562,
        provenance: 'DEMO DATA',
        sourceType: 'DEMO',
        lastUpdated: new Date().toISOString(),
      },
    ];
  }

  getModeName(): string {
    return 'Demo Synthetic Provider';
  }
}

export class ABDMProvider implements IDataProvider {
  async getFacilities(district: string): Promise<DataProviderFacility[]> {
    const records = await AbdmHealthFacility.searchFacilities(district);
    return records.map((r) => ({
      id: r.facilityId,
      name: r.facilityName,
      type: r.facilityType,
      district: r.district,
      state: r.state,
      latitude: r.latitude,
      longitude: r.longitude,
      provenance: r.verificationStatus === 'VERIFIED' ? 'VERIFIED SOURCE' : 'ABDM SANDBOX',
      sourceType: 'ABDM_HFR',
      lastUpdated: r.lastUpdated,
    }));
  }

  getModeName(): string {
    return 'Official ABDM HFR Adapter';
  }
}

export class FacilityApiProvider implements IDataProvider {
  async getFacilities(district: string): Promise<DataProviderFacility[]> {
    return [
      {
        id: 'FAC-API-01',
        name: 'Apollo Super Speciality Hospital',
        type: 'Specialist Centre',
        district: district || 'Ranchi',
        state: 'Jharkhand',
        latitude: 23.349,
        longitude: 85.308,
        provenance: 'FACILITY PROVIDED',
        sourceType: 'FACILITY_API',
        lastUpdated: new Date().toISOString(),
      },
    ];
  }

  getModeName(): string {
    return 'Direct Hospital Operational API';
  }
}

export class DataProviderFactory {
  public static getProvider(): IDataProvider {
    const mode = config.dataMode || AbdmConfig.getMode();
    if (mode === 'sandbox' || mode === 'production') {
      return new ABDMProvider();
    }
    return new DemoDataProvider();
  }
}

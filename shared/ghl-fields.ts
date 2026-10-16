// Single source of truth for the GoHighLevel contact custom fields the estimate flow fills in.
// The Worker looks fields up by `name`; scripts/ghl-setup-fields.ts creates any that are missing.
export const FIELD_PREFIX = 'Pest Control - ';

export type FieldKey =
  | 'pests'
  | 'where'
  | 'duration'
  | 'homeType'
  | 'homeSize'
  | 'recommended'
  | 'chosen'
  | 'followUp'
  | 'callWindow'
  | 'notes'
  | 'leadId'
  | 'landingPage'
  | 'utmSource'
  | 'utmMedium'
  | 'utmCampaign'
  | 'clickId';

export interface FieldDef {
  key: FieldKey;
  /** Label shown in GHL, after the prefix. */
  label: string;
  type: 'TEXT' | 'LARGE_TEXT';
  example: string;
}

export const fieldDefs: FieldDef[] = [
  { key: 'pests', label: 'Pest Types', type: 'TEXT', example: 'Ants, Spiders, Termites' },
  { key: 'where', label: 'Where Seen', type: 'TEXT', example: 'Inside and outside' },
  { key: 'duration', label: 'How Long', type: 'TEXT', example: 'Months or more' },
  { key: 'homeType', label: 'Home Type', type: 'TEXT', example: 'House' },
  { key: 'homeSize', label: 'Home Size', type: 'TEXT', example: '2,500 to 4,000 sq ft' },
  { key: 'recommended', label: 'Service Recommended', type: 'TEXT', example: 'Quarterly Protection Plan' },
  { key: 'chosen', label: 'Service Chosen', type: 'TEXT', example: 'Quarterly Protection Plan' },
  { key: 'followUp', label: 'Follow-Up Preference', type: 'TEXT', example: 'Call me' },
  { key: 'callWindow', label: 'Best Time To Call', type: 'TEXT', example: 'Afternoon' },
  { key: 'notes', label: 'Customer Notes', type: 'LARGE_TEXT', example: 'Gate code is 1234' },
  { key: 'leadId', label: 'Estimate ID', type: 'TEXT', example: '4aa118c4-e9ca-4712-ad0f-38e77f28a4c7' },
  { key: 'landingPage', label: 'Landing Page', type: 'TEXT', example: '/pest-control/pests/ants/' },
  { key: 'utmSource', label: 'UTM Source', type: 'TEXT', example: 'google' },
  { key: 'utmMedium', label: 'UTM Medium', type: 'TEXT', example: 'cpc' },
  { key: 'utmCampaign', label: 'UTM Campaign', type: 'TEXT', example: 'ant-control-myrtle-beach' },
  { key: 'clickId', label: 'Ad Click ID', type: 'TEXT', example: 'gclid or fbclid value' },
];

export const fieldName = (def: FieldDef) => FIELD_PREFIX + def.label;

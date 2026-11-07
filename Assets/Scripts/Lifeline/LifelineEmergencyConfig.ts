/** Region configuration is intentionally separate from first-aid content. */
export interface EmergencyRegionConfig {
  readonly countryCode: string;
  readonly countryName: string;
  readonly emergencyNumber: string;
  readonly emergencyNumberLabel: string;
  readonly emergencyCallInstruction: string;
  readonly callActionInstruction: string;
}

export const INDIA_EMERGENCY_CONFIG: EmergencyRegionConfig = {
  countryCode: "IN",
  countryName: "India",
  emergencyNumber: "112",
  emergencyNumberLabel: "112",
  emergencyCallInstruction: "Call 112 now.",
  callActionInstruction:
    "Use your phone to call 112, or ask someone nearby to call.",
};

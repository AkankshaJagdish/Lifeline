/** Lifeline's typed, UI-independent state and content contracts. */

export type LifelinePath = "bleeding" | "adult_collapse" | "fire_smoke" | "other";
export type ActivationSource = "voice" | "manual" | "preview_simulation";

export type LifelineState =
  | "IDLE"
  | "ACTIVATING"
  | "EMERGENCY_HOME"
  | "CALL_IN_PROGRESS_OR_MANUAL_CALL"
  | "PATH_SELECTION"
  | "BLEEDING_GUIDANCE"
  | "ADULT_COLLAPSE_GUIDANCE"
  | "OTHER_EMERGENCY"
  | "HELP_ARRIVED_OR_SESSION_END"
  | "CANCEL_CONFIRMATION";

export interface GuidanceStep {
  readonly id: string;
  readonly text: string;
  readonly title?: string;
  readonly summary?: string;
}

export interface LifelineSnapshot {
  readonly state: LifelineState;
  readonly path: LifelinePath | null;
  readonly stepIndex: number;
  readonly stepCount: number;
  readonly instruction: string | null;
  /** User acknowledgement only. It is never evidence that a call was placed. */
  readonly userAcknowledgedCall: boolean;
  readonly activationSource: ActivationSource | null;
  readonly confirmationPurpose: "false_alarm" | "end_session" | null;
}

export type LifelineChangeListener = (snapshot: LifelineSnapshot) => void;

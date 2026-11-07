import { getGuidanceSteps } from "./LifelineGuidanceContent";
import {
  ActivationSource,
  GuidanceStep,
  LifelineChangeListener,
  LifelinePath,
  LifelineSnapshot,
  LifelineState,
} from "./LifelineTypes";

/** Pure state machine. It performs no UI, network, phone, or medical sensing work. */
export class LifelineStateMachine {
  private currentState: LifelineState = "IDLE";
  private selectedPath: LifelinePath | null = null;
  private currentStepIndex = 0;
  private callAcknowledgedByUser = false;
  private source: ActivationSource | null = null;
  private confirmation: "false_alarm" | "end_session" | null = null;
  private listeners: LifelineChangeListener[] = [];

  public subscribe(listener: LifelineChangeListener): void {
    this.listeners.push(listener);
    listener(this.snapshot());
  }

  public getSnapshot(): LifelineSnapshot {
    return this.snapshot();
  }

  public activate(source: ActivationSource): void {
    if (this.currentState === "IDLE") this.currentState = "ACTIVATING";
    this.selectedPath = null;
    this.currentStepIndex = 0;
    this.callAcknowledgedByUser = false;
    this.confirmation = null;
    this.source = source;
    this.currentState = "EMERGENCY_HOME";
    this.publish();
  }

  public openCallInstructions(): void {
    if (!this.isActive()) return;
    this.currentState = "CALL_IN_PROGRESS_OR_MANUAL_CALL";
    this.publish();
  }

  /** Records the user's explicit acknowledgement; never represents a platform call result. */
  public acknowledgeCallByUser(): void {
    if (!this.isActive()) return;
    this.callAcknowledgedByUser = true;
    this.currentState = "EMERGENCY_HOME";
    this.publish();
  }

  public continueToPathSelection(): void {
    if (!this.isActive()) return;
    this.currentState = "PATH_SELECTION";
    this.publish();
  }

  public selectPath(path: LifelinePath): void {
    if (!this.isActive()) return;
    this.selectedPath = path;
    this.currentStepIndex = 0;
    this.currentState = this.stateForPath(path);
    this.publish();
  }

  public next(): void {
    if (!this.isGuidanceState()) return;
    const steps = this.currentSteps();
    if (this.currentStepIndex + 1 < steps.length) {
      this.currentStepIndex += 1;
    } else {
      this.currentState = "HELP_ARRIVED_OR_SESSION_END";
    }
    this.publish();
  }

  public back(): void {
    if (this.currentState === "CALL_IN_PROGRESS_OR_MANUAL_CALL") {
      this.currentState = "EMERGENCY_HOME";
    } else if (this.currentState === "PATH_SELECTION") {
      this.currentState = "EMERGENCY_HOME";
    } else if (this.isGuidanceState()) {
      if (this.currentStepIndex > 0) this.currentStepIndex -= 1;
      else this.currentState = "PATH_SELECTION";
    } else if (this.currentState === "OTHER_EMERGENCY") {
      this.currentState = "PATH_SELECTION";
    } else if (this.currentState === "HELP_ARRIVED_OR_SESSION_END") {
      this.currentState = this.selectedPath ? this.stateForPath(this.selectedPath) : "EMERGENCY_HOME";
      if (this.selectedPath) this.currentStepIndex = this.currentSteps().length - 1;
    } else if (this.currentState === "CANCEL_CONFIRMATION") {
      this.currentState = "EMERGENCY_HOME";
      this.confirmation = null;
    }
    this.publish();
  }

  public repeatCurrentInstruction(): string | null {
    const snap = this.snapshot();
    return snap.instruction;
  }

  public requestFalseAlarmConfirmation(): void {
    if (!this.isActive()) return;
    this.confirmation = "false_alarm";
    this.currentState = "CANCEL_CONFIRMATION";
    this.publish();
  }

  public requestEndSessionConfirmation(): void {
    if (!this.isActive()) return;
    this.confirmation = "end_session";
    this.currentState = "CANCEL_CONFIRMATION";
    this.publish();
  }

  public confirmEndSession(): void {
    if (this.currentState !== "CANCEL_CONFIRMATION") return;
    this.resetToIdle();
  }

  public cancelEndSession(): void {
    if (this.currentState !== "CANCEL_CONFIRMATION") return;
    this.confirmation = null;
    this.currentState = "EMERGENCY_HOME";
    this.publish();
  }

  /** Voice/manual activation always returns an active session to the emergency home. */
  private isActive(): boolean {
    return this.currentState !== "IDLE";
  }

  private isGuidanceState(): boolean {
    return this.currentState === "BLEEDING_GUIDANCE" ||
      this.currentState === "ADULT_COLLAPSE_GUIDANCE" ||
      this.currentState === "OTHER_EMERGENCY";
  }

  private stateForPath(path: LifelinePath): LifelineState {
    if (path === "bleeding") return "BLEEDING_GUIDANCE";
    if (path === "adult_collapse") return "ADULT_COLLAPSE_GUIDANCE";
    return "OTHER_EMERGENCY";
  }

  private currentSteps(): readonly GuidanceStep[] {
    return this.selectedPath ? getGuidanceSteps(this.selectedPath) : [];
  }

  private snapshot(): LifelineSnapshot {
    const steps = this.currentSteps();
    const isGuidance = this.isGuidanceState();
    return {
      state: this.currentState,
      path: this.selectedPath,
      stepIndex: this.currentStepIndex,
      stepCount: isGuidance ? steps.length : 0,
      instruction: isGuidance ? (steps[this.currentStepIndex]?.text ?? null) : null,
      userAcknowledgedCall: this.callAcknowledgedByUser,
      activationSource: this.source,
      confirmationPurpose: this.confirmation,
    };
  }

  private resetToIdle(): void {
    this.currentState = "IDLE";
    this.selectedPath = null;
    this.currentStepIndex = 0;
    this.callAcknowledgedByUser = false;
    this.source = null;
    this.confirmation = null;
    this.publish();
  }

  private publish(): void {
    const snapshot = this.snapshot();
    this.listeners.forEach((listener) => listener(snapshot));
  }
}

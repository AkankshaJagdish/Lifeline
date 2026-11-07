import { LifelineStateMachine } from "./LifelineStateMachine";
import { ActivationSource, LifelineChangeListener, LifelinePath, LifelineSnapshot } from "./LifelineTypes";

/** Scene-facing controller API for the UI and input components to call. */
@component
export class LifelineController extends BaseScriptComponent {
  private machine = new LifelineStateMachine();
  private started = false;

  onAwake(): void {
    this.started = true;
  }

  public subscribe(listener: LifelineChangeListener): void {
    this.machine.subscribe(listener);
  }

  public getSnapshot(): LifelineSnapshot {
    return this.machine.getSnapshot();
  }

  /** Shared entry point used by manual pinch, ASR, and Preview simulation. */
  public activateEmergency(source: ActivationSource): void {
    this.machine.activate(source);
  }

  public showCallInstructions(): void { this.machine.openCallInstructions(); }
  public acknowledgeUserCalled112(): void { this.machine.acknowledgeCallByUser(); }
  public continueToPathSelection(): void { this.machine.continueToPathSelection(); }
  public selectPath(path: LifelinePath): void { this.machine.selectPath(path); }
  public next(): void { this.machine.next(); }
  public back(): void { this.machine.back(); }
  public repeatCurrentInstruction(): string | null { return this.machine.repeatCurrentInstruction(); }
  public requestFalseAlarm(): void { this.machine.requestFalseAlarmConfirmation(); }
  public requestEndSession(): void { this.machine.requestEndSessionConfirmation(); }
  public confirmEndSession(): void { this.machine.confirmEndSession(); }
  public cancelEndSession(): void { this.machine.cancelEndSession(); }

  public isReady(): boolean { return this.started; }
}

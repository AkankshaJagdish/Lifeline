import { LifelineController } from "./LifelineController";

/** SPECS ASR phrase matcher; ASR is not a dependable keyword-spotting system. */
@component
export class LifelineVoiceActivationController extends BaseScriptComponent {
  @input
  @hint("Reference the Lifeline root SceneObject containing LifelineController.")
  controllerObject: SceneObject;

  @input
  @hint("Disable if ASR is unavailable or not granted; manual activation remains available.")
  voiceActivationEnabled: boolean = true;

  private asrModule: any = null;
  private controller: LifelineController | null = null;
  private listening = false;
  private activated = false;
  private statusListener: ((status: string) => void) | null = null;

  onAwake(): void {
    if (this.controllerObject) {
      this.controller = this.controllerObject.getComponent(LifelineController.getTypeName()) as LifelineController;
    }
    if (!this.controller) {
      this.voiceActivationEnabled = false;
      print("Lifeline voice activation: controllerObject is not wired to LifelineController; manual activation remains available.");
    }
    this.createEvent("OnStartEvent").bind(() => this.startListening());
    this.createEvent("OnDestroyEvent").bind(() => this.stopListening());
  }

  public onStatusChanged(listener: (status: string) => void): void {
    this.statusListener = listener;
    listener(this.currentStatus());
  }

  public currentStatus(): string {
    if (!this.voiceActivationEnabled) return "Voice activation unavailable; use ACTIVATE.";
    return this.listening ? "Listening for Emergency" : "Voice listening inactive; use ACTIVATE.";
  }

  public startListening(): void {
    if (!this.voiceActivationEnabled || this.listening || this.activated) return;
    try {
      if (!this.asrModule) this.asrModule = require("LensStudio:AsrModule");
      const options = AsrModule.AsrTranscriptionOptions.create();
      options.silenceUntilTerminationMs = 1000;
      options.mode = AsrModule.AsrMode.HighAccuracy;
      options.onTranscriptionUpdateEvent.add((eventArgs: AsrModule.TranscriptionUpdateEvent) => {
        if (eventArgs.isFinal) this.handleFinalTranscript(eventArgs.text);
      });
      options.onTranscriptionErrorEvent.add((errorCode: AsrModule.AsrStatusCode) => {
        this.listening = false;
        this.notifyStatus(this.describeError(errorCode));
      });
      this.asrModule.startTranscribing(options);
      this.listening = true;
      this.notifyStatus(this.currentStatus());
    } catch (_error) {
      this.listening = false;
      this.notifyStatus("Voice activation could not start; use ACTIVATE.");
    }
  }

  public stopListening(): void {
    if (!this.listening || !this.asrModule) return;
    this.listening = false;
    this.asrModule.stopTranscribing().then(() => this.notifyStatus("Voice listening stopped."));
  }

  public resetAndStartListening(): void {
    this.activated = false;
    this.startListening();
  }

  private handleFinalTranscript(transcript: string): void {
    const normalized = transcript.toLowerCase().replace(/[^a-z\s]/g, " ").trim();
    if (!/(^|\s)emergency(\s|$)/.test(normalized) || this.activated) return;
    this.activated = true;
    this.listening = false;
    this.controller?.activateEmergency("voice");
    this.notifyStatus("Emergency phrase recognized; voice listening stopped.");
    this.asrModule.stopTranscribing();
  }

  private describeError(code: AsrModule.AsrStatusCode): string {
    switch (code) {
      case AsrModule.AsrStatusCode.Unauthenticated: return "Voice recognition authorization unavailable; use ACTIVATE.";
      case AsrModule.AsrStatusCode.NoInternet: return "Internet unavailable for voice recognition; use ACTIVATE.";
      case AsrModule.AsrStatusCode.InternalError:
      default: return "Voice recognition unavailable; use ACTIVATE.";
    }
  }

  private notifyStatus(status: string): void { this.statusListener?.(status); }
}

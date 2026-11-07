import { LifelineController } from "./LifelineController";
import { LifelineState } from "./LifelineTypes";

/**
 * Optional SPECS ASR phrase matcher.
 * ASR is transcription, not dependable keyword spotting; manual activation remains available.
 */
@component
export class LifelineVoiceActivationController extends BaseScriptComponent {
  @input
  @hint("Reference the Lifeline root SceneObject containing LifelineController.")
  controllerObject: SceneObject;

  @input
  @hint("Enable only when optional hardware voice activation is intended and permissions are available.")
  voiceActivationEnabled: boolean = true;

  private asrModule: any = null;
  private controller: LifelineController | null = null;
  private listening = false;
  private activated = false;
  private stoppingPromise: Promise<void> | null = null;
  private stopFailed = false;
  private previousState: LifelineState | null = null;
  private statusListener: ((status: string) => void) | null = null;

  onAwake(): void {
    if (this.controllerObject) {
      this.controller = this.controllerObject.getComponent(LifelineController.getTypeName()) as LifelineController;
    }
    if (!this.controller) {
      this.voiceActivationEnabled = false;
      print("Lifeline voice activation: controllerObject is not wired to LifelineController; manual activation remains available.");
    } else {
      this.controller.subscribe((snapshot) => this.handleStateChange(snapshot.state));
    }
    this.createEvent("OnStartEvent").bind(() => { void this.startListening(); });
    this.createEvent("OnDestroyEvent").bind(() => this.stopListening());
  }

  public onStatusChanged(listener: (status: string) => void): void {
    this.statusListener = listener;
    listener(this.currentStatus());
  }

  public currentStatus(): string {
    if (!this.voiceActivationEnabled) return "Voice activation off; use ACTIVATE.";
    return this.listening ? "Listening for Emergency" : "Voice listening inactive; use ACTIVATE.";
  }

  public async startListening(): Promise<void> {
    if (!this.voiceActivationEnabled || this.listening || this.activated || this.stopFailed || !this.controller) return;

    // Do not start a new ASR session until a previous emergency-session stop has completed.
    if (this.stoppingPromise) await this.stoppingPromise;

    if (
      !this.voiceActivationEnabled ||
      this.listening ||
      this.activated ||
      this.stopFailed ||
      !this.controller ||
      this.controller.getSnapshot().state !== "IDLE"
    ) return;

    try {
      if (!this.asrModule) this.asrModule = require("LensStudio:AsrModule");

      const options = AsrModule.AsrTranscriptionOptions.create();
      options.silenceUntilTerminationMs = 1000;
      options.mode = AsrModule.AsrMode.HighAccuracy;

      options.onTranscriptionUpdateEvent.add((eventArgs: AsrModule.TranscriptionUpdateEvent) => {
        // Ignore late callbacks from a stopped session or while an emergency is already active.
        if (
          !this.listening ||
          this.activated ||
          this.controller?.getSnapshot().state !== "IDLE"
        ) return;
        if (eventArgs.isFinal) this.handleFinalTranscript(eventArgs.text);
      });

      options.onTranscriptionErrorEvent.add((errorCode: AsrModule.AsrStatusCode) => {
        if (!this.listening) return;
        this.listening = false;
        this.stopAsrSession();
        this.notifyStatus(this.describeError(errorCode));
      });

      this.asrModule.startTranscribing(options);
      this.listening = true;
      this.notifyStatus(this.currentStatus());
    } catch (_error) {
      this.listening = false;
      this.stopAsrSession();
      this.notifyStatus("Voice activation could not start. Check microphone access or use ACTIVATE.");
    }
  }

  public stopListening(): void {
    if (!this.listening) return;
    this.listening = false;
    this.stopAsrSession();
    this.notifyStatus("Voice listening stopped.");
  }

  private stopAsrSession(): void {
    if (!this.asrModule || this.stoppingPromise) return;

    try {
      const pendingStop = Promise.resolve(this.asrModule.stopTranscribing()).catch((_error) => {
        this.stopFailed = true;
        this.notifyStatus("Voice input could not stop; use ACTIVATE.");
      });
      this.stoppingPromise = pendingStop;
      void pendingStop.then(() => {
        if (this.stoppingPromise === pendingStop) this.stoppingPromise = null;
      });
    } catch (_error) {
      this.stopFailed = true;
      this.stoppingPromise = null;
      this.notifyStatus("Voice input could not stop; use ACTIVATE.");
    }
  }

  private handleStateChange(state: LifelineState): void {
    const wasActive = this.previousState !== null && this.previousState !== "IDLE";
    this.previousState = state;

    if (state === "IDLE") {
      if (wasActive) {
        // A fresh listening session is allowed only after the user explicitly ends the active session.
        this.activated = false;
        void this.startListening();
      }
    } else {
      this.stopListening();
    }
  }

  private handleFinalTranscript(transcript: string): void {
    const normalized = transcript.toLowerCase().replace(/[^a-z\s]/g, " ").trim();
    if (!this.listening || this.activated || this.controller?.getSnapshot().state !== "IDLE") return;
    if (!/(^|\s)emergency(\s|$)/.test(normalized)) return;

    this.activated = true;
    this.listening = false;
    this.stopAsrSession();
    this.controller.activateEmergency("voice");
    this.notifyStatus("Emergency phrase received; voice listening stopped.");
  }

  private describeError(code: AsrModule.AsrStatusCode): string {
    switch (code) {
      case AsrModule.AsrStatusCode.Unauthenticated:
        return "Voice activation is not authorized; use ACTIVATE.";
      case AsrModule.AsrStatusCode.NoInternet:
        return "Voice activation needs internet; use ACTIVATE.";
      case AsrModule.AsrStatusCode.InternalError:
      default:
        return "Voice input unavailable. Check microphone access or Extended Permissions; use ACTIVATE.";
    }
  }

  private notifyStatus(status: string): void {
    this.statusListener?.(status);
  }
}

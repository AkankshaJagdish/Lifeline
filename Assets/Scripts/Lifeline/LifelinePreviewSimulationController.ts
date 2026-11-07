import { LifelineController } from "./LifelineController";

/** Preview-only simulation entry point; it uses the same activation method as voice/manual input. */
@component
export class LifelinePreviewSimulationController extends BaseScriptComponent {
  controllerObject: SceneObject;

  @input
  @hint("Enable only for an explicitly labelled Lens Studio Preview simulation control.")
  previewSimulationEnabled: boolean = false;

  private controller: LifelineController | null = null;

  onAwake(): void {
    this.controllerObject = this.sceneObject;
    this.previewSimulationEnabled = global.deviceInfoSystem.isEditor();
    this.controller = this.sceneObject.getComponent(LifelineController.getTypeName()) as LifelineController;
    if (!this.controller) print("Lifeline Preview simulation: controllerObject is not wired to LifelineController.");
  }

  /** Wire to a visibly labelled SIMULATE VOICE: EMERGENCY test button. */
  public simulateVoiceEmergency(): void {
    if (!this.previewSimulationEnabled) return;
    this.controller?.activateEmergency("preview_simulation");
  }
}

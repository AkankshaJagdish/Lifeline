import { LifelineController } from "./LifelineController";

/** Activation adapter. Attach to the Lifeline root with LifelineController. */
@component
export class LifelineManualActivationController extends BaseScriptComponent {
  @input
  @hint("Reference the Lifeline root SceneObject containing LifelineController.")
  controllerObject: SceneObject;

  private controller: LifelineController | null = null;

  onAwake(): void {
    if (this.controllerObject) {
      this.controller = this.controllerObject.getComponent(LifelineController.getTypeName()) as LifelineController;
    }
    if (!this.controller) print("Lifeline manual activation: controllerObject is not wired to LifelineController.");
  }

  /** Wire this method from the ACTIVATE button onTriggerUp event. */
  public activateManually(): void { this.controller?.activateEmergency("manual"); }
}

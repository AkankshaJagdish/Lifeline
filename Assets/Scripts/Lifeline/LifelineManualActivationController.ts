import { LifelineController } from "./LifelineController";

/** Attach to the UIKit ACTIVATE button object and call activate on its pinch-up event. */
@component
export class LifelineManualActivationController extends BaseScriptComponent {
  controllerObject: SceneObject;

  private controller: LifelineController | null = null;

  onAwake(): void {
    this.controllerObject = this.sceneObject;
    this.controller = this.sceneObject.getComponent(LifelineController.getTypeName()) as LifelineController;
    if (!this.controller) print("Lifeline manual activation: controllerObject is not wired to LifelineController.");
  }

  /** Wire this method from the ACTIVATE Button's onTriggerUp event. */
  public activateManually(): void {
    this.controller?.activateEmergency("manual");
  }
}

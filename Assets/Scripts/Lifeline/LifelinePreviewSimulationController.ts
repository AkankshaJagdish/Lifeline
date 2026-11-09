import { LifelineController } from "./LifelineController";
import { LifelineIncidentScenarios } from "./LifelineIncidentScenarios";

/**
 * Preview-only scenario control. This is separate from the live Lifeline UI.
 * Attach the existing controllerObject and the incidentScenarios reference.
 */
@component
export class LifelinePreviewSimulationController extends BaseScriptComponent {
  @input
  @hint("Reference the Lifeline root SceneObject containing LifelineController.")
  controllerObject: SceneObject;

  @input
  @hint("Enable only for an explicitly labelled Lens Studio Preview simulation control.")
  previewSimulationEnabled: boolean = false;

  @input
  @hint("Reference the LifelineIncidentScenarios component on Lifeline Incident Scenarios.")
  @allowUndefined
  incidentScenarios: LifelineIncidentScenarios;

  private controller: LifelineController | null = null;

  onAwake(): void {
    this.previewSimulationEnabled = global.deviceInfoSystem.isEditor();
    this.createEvent("OnStartEvent").bind(() => {
      if (this.controllerObject) {
        this.controller = this.controllerObject.getComponent(LifelineController.getTypeName()) as LifelineController;
      }
      if (!this.controller) print("Lifeline Preview simulation: controllerObject is not wired to LifelineController.");
      if (!this.incidentScenarios) print("Lifeline Preview simulation: incidentScenarios input is not wired.");
    });
  }

  /** Existing activation demo entry point; unchanged behavior. */
  public simulateVoiceEmergency(): void {
    if (!this.previewSimulationEnabled) return;
    this.controller?.activateEmergency("preview_simulation");
  }

  /** Editor-only scenario controls: wire separately to FOUND PERSON / INJURY / FIRE buttons. */
  public foundPerson(): void {
    if (!this.previewSimulationEnabled) return;
    this.incidentScenarios?.selectPreviewScenario("person");
  }

  public foundInjury(): void {
    if (!this.previewSimulationEnabled) return;
    this.incidentScenarios?.selectPreviewScenario("injury");
  }

  public foundFire(): void {
    if (!this.previewSimulationEnabled) return;
    this.incidentScenarios?.selectPreviewScenario("fire");
  }
}

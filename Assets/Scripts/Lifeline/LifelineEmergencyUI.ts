import { LifelineController } from "./LifelineController";
import { LifelineSnapshot, GuidanceStep, LifelinePath } from "./LifelineTypes";
import { getGuidanceSteps, LIFELINE_SAFETY_STATEMENT } from "./LifelineGuidanceContent";
import { LifelineIncidentScenarios } from "./LifelineIncidentScenarios";
import { LifelineVoiceActivationController } from "./LifelineVoiceActivationController";
import { LifelineManualActivationController } from "./LifelineManualActivationController";
import { LifelinePreviewSimulationController } from "./LifelinePreviewSimulationController";
import { INDIA_EMERGENCY_CONFIG } from "./LifelineEmergencyConfig";
import { Frame } from "SpectaclesUIKit.lspkg/Scripts/Components/Frame/Frame";
import { Button } from "SpectaclesUIKit.lspkg/Scripts/Components/Button/Button";
import { BackPlate } from "SpectaclesUIKit.lspkg/Scripts/BackPlate";
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";
import { FlexLayout } from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexLayout";
import { RoundedRectangleVisual, RoundedRectangleVisualState } from "SpectaclesUIKit.lspkg/Scripts/Visuals/RoundedRectangle/RoundedRectangleVisual";
import { GradientParameters } from "SpectaclesUIKit.lspkg/Scripts/Visuals/RoundedRectangle/RoundedRectangle";
import { StateName } from "SpectaclesUIKit.lspkg/Scripts/Components/Element";
import { FlexItem } from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexItem";
import { FlexAlign, FlexDirection, FlexJustify } from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexTypes";

const FRAME_INNER_WIDTH = 30;
const FRAME_INNER_HEIGHT = 20;
const GUIDANCE_FRAME_WIDTH = 18.5;
const OVERVIEW_WIDTH = 10.5;
const GUIDANCE_PANEL_HEIGHT = 18.5;
const GUIDANCE_LEFT_OFFSET = -15.5;
const GUIDANCE_GROUP_RIGHT_OFFSET = 9.75;
const GUIDANCE_FORWARD_OFFSET = 55;
const GUIDANCE_VERTICAL_OFFSET = -8;
const CONTENT_WIDTH = 28.5;
const CONTENT_HEIGHT = 18.5;
const PANEL_PADDING = 0.75;
const CONTENT_GAP = 0.65;
const PRIMARY_TARGET = 5.6;
const SECONDARY_TARGET = 3.9;
const TARGET_GAP = 0.8;
const VIEW_DISTANCE_CM = 105;
const SOS_WIDTH = 7.0;
const SOS_HEIGHT = 4.4;
const BUTTON_LABEL_Z = 0.08;
const PALETTE = {
  ivory: new vec4(1.0, 0.92, 0.80, 1.0),
  teal: new vec4(0.18, 0.72, 0.68, 1.0),
  coral: new vec4(1.0, 0.30, 0.27, 1.0),
  amber: new vec4(1.0, 0.67, 0.25, 1.0),
  neutral: new vec4(0.82, 0.90, 0.88, 0.9),
};

type TextRole = "Title1" | "Title2" | "HeadlineXL" | "Headline1" | "Headline2" | "Subheadline" | "Button" | "Callout" | "Body" | "Caption";
const TYPE_SCALE: Record<TextRole, {size: number; weight: number}> = {
  Title1: {size: 105, weight: 700},
  Title2: {size: 93, weight: 700},
  HeadlineXL: {size: 62, weight: 700},
  Headline1: {size: 54, weight: 700},
  Headline2: {size: 48, weight: 700},
  Subheadline: {size: 41, weight: 700},
  Button: {size: 39, weight: 500},
  Callout: {size: 39, weight: 700},
  Body: {size: 39, weight: 500},
  Caption: {size: 38, weight: 500},
};

function roleSize(role: TextRole, distanceCm: number = 110): number {
  return TYPE_SCALE[role].size * (VIEW_DISTANCE_CM / 110) * (distanceCm / VIEW_DISTANCE_CM);
}

function applyTextRole(text: Text, role: TextRole): void {
  text.size = roleSize(role);
  (text as Text & {weight?: number}).weight = TYPE_SCALE[role].weight;
}

/** Lifeline's complete visual flow, composed from Spectacles UIKit primitives. */
@component
export class LifelineEmergencyUI extends BaseScriptComponent {
  @input
  @hint("Lifeline Experience root SceneObject containing LifelineController.")
  controllerObject: SceneObject;

  @input
  @hint("Input Adapters child SceneObject containing the manual, Preview simulation and voice components.")
  activationAdaptersObject: SceneObject;

  @input
  @hint("SceneObject holding the existing LifelineIncidentScenarios component. Used only to anchor guidance panels to the user's selected non-human incident marker.")
  incidentScenariosObject: SceneObject;

  private controller: LifelineController | null = null;
  private voiceActivation: LifelineVoiceActivationController | null = null;
  private manualActivation: LifelineManualActivationController | null = null;
  private previewSimulation: LifelinePreviewSimulationController | null = null;
  private incidentScenarios: LifelineIncidentScenarios | null = null;
  private frame: Frame | null = null;
  private contentHost: SceneObject | null = null;
  private pageRoot: SceneObject | null = null;
  private snapshot: LifelineSnapshot | null = null;
  private voiceStatus = "Voice activation unavailable; use ACTIVATE.";
  private repeatMessage: string | null = null;
  private sosObject: SceneObject | null = null;
  private overviewPanelObject: SceneObject | null = null;
  private overviewContentHost: SceneObject | null = null;
  private overviewPageRoot: SceneObject | null = null;
  private guidancePanelsActive = false;
  private defaultRootWorldPosition: vec3 | null = null;
  private defaultRootWorldRotation: quat | null = null;
  private defaultSosLocalPosition: vec3 | null = null;
  private pendingFlexItems = new Map<SceneObject, FlexItem[]>();
  private flexRegistrationCallbacks = new Set<SceneObject>();

  onAwake(): void {
    if (this.controllerObject) {
      this.controller = this.controllerObject.getComponent(LifelineController.getTypeName()) as LifelineController;
    }
    if (!this.controller) {
      print("Lifeline UI: controllerObject is not wired to LifelineController.");
      return;
    }

    if (this.activationAdaptersObject) {
      this.voiceActivation = this.activationAdaptersObject.getComponent(LifelineVoiceActivationController.getTypeName()) as LifelineVoiceActivationController;
      this.manualActivation = this.activationAdaptersObject.getComponent(LifelineManualActivationController.getTypeName()) as LifelineManualActivationController;
      this.previewSimulation = this.activationAdaptersObject.getComponent(LifelinePreviewSimulationController.getTypeName()) as LifelinePreviewSimulationController;
    }
    if (this.incidentScenariosObject) {
      this.incidentScenarios = this.incidentScenariosObject.getComponent(LifelineIncidentScenarios.getTypeName()) as LifelineIncidentScenarios;
    }

    if (!this.manualActivation) print("Lifeline UI: manual activation adapter is not wired.");
    if (!this.previewSimulation) print("Lifeline UI: Preview simulation adapter is not wired.");

    this.sceneObject.createComponent("Component.Canvas");
    this.frame = this.sceneObject.createComponent(Frame.getTypeName()) as Frame;
    this.frame.autoShowHide = false;
    this.frame.autoScaleContent = false;
    this.frame.allowScaling = false;

    // Frame's close/follow button setters access ButtonHandler internals created by initialize().
    // Register first because initialization may complete synchronously.
    this.frame.onInitialized.add(() => {
      const frame = this.frame;
      if (!frame) return;

      frame.showCloseButton = false;
      frame.showFollowButton = false;

      // Preserve the approved 30 x 20 cm Frame baseline; content uses a 0.75 cm inset.
      frame.innerSize = new vec2(FRAME_INNER_WIDTH, FRAME_INNER_HEIGHT);
      frame.padding = new vec2(PANEL_PADDING, PANEL_PADDING);
      frame.setUseFollow(true);
      frame.setFollowing(true);

      const host = global.scene.createSceneObject("Lifeline Content");
      host.setParent(frame.contentTransform.getSceneObject());
      host.getTransform().setLocalPosition(new vec3(0, 0, 0.6));
      this.contentHost = host;
      this.defaultRootWorldPosition = this.sceneObject.getTransform().getWorldPosition();
      this.defaultRootWorldRotation = this.sceneObject.getTransform().getWorldRotation();
      this.sosObject = this.createPersistentSosControl();
      this.defaultSosLocalPosition = this.sosObject.getTransform().getLocalPosition();
      this.createOverviewPanel();
      if (this.snapshot) this.render(this.snapshot);
    });

    // Frame initializes automatically through its own OnStartEvent.
    // The ReplayEvent callback above creates the content host before the first render.

    this.createEvent("OnStartEvent").bind(() => {
      this.controller?.subscribe((snapshot) => {
        this.snapshot = snapshot;
        this.repeatMessage = null;
        this.render(snapshot);
      });
      this.voiceActivation?.onStatusChanged((status) => {
        this.voiceStatus = status;
        if (this.snapshot?.state === "IDLE") this.render(this.snapshot);
      });
      this.incidentScenarios?.onSelectionChanged(() => {
        if (this.guidancePanelsActive && this.snapshot) this.positionGuidancePanels();
      });
    });
  }

  private render(snapshot: LifelineSnapshot): void {
    if (!this.contentHost) return;
    if (this.pageRoot) {
      this.pageRoot.destroy();
      this.pageRoot = null;
    }
    if (this.overviewPageRoot) {
      this.overviewPageRoot.destroy();
      this.overviewPageRoot = null;
    }

    const title = this.guidanceTitle(snapshot.path);
    const hasSelectedIncident = !!this.incidentScenarios?.getSelectedObject();
    const isGuidance = snapshot.state === "BLEEDING_GUIDANCE" ||
      snapshot.state === "ADULT_COLLAPSE_GUIDANCE" ||
      snapshot.state === "OTHER_EMERGENCY";

    if (isGuidance && hasSelectedIncident && this.incidentScenarios?.getMarkerObject()?.enabled) {
      this.enterGuidancePanels();
      this.renderTwoPanelGuidance(title, snapshot);
      return;
    }

    this.leaveGuidancePanels();
    const page = global.scene.createSceneObject("Lifeline Screen");
    page.setParent(this.contentHost);
    this.pageRoot = page;
    const column = this.createFlex(page, FlexDirection.Column, CONTENT_WIDTH, CONTENT_HEIGHT, CONTENT_GAP);
    this.addPersistentSosButton(page, snapshot.state);

    switch (snapshot.state) {
      case "IDLE": this.renderIdle(column); break;
      case "EMERGENCY_HOME": this.renderEmergencyHome(column, snapshot); break;
      case "CALL_IN_PROGRESS_OR_MANUAL_CALL": this.renderCallInstructions(column); break;
      case "PATH_SELECTION": this.renderPathSelection(column, snapshot); break;
      case "BLEEDING_GUIDANCE": this.renderGuidance(column, title, snapshot); break;
      case "ADULT_COLLAPSE_GUIDANCE": this.renderGuidance(column, title, snapshot); break;
      case "OTHER_EMERGENCY": this.renderGuidance(column, title, snapshot); break;
      case "HELP_ARRIVED_OR_SESSION_END": this.renderEndScreen(column); break;
      case "CANCEL_CONFIRMATION": this.renderCancelConfirmation(column, snapshot); break;
      case "ACTIVATING": this.addLabel(column, "Starting Lifeline…", "Headline2", 1.2); break;
    }
  }

  private guidanceTitle(path: LifelinePath | null): string {
    if (path === "bleeding") return "Severe bleeding";
    if (path === "adult_collapse") return "Adult collapse";
    if (path === "fire_smoke") return "Fire / smoke";
    return "Other emergency";
  }

  private enterGuidancePanels(): void {
    if (!this.frame || !this.overviewPanelObject) return;
    if (this.guidancePanelsActive) {
      this.positionGuidancePanels();
      return;
    }
    this.guidancePanelsActive = true;
    this.frame.setFollowing(false);
    this.frame.innerSize = new vec2(GUIDANCE_FRAME_WIDTH, GUIDANCE_PANEL_HEIGHT);
    this.frame.padding = new vec2(PANEL_PADDING, PANEL_PADDING);
    this.overviewPanelObject.getTransform().setLocalScale(new vec3(1, 1, 1));
    this.positionGuidancePanels();
    // Keep the existing SOS object and callback. It moves with the shared
    // instruction-panel root instead of creating a second emergency control.
    if (this.sosObject) {
      this.sosObject.getTransform().setLocalPosition(new vec3(4.95, 6.3, 0.8));
    }
  }

  private leaveGuidancePanels(): void {
    if (!this.guidancePanelsActive) {
      if (this.overviewPanelObject) this.overviewPanelObject.getTransform().setLocalScale(new vec3(0, 0, 1));
      return;
    }
    this.guidancePanelsActive = false;
    if (this.overviewPanelObject) this.overviewPanelObject.getTransform().setLocalScale(new vec3(0, 0, 1));
    if (this.frame) {
      this.frame.innerSize = new vec2(FRAME_INNER_WIDTH, FRAME_INNER_HEIGHT);
      this.frame.padding = new vec2(PANEL_PADDING, PANEL_PADDING);
      this.frame.setFollowing(true);
    }
    const transform = this.sceneObject.getTransform();
    if (this.defaultRootWorldPosition) transform.setWorldPosition(this.defaultRootWorldPosition);
    if (this.defaultRootWorldRotation) transform.setWorldRotation(this.defaultRootWorldRotation);
    if (this.sosObject && this.defaultSosLocalPosition) {
      this.sosObject.getTransform().setLocalPosition(this.defaultSosLocalPosition);
    }
  }

  private positionGuidancePanels(): void {
    if (!this.guidancePanelsActive || !this.incidentScenarios) return;
    const marker = this.incidentScenarios.getMarkerObject();
    if (!marker || !marker.enabled) return;
    const markerPosition = marker.getTransform().getWorldPosition();
    const cameraTransform = WorldCameraFinderProvider.getInstance().getComponent().getTransform();
    const groupPosition = markerPosition
      .subtract(cameraTransform.forward.uniformScale(GUIDANCE_FORWARD_OFFSET))
      .add(cameraTransform.right.uniformScale(GUIDANCE_GROUP_RIGHT_OFFSET))
      .add(cameraTransform.up.uniformScale(GUIDANCE_VERTICAL_OFFSET));
    const rootTransform = this.sceneObject.getTransform();
    rootTransform.setWorldPosition(groupPosition);
    rootTransform.setWorldRotation(cameraTransform.getWorldRotation());
  }

  private createOverviewPanel(): void {
    if (this.overviewPanelObject || !this.contentHost) return;
    const panel = global.scene.createSceneObject("Lifeline Response Plan Panel");
    panel.setParent(this.sceneObject);
    panel.getTransform().setLocalPosition(new vec3(GUIDANCE_LEFT_OFFSET, 0, 0.2));
    const plate = panel.createComponent(BackPlate.getTypeName()) as BackPlate;
    plate.size = new vec2(OVERVIEW_WIDTH, GUIDANCE_PANEL_HEIGHT);
    plate.style = "simple";
    this.overviewPanelObject = panel;
    this.overviewContentHost = global.scene.createSceneObject("Lifeline Response Plan Content");
    this.overviewContentHost.setParent(panel);
    this.overviewContentHost.getTransform().setLocalPosition(new vec3(0, 0, 0.6));
    // Keep the host enabled so BackPlate receives its normal lifecycle events;
    // a zero visual scale hides it until the two-panel workspace is requested.
    panel.getTransform().setLocalScale(new vec3(0, 0, 1));
  }

  private renderTwoPanelGuidance(title: string, snapshot: LifelineSnapshot): void {
    if (!this.contentHost || !this.overviewContentHost || !snapshot.path) return;
    const steps = getGuidanceSteps(snapshot.path);
    const currentIndex = Math.max(0, Math.min(snapshot.stepIndex, Math.max(0, steps.length - 1)));
    const currentStep = steps[currentIndex];
    if (!currentStep) return;

    const overviewPage = global.scene.createSceneObject("Lifeline Response Plan Screen");
    overviewPage.setParent(this.overviewContentHost);
    this.overviewPageRoot = overviewPage;
    const overviewColumn = this.createFlex(overviewPage, FlexDirection.Column, 9.0, 17.0, 0.05);
    const overviewHeader = this.createFlex(overviewColumn, FlexDirection.Row, 9.0, 4.0, 0.3);
    this.addLabel(overviewHeader, "RESPONSE\nPLAN", "Caption", 4.0, "left", 3.5);
    this.addButton(overviewHeader, "BACK", 5.2, 4.0, () => this.controller?.back(), "neutral");
    for (let index = 0; index < steps.length; index++) {
      const step = steps[index];
      const status = index < currentIndex ? "✓" : index === currentIndex ? "●" : "○";
      const stepTitle = this.getStepTitle(step);
      const summary = this.getStepSummary(step);
      const tone = index < currentIndex ? PALETTE.teal : index === currentIndex ? PALETTE.amber : PALETTE.neutral;
      const label = status + " " + (index + 1) + ". " + stepTitle + " — " + summary;
      this.addLabel(overviewColumn, label, "Caption", 1.55, "left", 9.0, tone);
    }

    const rightPage = global.scene.createSceneObject("Lifeline DO NOW Screen");
    rightPage.setParent(this.contentHost);
    this.pageRoot = rightPage;
    const rightColumn = this.createFlex(rightPage, FlexDirection.Column, 17.0, 17.0, 0.12);
    this.addLabel(rightColumn, "DO NOW\nSTEP " + (currentIndex + 1) + "/" + steps.length, "Headline2", 4.4, "left", 8.0);
    this.addLabel(rightColumn, this.getStepTitle(currentStep), "Headline1", 1.4, "left", 17.0);
    this.addLabel(rightColumn, this.repeatMessage ? "REPEATED — " + currentStep.text : currentStep.text, "Body", 3.6, "left", 17.0);
    const support = snapshot.path === "fire_smoke"
      ? "Outside and safe: call 112 (ERSS) or 101 (Fire Services)."
      : "Lifeline provides guidance only. Follow the emergency operator's instructions.";
    this.addLabel(rightColumn, support, "Caption", 1.2, "left", 17.0);

    const actions = this.createFlex(rightColumn, FlexDirection.Row, 17.0, 5.6, 0.35);
    this.addButton(actions, "REPEAT", 5.0, 5.6, () => this.repeatCurrentInstruction(), "neutral");
    const canAdvance = currentIndex + 1 < steps.length;
    if (canAdvance) {
      this.addButton(actions, "NEXT STEP", 6.0, 5.6, () => this.controller?.next(), "primary");
    }
    this.addButton(actions, "END SESSION", 5.3, 5.6, () => this.controller?.requestEndSession(), "neutral");
  }

  private getStepTitle(step: GuidanceStep): string {
    if (step.title) return step.title;
    const titles: Record<string, string> = {
      scene_safety: "Stay safe",
      get_help: "Get help",
      barrier: "Barrier",
      direct_pressure: "Press firmly",
      maintain_pressure: "Keep pressure",
      blood_through: "Add material",
      embedded_object: "Work around object",
      secure_dressing: "Secure dressing",
      adult_only: "Adult only",
      responsiveness: "Check response",
      breathing: "Check normal breathing",
      compressions: "Compressions",
      cadence: "Pace",
      recoil: "Full recoil",
      operator: "Follow operator",
      other_1: "Call 112",
      other_2: "Follow operator",
    };
    return titles[step.id] || step.id.replace(/_/g, " ");
  }

  private getStepSummary(step: GuidanceStep): string {
    if (step.summary) return step.summary;
    const text = step.text;
    return text.length > 24 ? text.substring(0, 21) + "…" : text;
  }

  private renderIdle(parent: SceneObject): void {
    this.addLabel(parent, "Lifeline", "Title2", 3.2, "center");
    this.addLabel(parent, "Emergency guidance, when every second matters.", "Subheadline", 2.6, "center");
    const status = this.voiceActivation ? this.voiceStatus : "Voice activation inactive — manual SOS is available.";
    this.addLabel(parent, status, "Caption", 1.4, "center");
    if (global.deviceInfoSystem.isEditor()) {
      this.addButton(parent, "SIMULATION — trigger voice: EMERGENCY", 24.0, SECONDARY_TARGET, () => this.previewSimulation?.simulateVoiceEmergency(), "neutral");
    }
  }

  private renderEmergencyHome(parent: SceneObject, snapshot: LifelineSnapshot): void {
    this.addLabel(parent, "Emergency help", "Headline1", 2.2);
    this.addLabel(parent, "112", "Title1", 3.0, "center");
    this.addLabel(parent, "Call emergency services now.", "Subheadline", 1.8, "center");
    this.addLabel(parent, "If you cannot call, ask someone nearby to call 112.", "Body", 1.8, "center");
    if (snapshot.userAcknowledgedCall) {
      this.addLabel(parent, "Your confirmation is recorded. Lifeline has not verified the call.", "Caption", 1.8, "center");
    }
    this.addButton(parent, "CALL INSTRUCTIONS", 18.0, SECONDARY_TARGET, () => this.controller?.showCallInstructions(), "critical");
    this.addButton(parent, "CONTINUE", 18.0, SECONDARY_TARGET, () => this.controller?.continueToPathSelection(), "primary");
  }

  private renderPathSelection(parent: SceneObject, snapshot: LifelineSnapshot): void {
    this.addLabel(parent, "WHAT IS HAPPENING?", "HeadlineXL", 2.4, "center");
    this.addLabel(parent, "Choose one option", "Caption", 1.2, "center");

    const grid = this.createFlex(parent, FlexDirection.Column, CONTENT_WIDTH, 11.8, 0.45);
    this.registerLayoutItem(grid, parent, CONTENT_WIDTH, 11.8);
    const rowOne = this.createFlex(grid, FlexDirection.Row, CONTENT_WIDTH, 5.6, 0.5);
    const rowTwo = this.createFlex(grid, FlexDirection.Row, CONTENT_WIDTH, 5.6, 0.5);
    this.registerLayoutItem(rowOne, grid, CONTENT_WIDTH, 5.6);
    this.registerLayoutItem(rowTwo, grid, CONTENT_WIDTH, 5.6);
    const cardWidth = (CONTENT_WIDTH - 0.5) / 2;
    this.addCategoryCard(rowOne, "PERSON COLLAPSED", "Adult casualty", "●", cardWidth, 5.6, () => this.selectCategory("person"));
    this.addCategoryCard(rowOne, "BLEEDING INJURY", "Visible injury", "✚", cardWidth, 5.6, () => this.selectCategory("bleeding"));
    this.addCategoryCard(rowTwo, "FIRE / SMOKE", "Hazard nearby", "▲", cardWidth, 5.6, () => this.selectCategory("fire"));
    this.addCategoryCard(rowTwo, "OTHER EMERGENCY", "Not sure / other", "?", cardWidth, 5.6, () => this.selectCategory("other"));
    this.addButton(parent, "SKIP — CONTINUE TO 112", 20.0, SECONDARY_TARGET, () => this.controller?.showCallInstructions(), "critical");
  }

  private selectCategory(category: string): void {
    if (category === "person") {
      this.controller?.selectPath("adult_collapse");
      return;
    }
    if (category === "bleeding") {
      this.controller?.selectPath("bleeding");
      return;
    }
    if (category === "fire") {
      this.controller?.selectPath("fire_smoke");
      return;
    }
    this.controller?.selectPath("other");
  }


  private registerLayoutItem(child: SceneObject, parent: SceneObject, width: number, height: number): void {
    const item = child.createComponent(FlexItem.getTypeName()) as FlexItem;
    item.overrideWidth = width;
    item.overrideHeight = height;
    item.flexGrow = 0;
    item.flexShrink = 0;
    this.registerFlexItemAfterInitialization(parent, item);
  }

  private addCategoryCard(parent: SceneObject, title: string, subtitle: string, glyph: string,
      width: number, height: number, action: () => void): void {
    const host = global.scene.createSceneObject("Lifeline Category Card " + title);
    host.setParent(parent);
    const button = host.createComponent(Button.getTypeName()) as Button;
    button.size = new vec3(width, height, 1);
    button.opacity = 1.0;
    this.applyButtonTone(button, title === "FIRE / SMOKE" ? "caution" : "category");
    button.onTriggerUp.add(action);

    const glyphObject = global.scene.createSceneObject("Category Glyph " + glyph);
    glyphObject.setParent(host);
    glyphObject.getTransform().setLocalPosition(new vec3(0, 1.65, BUTTON_LABEL_Z));
    const glyphText = glyphObject.createComponent("Component.Text") as Text;
    glyphText.text = glyph;
    glyphText.depthTest = true;
    applyTextRole(glyphText, "Headline1");
    glyphText.textFill.color = title === "FIRE / SMOKE" ? PALETTE.amber : PALETTE.ivory;
    glyphText.horizontalAlignment = HorizontalAlignment.Center;
    glyphText.verticalAlignment = VerticalAlignment.Center;
    glyphText.layoutRect = Rect.create(-3.0, 3.0, -1.2, 1.2);

    this.addButtonLabel(host, title, width - 0.6, "Button", new vec3(0, -0.5, BUTTON_LABEL_Z));
    this.addButtonLabel(host, subtitle, width - 0.6, "Caption", new vec3(0, -2.3, BUTTON_LABEL_Z));

    const item = host.createComponent(FlexItem.getTypeName()) as FlexItem;
    item.overrideWidth = width;
    item.overrideHeight = height;
    item.flexGrow = 0;
    item.flexShrink = 0;
    this.registerFlexItemAfterInitialization(parent, item);
  }

  private createPersistentSosControl(): SceneObject {
    const sos = global.scene.createSceneObject("Lifeline Persistent SOS Control");
    this.sosObject = sos;
    sos.setParent(this.contentHost || this.sceneObject);
    // Upper-right inset in normal mode; repositioned into the reserved right-panel header band during guidance.
    sos.getTransform().setLocalPosition(new vec3(9.8, 6.8, 0.8));
    const button = sos.createComponent(Button.getTypeName()) as Button;
    button.size = new vec3(SOS_WIDTH, SOS_HEIGHT, 1);
    button.opacity = 1.0;
    this.applyButtonTone(button, "critical");
    button.onTriggerUp.add(() => this.manualActivation?.activateManually());
    const labelObject = global.scene.createSceneObject("Lifeline SOS Label");
    labelObject.setParent(sos);
    labelObject.getTransform().setLocalPosition(new vec3(0, 0, BUTTON_LABEL_Z));
    const label = labelObject.createComponent("Component.Text") as Text;
    label.text = "SOS 112";
    label.depthTest = true;
    applyTextRole(label, "Button");
    label.textFill.color = PALETTE.ivory;
    label.horizontalAlignment = HorizontalAlignment.Center;
    label.verticalAlignment = VerticalAlignment.Center;
    label.layoutRect = Rect.create(-4.0, 4.0, -1.2, 1.2);
    return sos;
  }

  private addPersistentSosButton(page: SceneObject, state: string): void {
    // The separate SOS scene object is persistent across page rebuilds.
    // Keep an equivalent contextual 112 route in content as well; this top-right
    // action is a manual activation control, not a phone-call claim.
    if (!this.sosObject) return;
    this.sosObject.enabled = true;
  }

  private renderGuidance(parent: SceneObject, title: string, snapshot: LifelineSnapshot): void {
    this.addLabel(parent, title, "Headline1", 3.0);
    this.addButton(parent, "BACK", 12.0, SECONDARY_TARGET, () => this.controller?.back(), "neutral");
    this.addButton(parent, "CALL 112", 12.0, SECONDARY_TARGET, () => this.controller?.showCallInstructions(), "critical");

    this.addLabel(parent, "Step " + (snapshot.stepIndex + 1) + " of " + snapshot.stepCount, "Callout", 1.8);
    const instruction = this.repeatMessage
      ? "REPEATED — " + this.repeatMessage
      : (snapshot.instruction ?? "Follow the emergency operator’s instructions.");
    this.addLabel(parent, instruction, "Body", 5.0);

    const actions = this.createFlex(parent, FlexDirection.Column, CONTENT_WIDTH, 11.0, TARGET_GAP);
    const hasNext = snapshot.stepIndex + 1 < snapshot.stepCount;
    if (hasNext) {
      this.addButton(actions, "NEXT STEP", CONTENT_WIDTH, PRIMARY_TARGET, () => this.controller?.next(), "primary");
    } else {
      this.addLabel(actions, "Final guided step", "Callout", SECONDARY_TARGET, "center");
    }
    const secondary = this.createFlex(actions, FlexDirection.Row, CONTENT_WIDTH, SECONDARY_TARGET, TARGET_GAP);
    const half = (CONTENT_WIDTH - TARGET_GAP) / 2;
    this.addButton(secondary, "REPEAT", half, SECONDARY_TARGET, () => this.repeatCurrentInstruction(), "neutral");
    this.addButton(secondary, "END SESSION", half, SECONDARY_TARGET, () => this.controller?.requestEndSession(), "neutral");
  }

  private renderEndScreen(parent: SceneObject): void {
    const header = this.createRow(parent, CONTENT_WIDTH, SECONDARY_TARGET, TARGET_GAP);
    this.addLabel(header, "Stay with the person", "Headline2", SECONDARY_TARGET, "left", 14.6);
    this.addButton(header, "BACK", SECONDARY_TARGET, SECONDARY_TARGET, () => this.controller?.back(), "neutral");
    this.addButton(header, "CALL 112", 6.0, SECONDARY_TARGET, () => this.controller?.showCallInstructions(), "critical");
    this.addLabel(parent, "Follow the emergency operator’s instructions.", "Body", 2.0);
    this.addButton(parent, "END SESSION", CONTENT_WIDTH, PRIMARY_TARGET, () => this.controller?.requestEndSession(), "primary");
  }

  private renderCancelConfirmation(parent: SceneObject, snapshot: LifelineSnapshot): void {
    const header = this.createRow(parent, CONTENT_WIDTH, SECONDARY_TARGET, TARGET_GAP);
    const title = snapshot.confirmationPurpose === "false_alarm" ? "End this session?" : "End guidance?";
    this.addLabel(header, title, "Headline2", SECONDARY_TARGET, "left", CONTENT_WIDTH - 8.0);
    this.addButton(header, "CALL 112", 6.0, SECONDARY_TARGET, () => this.controller?.showCallInstructions(), "critical");
    this.addLabel(parent, "Confirm only if you intend to return to the start.", "Body", 2.0);
    const actions = this.createButtonStack(parent, CONTENT_WIDTH, PRIMARY_TARGET + TARGET_GAP + SECONDARY_TARGET, TARGET_GAP);
    this.addButton(actions, "YES, END SESSION", CONTENT_WIDTH, PRIMARY_TARGET, () => this.controller?.confirmEndSession(), "primary");
    this.addButton(actions, "CANCEL / KEEP GUIDANCE", CONTENT_WIDTH, SECONDARY_TARGET, () => this.controller?.cancelEndSession(), "neutral");
  }

  private repeatCurrentInstruction(): void {
    const repeated = this.controller?.repeatCurrentInstruction();
    if (!repeated || !this.snapshot) return;
    this.repeatMessage = repeated;
    this.render(this.snapshot);
  }

  private createFlex(parent: SceneObject, direction: FlexDirection, width: number, height: number, gap: number): SceneObject {
    const container = global.scene.createSceneObject("Lifeline Layout");
    container.setParent(parent);
    const flex = container.createComponent(FlexLayout.getTypeName()) as FlexLayout;
    // Use explicit registration consistently; automatic start discovery is disabled before children exist.
    flex.autoDiscoverItemsOnStart = false;
    flex.onInitialized.add(() => {
      flex.width = width;
      flex.height = height;
      flex.direction = direction;
      flex.alignItems = direction === FlexDirection.Row ? FlexAlign.Center : FlexAlign.Stretch;
      flex.justifyContent = FlexJustify.Start;
      if (direction === FlexDirection.Row) flex.columnGap = gap;
      else flex.rowGap = gap;
      flex.paddingTop = 0;
      flex.paddingBottom = 0;
      flex.paddingLeft = 0;
      flex.paddingRight = 0;
    });
    return container;
  }

  private createButtonStack(parent: SceneObject, width: number, height: number, gap: number): SceneObject {
    const stack = this.createFlex(parent, FlexDirection.Column, width, height, gap);
    const item = stack.createComponent(FlexItem.getTypeName()) as FlexItem;
    item.overrideWidth = width;
    item.overrideHeight = height;
    item.flexGrow = 0;
    item.flexShrink = 0;
    this.registerFlexItemAfterInitialization(parent, item);
    return stack;
  }

  private createRow(parent: SceneObject, width: number, height: number, gap: number): SceneObject {
    const row = this.createFlex(parent, FlexDirection.Row, width, height, gap);
    const item = row.createComponent(FlexItem.getTypeName()) as FlexItem;
    item.overrideWidth = width;
    item.overrideHeight = height;
    item.flexGrow = 0;
    item.flexShrink = 0;
    this.registerFlexItemAfterInitialization(parent, item);
    return row;
  }

  private addLabel(parent: SceneObject, value: string, role: TextRole, height: number,
      alignment: "left" | "center" = "left", width: number = CONTENT_WIDTH,
      textColor: vec4 = PALETTE.ivory): void {
    // Give raw Text its own FlexLayout host and an explicit allocated size.
    const host = global.scene.createSceneObject("Lifeline Label Host");
    host.setParent(parent);
    const hostFlex = host.createComponent(FlexLayout.getTypeName()) as FlexLayout;
    hostFlex.autoDiscoverItemsOnStart = false;
    hostFlex.onInitialized.add(() => {
      hostFlex.width = width;
      hostFlex.height = height;
      hostFlex.direction = FlexDirection.Column;
      hostFlex.alignItems = FlexAlign.Stretch;
      hostFlex.justifyContent = FlexJustify.Center;
      hostFlex.rowGap = 0;
      hostFlex.paddingTop = 0;
      hostFlex.paddingBottom = 0;
      hostFlex.paddingLeft = 0;
      hostFlex.paddingRight = 0;
    });

    const contentObject = global.scene.createSceneObject("Lifeline Label Content");
    contentObject.setParent(host);
    const text = contentObject.createComponent("Component.Text") as Text;
    text.text = value;
    text.depthTest = true;
    applyTextRole(text, role);
    text.textFill.color = textColor;
    text.horizontalAlignment = alignment === "center" ? HorizontalAlignment.Center : HorizontalAlignment.Left;
    text.verticalAlignment = VerticalAlignment.Center;
    text.horizontalOverflow = alignment === "left" && (role === "Body" || role === "Caption")
      ? HorizontalOverflow.Wrap
      : HorizontalOverflow.Overflow;
    text.verticalOverflow = VerticalOverflow.Overflow;
    text.layoutRect = Rect.create(-width / 2, width / 2, -height / 2, height / 2);
    const contentItem = contentObject.createComponent(FlexItem.getTypeName()) as FlexItem;
    contentItem.overrideWidth = width;
    contentItem.overrideHeight = height;
    contentItem.flexGrow = 0;
    contentItem.flexShrink = 0;
    this.registerFlexItemAfterInitialization(host, contentItem);

    const item = host.createComponent(FlexItem.getTypeName()) as FlexItem;
    item.overrideWidth = width;
    item.overrideHeight = height;
    item.flexGrow = 0;
    item.flexShrink = 0;
    this.registerFlexItemAfterInitialization(parent, item);
  }

  /**
   * Register a child FlexItem only after its parent FlexLayout has initialized.
   * Each parent layout uses autoDiscoverItemsOnStart = false and owns its
   * pending item list, so each item is explicitly registered exactly once.
   */
  private registerFlexItemAfterInitialization(parent: SceneObject, item: FlexItem): void {
    const parentFlex = parent.getComponent(FlexLayout.getTypeName()) as FlexLayout | null;
    if (!parentFlex) return;

    let pendingItems = this.pendingFlexItems.get(parent);
    if (!pendingItems) {
      pendingItems = [];
      this.pendingFlexItems.set(parent, pendingItems);
    }

    // The layout is configured for explicit registration. Queue each item once;
    // one ReplayEvent callback flushes the complete batch after parent initialization.
    if (pendingItems.indexOf(item) < 0) pendingItems.push(item);
    if (this.flexRegistrationCallbacks.has(parent)) return;
    this.flexRegistrationCallbacks.add(parent);
    parentFlex.onInitialized.add(() => {
      const items = this.pendingFlexItems.get(parent);
      if (items && items.length > 0) parentFlex.addItems(items);
      this.pendingFlexItems.delete(parent);
      this.flexRegistrationCallbacks.delete(parent);
    });
  }

  private makeGradient(color: vec4): GradientParameters {
    const highlight = new vec4(
      Math.min(1, color.x + 0.12),
      Math.min(1, color.y + 0.12),
      Math.min(1, color.z + 0.12),
      color.w
    );
    return {
      enabled: true,
      type: "Linear",
      start: new vec2(0, 1),
      end: new vec2(0, -1),
      stop0: {enabled: true, percent: 0, color: highlight},
      stop1: {enabled: true, percent: 0.35, color},
      stop2: {enabled: true, percent: 0.7, color},
      stop3: {enabled: true, percent: 1, color: new vec4(color.x * 0.84, color.y * 0.84, color.z * 0.84, color.w)},
    };
  }

  private applyButtonTone(button: Button, tone: "primary" | "critical" | "neutral" | "category" | "caution"): void {
    const color = tone === "critical"
      ? PALETTE.coral
      : tone === "caution"
        ? PALETTE.amber
        : tone === "primary" || tone === "category"
          ? PALETTE.teal
          : PALETTE.neutral;
    const defaultGradient = this.makeGradient(color);
    const hoverGradient = this.makeGradient(new vec4(
      Math.min(1, color.x + 0.1),
      Math.min(1, color.y + 0.1),
      Math.min(1, color.z + 0.1),
      color.w
    ));
    const border = new vec4(PALETTE.ivory.x, PALETTE.ivory.y, PALETTE.ivory.z, 0.72);
    const borderHover = new vec4(1, 1, 1, 0.96);
    const style: Partial<Record<StateName, RoundedRectangleVisualState>> = {
      default: {hasBorder: true, borderSize: 0.08, borderType: "Color", borderColor: border, baseGradient: defaultGradient},
      hovered: {hasBorder: true, borderSize: 0.1, borderType: "Color", borderColor: borderHover, baseGradient: hoverGradient},
      triggered: {hasBorder: true, borderSize: 0.1, borderType: "Color", borderColor: border, baseGradient: defaultGradient},
    };
    const visual = new RoundedRectangleVisual({sceneObject: button.sceneObject, style});
    button.visual = visual;
    button.initialize();
  }

  private addButton(parent: SceneObject, label: string, width: number, height: number, action: () => void, tone: "primary" | "critical" | "neutral"): void {
    const obj = global.scene.createSceneObject("Lifeline Button " + label.replace(/[^A-Z0-9]+/g, "_"));
    obj.setParent(parent);
    const button = obj.createComponent(Button.getTypeName()) as Button;
    button.size = new vec3(width, height, 1);
    button.opacity = tone === "critical" ? 1.0 : tone === "primary" ? 0.98 : 0.88;
    this.applyButtonTone(button, tone);
    button.onTriggerUp.add(action);
    this.addButtonLabel(obj, label, width - 0.5, "Button");
    const item = obj.createComponent(FlexItem.getTypeName()) as FlexItem;
    item.overrideWidth = width;
    item.overrideHeight = height;
    item.flexGrow = 0;
    item.flexShrink = 0;
    this.registerFlexItemAfterInitialization(parent, item);
  }

  private addButtonLabel(parent: SceneObject, label: string, width: number,
      role: TextRole = "Button", position: vec3 = new vec3(0, 0, BUTTON_LABEL_Z)): void {
    const labelObject = global.scene.createSceneObject("Lifeline Button Label");
    labelObject.setParent(parent);
    labelObject.getTransform().setLocalPosition(position);
    const text = labelObject.createComponent("Component.Text") as Text;
    text.text = label;
    text.depthTest = true;
    applyTextRole(text, role);
    text.textFill.color = PALETTE.ivory;
    text.horizontalAlignment = HorizontalAlignment.Center;
    text.verticalAlignment = VerticalAlignment.Center;
    text.horizontalOverflow = HorizontalOverflow.Overflow;
    text.verticalOverflow = VerticalOverflow.Overflow;
    text.layoutRect = Rect.create(-width / 2, width / 2, -1.2, 1.2);
  }
}

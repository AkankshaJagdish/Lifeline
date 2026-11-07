import { LifelineController } from "./LifelineController";
import { LifelineSnapshot } from "./LifelineTypes";
import { LifelineVoiceActivationController } from "./LifelineVoiceActivationController";
import { LifelineManualActivationController } from "./LifelineManualActivationController";
import { LifelinePreviewSimulationController } from "./LifelinePreviewSimulationController";
import { INDIA_EMERGENCY_CONFIG } from "./LifelineEmergencyConfig";
import { LIFELINE_SAFETY_STATEMENT } from "./LifelineGuidanceContent";
import { Frame } from "SpectaclesUIKit.lspkg/Scripts/Components/Frame/Frame";
import { Button } from "SpectaclesUIKit.lspkg/Scripts/Components/Button/Button";
import { ElementContent } from "SpectaclesUIKit.lspkg/Scripts/Components/Content/ElementContent";
import { FlexLayout } from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexLayout";
import { FlexItem } from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexItem";
import { FlexAlign, FlexDirection, FlexJustify } from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexTypes";

const FRAME_INNER_WIDTH = 28.5;
const FRAME_INNER_HEIGHT = 18.5;
const CONTENT_WIDTH = 28.5;
const CONTENT_HEIGHT = 18.5;
const PANEL_PADDING = 0.75;
const GAP = 0.2;
const TARGET_SIZE = 5.6;

type TextRole = "Headline2" | "Title2" | "Subheadline" | "Button" | "Body" | "Caption";
const TYPE_SCALE: Record<TextRole, number> = {
  Headline2: 48,
  Title2: 93,
  Subheadline: 41,
  Button: 39,
  Body: 39,
  Caption: 38,
};

function roleSize(role: TextRole): number {
  return TYPE_SCALE[role];
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

  private controller: LifelineController | null = null;
  private voiceActivation: LifelineVoiceActivationController | null = null;
  private manualActivation: LifelineManualActivationController | null = null;
  private previewSimulation: LifelinePreviewSimulationController | null = null;
  private frame: Frame | null = null;
  private contentHost: SceneObject | null = null;
  private pageRoot: SceneObject | null = null;
  private snapshot: LifelineSnapshot | null = null;
  private voiceStatus = "Voice activation unavailable; use ACTIVATE.";
  private repeatMessage: string | null = null;

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

    if (!this.manualActivation) print("Lifeline UI: manual activation adapter is not wired.");
    if (!this.previewSimulation) print("Lifeline UI: Preview simulation adapter is not wired.");

    this.sceneObject.createComponent("Component.Canvas");
    this.frame = this.sceneObject.createComponent(Frame.getTypeName()) as Frame;
    this.frame.autoShowHide = false;
    this.frame.autoScaleContent = false;
    this.frame.allowScaling = false;
    this.frame.showCloseButton = false;
    this.frame.showFollowButton = false;

    this.frame.onInitialized.add(() => {
      const frame = this.frame;
      if (!frame) return;

      // A 28x18 cm inner surface plus 1 cm padding stays within the 30x20 cm brief.
      frame.innerSize = new vec2(FRAME_INNER_WIDTH, FRAME_INNER_HEIGHT);
      frame.padding = new vec2(PANEL_PADDING, PANEL_PADDING);
      frame.setUseFollow(true);
      frame.setFollowing(true);

      const host = global.scene.createSceneObject("Lifeline Content");
      host.setParent(frame.contentTransform.getSceneObject());
      host.getTransform().setLocalPosition(new vec3(0, 0, 0.6));
      this.contentHost = host;
      if (this.snapshot) this.render(this.snapshot);
    });

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
    });
  }

  private render(snapshot: LifelineSnapshot): void {
    if (!this.contentHost) return;
    if (this.pageRoot) this.pageRoot.destroy();

    const page = global.scene.createSceneObject("Lifeline Screen");
    page.setParent(this.contentHost);
    this.pageRoot = page;
    const column = this.createFlex(page, FlexDirection.Column, CONTENT_WIDTH, CONTENT_HEIGHT, GAP);

    switch (snapshot.state) {
      case "IDLE": this.renderIdle(column); break;
      case "EMERGENCY_HOME": this.renderEmergencyHome(column); break;
      case "CALL_IN_PROGRESS_OR_MANUAL_CALL": this.renderCallInstructions(column, snapshot); break;
      case "PATH_SELECTION": this.renderPathSelection(column); break;
      case "BLEEDING_GUIDANCE": this.renderGuidance(column, "Severe bleeding", snapshot); break;
      case "ADULT_COLLAPSE_GUIDANCE": this.renderGuidance(column, "Adult collapse", snapshot); break;
      case "OTHER_EMERGENCY": this.renderOtherEmergency(column, snapshot); break;
      case "HELP_ARRIVED_OR_SESSION_END": this.renderEndScreen(column); break;
      case "CANCEL_CONFIRMATION": this.renderCancelConfirmation(column, snapshot); break;
      case "ACTIVATING": this.addLabel(column, "Starting Lifeline…", "Headline2", 1.6); break;
    }
  }

  private renderIdle(parent: SceneObject): void {
    this.addLabel(parent, "Lifeline", "Headline2", 1.2, "center");
    this.addLabel(parent, this.voiceStatus, "Caption", 1.0, "center");
    const actions = this.createButtonStack(parent, CONTENT_WIDTH, TARGET_SIZE * 2 + 2.0, 2.0);
    this.addButton(actions, "ACTIVATE", CONTENT_WIDTH, TARGET_SIZE, () => this.manualActivation?.activateManually(), "primary");
    if (global.deviceInfoSystem.isEditor()) {
      this.addButton(actions, "SIMULATION — trigger voice: EMERGENCY", CONTENT_WIDTH, TARGET_SIZE, () => this.previewSimulation?.simulateVoiceEmergency(), "neutral");
    }
    this.addLabel(parent, LIFELINE_SAFETY_STATEMENT, "Caption", 2.2, "center");
  }

  private renderEmergencyHome(parent: SceneObject): void {
    this.addLabel(parent, "Emergency help", "Headline2", 1.2);
    this.addLabel(parent, "India emergency number: " + INDIA_EMERGENCY_CONFIG.emergencyNumber + ". Call emergency services now.", "Subheadline", 1.8);
    this.addLabel(parent, "If you cannot call, ask someone nearby to call " + INDIA_EMERGENCY_CONFIG.emergencyNumber + ".", "Body", 1.5);
    const actions = this.createRow(parent, CONTENT_WIDTH, TARGET_SIZE, 2.0);
    const w = (CONTENT_WIDTH - 2.0) / 2;
    this.addButton(actions, "CALL 112", w, TARGET_SIZE, () => this.controller?.showCallInstructions(), "critical");
    this.addButton(actions, "CONTINUE TO GUIDANCE", w, TARGET_SIZE, () => this.controller?.continueToPathSelection(), "primary");
  }

  private renderCallInstructions(parent: SceneObject, snapshot: LifelineSnapshot): void {
    this.addLabel(parent, "Call emergency services", "Headline2", 1.6);
    this.addLabel(parent, "India emergency number: " + INDIA_EMERGENCY_CONFIG.emergencyNumber, "Title2", 2.0, "center");
    this.addLabel(parent, INDIA_EMERGENCY_CONFIG.callActionInstruction + " Lifeline has not placed a call.", "Body", 3.2);
    if (snapshot.userAcknowledgedCall) {
      this.addLabel(parent, "Your acknowledgement is recorded; call connection is not verified.", "Caption", 1.4);
    }
    const actions = this.createRow(parent, CONTENT_WIDTH, TARGET_SIZE, 2.0);
    const w = (CONTENT_WIDTH - 2.0) / 2;
    this.addButton(actions, "I HAVE CALLED 112", w, TARGET_SIZE, () => this.controller?.acknowledgeUserCalled112(), "neutral");
    this.addButton(actions, "BACK", w, TARGET_SIZE, () => this.controller?.back(), "primary");
  }

  private renderPathSelection(parent: SceneObject): void {
    this.addLabel(parent, "Choose a pathway", "Headline2", 1.6);
    this.addLabel(parent, "112 remains available. Choose the closest situation.", "Caption", 1.2);
    const paths = this.createRow(parent, CONTENT_WIDTH, TARGET_SIZE, 2.0);
    const pathRowItem = paths.getComponent(FlexItem.getTypeName()) as FlexItem;
    pathRowItem.marginBottom = 2.0;
    const w = (CONTENT_WIDTH - 4.0) / 3;
    this.addButton(paths, "SEVERE BLEEDING", w, TARGET_SIZE, () => this.controller?.selectPath("bleeding"), "primary");
    this.addButton(paths, "UNRESPONSIVE / ABNORMAL BREATHING", w, TARGET_SIZE, () => this.controller?.selectPath("adult_collapse"), "neutral");
    this.addButton(paths, "OTHER EMERGENCY", w, TARGET_SIZE, () => this.controller?.selectPath("other"), "neutral");
    const actions = this.createRow(parent, CONTENT_WIDTH, TARGET_SIZE, 2.0);
    const half = (CONTENT_WIDTH - 2.0) / 2;
    this.addButton(actions, "CALL 112", half, TARGET_SIZE, () => this.controller?.showCallInstructions(), "critical");
    this.addButton(actions, "BACK", half, TARGET_SIZE, () => this.controller?.back(), "neutral");
  }

  private renderGuidance(parent: SceneObject, title: string, snapshot: LifelineSnapshot): void {
    const header = this.createRow(parent, CONTENT_WIDTH, TARGET_SIZE, 2.0);
    this.addLabel(header, title, "Headline2", TARGET_SIZE, "left", CONTENT_WIDTH - 10.0);
    this.addButton(header, "CALL 112", 8.0, TARGET_SIZE, () => this.controller?.showCallInstructions(), "critical");

    this.addLabel(parent, "Step " + (snapshot.stepIndex + 1) + " of " + snapshot.stepCount, "Caption", 1.0);
    const instruction = this.repeatMessage
      ? "REPEATED — " + this.repeatMessage
      : (snapshot.instruction ?? "Follow the emergency operator’s instructions.");
    this.addLabel(parent, instruction, "Body", 3.0);
    const nav = this.createRow(parent, CONTENT_WIDTH, TARGET_SIZE, 2.0);
    const w = (CONTENT_WIDTH - 6.0) / 4;
    this.addButton(nav, "BACK", w, TARGET_SIZE, () => this.controller?.back(), "neutral");
    this.addButton(nav, "REPEAT", w, TARGET_SIZE, () => this.repeatCurrentInstruction(), "neutral");
    this.addButton(nav, "NEXT", w, TARGET_SIZE, () => this.controller?.next(), "primary");
    this.addButton(nav, "END", w, TARGET_SIZE, () => this.controller?.requestEndSession(), "neutral");
  }

  private renderOtherEmergency(parent: SceneObject, snapshot: LifelineSnapshot): void {
    const header = this.createRow(parent, CONTENT_WIDTH, TARGET_SIZE, 2.0);
    this.addLabel(header, "Other emergency", "Headline2", TARGET_SIZE, "left", CONTENT_WIDTH - 8.4);
    this.addButton(header, "CALL 112", 8.0, TARGET_SIZE, () => this.controller?.showCallInstructions(), "critical");
    this.addLabel(parent, snapshot.instruction ?? "Call 112 now.", "Body", 3.2);
    const nav = this.createRow(parent, CONTENT_WIDTH, TARGET_SIZE, 2.0);
    const w = (CONTENT_WIDTH - 4.0) / 3;
    this.addButton(nav, "BACK", w, TARGET_SIZE, () => this.controller?.back(), "neutral");
    this.addButton(nav, "NEXT", w, TARGET_SIZE, () => this.controller?.next(), "primary");
    this.addButton(nav, "END", w, TARGET_SIZE, () => this.controller?.requestEndSession(), "neutral");
  }

  private renderEndScreen(parent: SceneObject): void {
    const header = this.createRow(parent, CONTENT_WIDTH, TARGET_SIZE, 2.0);
    this.addLabel(header, "Stay with the person", "Headline2", TARGET_SIZE, "left", CONTENT_WIDTH - 8.4);
    this.addButton(header, "CALL 112", 8.0, TARGET_SIZE, () => this.controller?.showCallInstructions(), "critical");
    this.addLabel(parent, "Follow the emergency operator’s instructions.", "Body", 3.2);
    const actions = this.createRow(parent, CONTENT_WIDTH, TARGET_SIZE, 2.0);
    const half = (CONTENT_WIDTH - 2.0) / 2;
    this.addButton(actions, "BACK TO LAST STEP", half, TARGET_SIZE, () => this.controller?.back(), "neutral");
    this.addButton(actions, "END SESSION", half, TARGET_SIZE, () => this.controller?.requestEndSession(), "primary");
  }

  private renderCancelConfirmation(parent: SceneObject, snapshot: LifelineSnapshot): void {
    const header = this.createRow(parent, CONTENT_WIDTH, TARGET_SIZE, 2.0);
    this.addLabel(header, snapshot.confirmationPurpose === "false_alarm" ? "End this session?" : "End guidance?", "Headline2", TARGET_SIZE, "left", CONTENT_WIDTH - 8.4);
    this.addButton(header, "CALL 112", 8.0, TARGET_SIZE, () => this.controller?.showCallInstructions(), "critical");
    this.addLabel(parent, "Emergency help remains available. Choose only if you intend to return to the start.", "Body", 3.2);
    const actions = this.createRow(parent, CONTENT_WIDTH, TARGET_SIZE, 2.0);
    const half = (CONTENT_WIDTH - 0.4) / 2;
    this.addButton(actions, "YES, END SESSION", half, TARGET_SIZE, () => this.controller?.confirmEndSession(), "neutral");
    this.addButton(actions, "CANCEL / KEEP GUIDANCE", half, TARGET_SIZE, () => this.controller?.cancelEndSession(), "primary");
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
    const parentFlex = parent.getComponent(FlexLayout.getTypeName()) as FlexLayout | null;
    if (parentFlex) parentFlex.addItems([item]);
    return stack;
  }

  private createRow(parent: SceneObject, width: number, height: number, gap: number): SceneObject {
    const row = this.createFlex(parent, FlexDirection.Row, width, height, gap);
    const item = row.createComponent(FlexItem.getTypeName()) as FlexItem;
    item.overrideWidth = width;
    item.overrideHeight = height;
    item.flexGrow = 0;
    item.flexShrink = 0;
    const parentFlex = parent.getComponent(FlexLayout.getTypeName()) as FlexLayout | null;
    if (parentFlex) parentFlex.addItems([item]);
    return row;
  }

  private addLabel(parent: SceneObject, value: string, role: TextRole, height: number, alignment: "left" | "center" = "left", width: number = CONTENT_WIDTH): void {
    // ElementContent auto-sizes safely when it is the sole child of its own layout host.
    const host = global.scene.createSceneObject("Lifeline Label Host");
    host.setParent(parent);
    const hostFlex = host.createComponent(FlexLayout.getTypeName()) as FlexLayout;
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
    const content = contentObject.createComponent(ElementContent.getTypeName()) as ElementContent;
    content.text = value;
    content.textSize = roleSize(role);
    content.contentAlignment = alignment;
    content.sizeOverride = new vec2(width, height);
    const contentItem = contentObject.createComponent(FlexItem.getTypeName()) as FlexItem;
    contentItem.overrideWidth = width;
    contentItem.overrideHeight = height;
    contentItem.flexGrow = 0;
    contentItem.flexShrink = 0;
    hostFlex.addItems([contentItem]);

    const item = host.createComponent(FlexItem.getTypeName()) as FlexItem;
    item.overrideWidth = width;
    item.overrideHeight = height;
    item.flexGrow = 0;
    item.flexShrink = 0;
    const parentFlex = parent.getComponent(FlexLayout.getTypeName()) as FlexLayout | null;
    if (parentFlex) parentFlex.addItems([item]);
  }

  private addButton(parent: SceneObject, label: string, width: number, height: number, action: () => void, tone: "primary" | "critical" | "neutral"): void {
    const obj = global.scene.createSceneObject("Lifeline Button " + label.replace(/[^A-Z0-9]+/g, "_"));
    obj.setParent(parent);
    const button = obj.createComponent(Button.getTypeName()) as Button;
    // Button geometry is assigned before initialization, as required by UIKit.
    button.size = new vec3(width, height, 1);
    button.opacity = tone === "neutral" ? 0.9 : 1;
    button.onTriggerUp.add(action);

    const content = obj.createComponent(ElementContent.getTypeName()) as ElementContent;
    content.text = label;
    content.textSize = roleSize("Button");
    content.contentAlignment = "center";
    content.sizeOverride = new vec2(width - 0.4, height - 0.4);

    const item = obj.createComponent(FlexItem.getTypeName()) as FlexItem;
    item.overrideWidth = width;
    item.overrideHeight = height;
    item.flexGrow = 0;
    item.flexShrink = 0;
    const parentFlex = parent.getComponent(FlexLayout.getTypeName()) as FlexLayout | null;
    if (parentFlex) parentFlex.addItems([item]);
  }
}

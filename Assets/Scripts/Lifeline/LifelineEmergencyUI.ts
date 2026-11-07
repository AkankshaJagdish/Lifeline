import { LifelineController } from "./LifelineController";
import { LifelineSnapshot } from "./LifelineTypes";
import { LifelineVoiceActivationController } from "./LifelineVoiceActivationController";
import { LIFELINE_SAFETY_STATEMENT } from "./LifelineGuidanceContent";
import { Frame } from "SpectaclesUIKit.lspkg/Scripts/Components/Frame/Frame";
import { Button } from "SpectaclesUIKit.lspkg/Scripts/Components/Button/Button";
import { ElementContent } from "SpectaclesUIKit.lspkg/Scripts/Components/Content/ElementContent";
import { FlexLayout } from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexLayout";
import { FlexItem } from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexItem";
import { FlexAlign, FlexDirection, FlexJustify } from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexTypes";

const PANEL_WIDTH = 40;
const PANEL_HEIGHT = 55;
const PAD = 2.0;
const TARGET_HEIGHT = 6.0;
type TextRole = "Title1" | "Headline2" | "Subheadline" | "Button" | "Body" | "Caption";
const TEXT_SIZE: Record<TextRole, number> = { Title1: 72, Headline2: 48, Subheadline: 41, Button: 39, Body: 39, Caption: 38 };

/** All Lifeline visual surfaces are authored here using Spectacles UIKit. */
@component
export class LifelineEmergencyUI extends BaseScriptComponent {
  @input
  @hint("Reference the Lifeline root SceneObject containing LifelineController and activation adapters.")
  controllerObject: SceneObject;

  @input
  @hint("Reference the LifelineVoiceActivationController component on the Lifeline root.")
  voiceActivationObject: SceneObject;

  private voiceActivation: LifelineVoiceActivationController | null = null;
  private controller: LifelineController | null = null;
  private frame: Frame | null = null;
  private contentHost: SceneObject | null = null;
  private pageRoot: SceneObject | null = null;
  private snapshot: LifelineSnapshot | null = null;
  private voiceStatus = "Voice activation status unavailable; use ACTIVATE.";

  onAwake(): void {
    if (this.controllerObject) this.controller = this.controllerObject.getComponent(LifelineController.getTypeName()) as LifelineController;
    if (!this.controller) { print("Lifeline UI: controllerObject is not wired to LifelineController."); return; }
    if (this.voiceActivationObject) this.voiceActivation = this.voiceActivationObject.getComponent(LifelineVoiceActivationController.getTypeName()) as LifelineVoiceActivationController;
    this.sceneObject.createComponent("Component.Canvas");
    this.frame = this.sceneObject.createComponent(Frame.getTypeName()) as Frame;
    this.frame.autoShowHide = false;
    this.frame.autoScaleContent = false;
    this.frame.allowScaling = false;
    this.frame.onInitialized.add(() => {
      const frame = this.frame;
      if (!frame) return;
      frame.innerSize = new vec2(PANEL_WIDTH, PANEL_HEIGHT);
      frame.padding = new vec2(PAD, PAD);
      const host = global.scene.createSceneObject("LifelineContent");
      host.setParent(frame.contentTransform.getSceneObject());
      host.getTransform().setLocalPosition(new vec3(0, 0, 0.6));
      this.contentHost = host;
      if (this.snapshot) this.render(this.snapshot);
    });
    this.createEvent("OnStartEvent").bind(() => {
      this.controller?.subscribe((snapshot) => { this.snapshot = snapshot; this.render(snapshot); });
      this.voiceActivation?.onStatusChanged((status) => { this.voiceStatus = status; if (this.snapshot?.state === "IDLE") this.render(this.snapshot); });
    });
  }

  private render(snapshot: LifelineSnapshot): void {
    if (!this.contentHost) return;
    if (this.pageRoot) this.pageRoot.destroy();
    const page = global.scene.createSceneObject("LifelinePage");
    page.setParent(this.contentHost);
    this.pageRoot = page;
    const column = this.createFlex(page, FlexDirection.Column, PANEL_WIDTH - PAD * 2, PANEL_HEIGHT - PAD * 2, 1.0);
    switch (snapshot.state) {
      case "IDLE": this.renderIdle(column); break;
      case "EMERGENCY_HOME": this.renderEmergencyHome(column, snapshot); break;
      case "CALL_IN_PROGRESS_OR_MANUAL_CALL": this.renderCallInstructions(column); break;
      case "PATH_SELECTION": this.renderPathSelection(column); break;
      case "BLEEDING_GUIDANCE": this.renderGuidance(column, "Severe bleeding", snapshot); break;
      case "ADULT_COLLAPSE_GUIDANCE": this.renderGuidance(column, "Adult emergency", snapshot); break;
      case "OTHER_EMERGENCY": this.renderOtherEmergency(column, snapshot); break;
      case "HELP_ARRIVED_OR_SESSION_END": this.renderEndScreen(column); break;
      case "CANCEL_CONFIRMATION": this.renderCancelConfirmation(column, snapshot); break;
      case "ACTIVATING": this.addText(column, "Starting Lifeline…", "Headline2", 8); break;
    }
  }

  private renderIdle(parent: SceneObject): void {
    this.addText(parent, "Lifeline", "Title1", 7);
    this.addText(parent, "Emergency first-aid guidance", "Subheadline", 5);
    this.addText(parent, this.voiceStatus, "Caption", 4);
    this.addButton(parent, "ACTIVATE", TARGET_HEIGHT, () => this.controller?.activateEmergency("manual"), "primary");
    this.addText(parent, LIFELINE_SAFETY_STATEMENT, "Caption", 8);
    if (global.deviceInfoSystem.isEditor()) this.addButton(parent, "SIMULATE VOICE: EMERGENCY", TARGET_HEIGHT, () => this.controller?.activateEmergency("preview_simulation"), "neutral");
  }

  private renderEmergencyHome(parent: SceneObject, snapshot: LifelineSnapshot): void {
    this.addText(parent, "Emergency help", "Headline2", 5);
    this.addText(parent, "Stay calm. Check that the area is safe.", "Body", 7);
    this.addButton(parent, "CALL 112", TARGET_HEIGHT, () => this.controller?.showCallInstructions(), "critical");
    this.addText(parent, snapshot.userAcknowledgedCall ? "Your confirmation is recorded. Lifeline has not verified the call." : "If you cannot call, ask someone nearby to call 112.", "Caption", 5);
    this.addButton(parent, "I HAVE CALLED 112", TARGET_HEIGHT, () => this.controller?.acknowledgeUserCalled112(), "neutral");
    this.addButton(parent, "CONTINUE TO GUIDANCE", TARGET_HEIGHT, () => this.controller?.continueToPathSelection(), "neutral");
    this.addButton(parent, "FALSE ALARM / END", TARGET_HEIGHT, () => this.controller?.requestFalseAlarm(), "neutral");
  }

  private renderCallInstructions(parent: SceneObject): void {
    this.addText(parent, "Call emergency services", "Headline2", 6);
    this.addText(parent, "India emergency number: 112", "Subheadline", 5);
    this.addText(parent, "Use your phone to call 112, or ask someone nearby to call. Lifeline has not placed a call.", "Body", 10);
    this.addButton(parent, "I HAVE CALLED 112", TARGET_HEIGHT, () => this.controller?.acknowledgeUserCalled112(), "neutral");
    this.addButton(parent, "BACK", TARGET_HEIGHT, () => this.controller?.back(), "neutral");
  }

  private renderPathSelection(parent: SceneObject): void {
    this.addText(parent, "What is happening?", "Headline2", 6);
    this.addText(parent, "Choose the closest situation. 112 stays available.", "Caption", 4);
    this.addButton(parent, "SEVERE BLEEDING", TARGET_HEIGHT, () => this.controller?.selectPath("bleeding"), "neutral");
    this.addButton(parent, "UNRESPONSIVE / ABNORMAL BREATHING", TARGET_HEIGHT, () => this.controller?.selectPath("adult_collapse"), "neutral");
    this.addButton(parent, "OTHER EMERGENCY", TARGET_HEIGHT, () => this.controller?.selectPath("other"), "neutral");
    this.addButton(parent, "CALL 112", TARGET_HEIGHT, () => this.controller?.showCallInstructions(), "critical");
    this.addButton(parent, "BACK", TARGET_HEIGHT, () => this.controller?.back(), "neutral");
  }

  private renderGuidance(parent: SceneObject, title: string, snapshot: LifelineSnapshot): void {
    this.addText(parent, title, "Headline2", 5);
    this.addText(parent, "Step " + (snapshot.stepIndex + 1) + " of " + snapshot.stepCount, "Caption", 3.5);
    this.addText(parent, snapshot.instruction ?? "Follow the emergency operator’s instructions.", "Body", 10);
    this.addButton(parent, "EMERGENCY HOME", TARGET_HEIGHT, () => this.controller?.activateEmergency("manual"), "neutral");
    this.addButton(parent, "CALL 112", TARGET_HEIGHT, () => this.controller?.showCallInstructions(), "critical");
    const nav = this.createFlex(parent, FlexDirection.Row, PANEL_WIDTH - PAD * 2, TARGET_HEIGHT, 0.6);
    this.addButton(nav, "< BACK", TARGET_HEIGHT, () => this.controller?.back(), "neutral", 11.6);
    this.addButton(nav, "REPEAT", TARGET_HEIGHT, () => this.controller?.repeatCurrentInstruction(), "neutral", 11.6);
    this.addButton(nav, "NEXT >", TARGET_HEIGHT, () => this.controller?.next(), "primary", 11.6);
    this.addButton(parent, "END SESSION", TARGET_HEIGHT, () => this.controller?.requestEndSession(), "neutral");
  }

  private renderOtherEmergency(parent: SceneObject, snapshot: LifelineSnapshot): void {
    this.addText(parent, "Other emergency", "Headline2", 5);
    this.addText(parent, snapshot.instruction ?? "Call 112 now.", "Body", 7);
    this.addButton(parent, "CALL 112", TARGET_HEIGHT, () => this.controller?.showCallInstructions(), "critical");
    this.addButton(parent, "BACK", TARGET_HEIGHT, () => this.controller?.back(), "neutral");
    this.addButton(parent, "NEXT", TARGET_HEIGHT, () => this.controller?.next(), "primary");
  }

  private renderEndScreen(parent: SceneObject): void {
    this.addText(parent, "Stay with the person", "Headline2", 6);
    this.addText(parent, "Follow the emergency operator’s instructions.", "Body", 6);
    this.addButton(parent, "CALL 112", TARGET_HEIGHT, () => this.controller?.showCallInstructions(), "critical");
    this.addButton(parent, "BACK TO LAST STEP", TARGET_HEIGHT, () => this.controller?.back(), "neutral");
    this.addButton(parent, "END SESSION", TARGET_HEIGHT, () => this.controller?.requestEndSession(), "neutral");
  }

  private renderCancelConfirmation(parent: SceneObject, snapshot: LifelineSnapshot): void {
    this.addText(parent, snapshot.confirmationPurpose === "false_alarm" ? "End this session?" : "End guidance?", "Headline2", 6);
    this.addText(parent, "Emergency help remains available. Choose only if you intend to return to the start.", "Body", 8);
    this.addButton(parent, "YES, END SESSION", TARGET_HEIGHT, () => this.controller?.confirmEndSession(), "neutral");
    this.addButton(parent, "KEEP GUIDANCE", TARGET_HEIGHT, () => this.controller?.cancelEndSession(), "primary");
    this.addButton(parent, "CALL 112", TARGET_HEIGHT, () => this.controller?.showCallInstructions(), "critical");
  }

  private createFlex(parent: SceneObject, direction: FlexDirection, width: number, height: number, gap: number): SceneObject {
    const container = global.scene.createSceneObject("LifelineLayout");
    container.setParent(parent);
    const flex = container.createComponent(FlexLayout.getTypeName()) as FlexLayout;
    flex.onInitialized.add(() => {
      flex.width = width; flex.height = height; flex.direction = direction;
      flex.alignItems = FlexAlign.Stretch; flex.justifyContent = FlexJustify.Start;
      if (direction === FlexDirection.Row) flex.columnGap = gap; else flex.rowGap = gap;
      flex.paddingTop = 0; flex.paddingBottom = 0; flex.paddingLeft = 0; flex.paddingRight = 0;
    });
    return container;
  }

  private addText(parent: SceneObject, value: string, role: TextRole, height: number): void {
    const obj = global.scene.createSceneObject("LifelineText");
    obj.setParent(parent);
    const text = obj.createComponent("Component.Text") as Text;
    text.text = value; text.size = TEXT_SIZE[role]; text.depthTest = true;
    text.horizontalOverflow = HorizontalOverflow.Wrap; text.verticalOverflow = VerticalOverflow.Shrink;
    text.textFill.color = new vec4(0.94, 0.94, 0.91, 1);
    text.layoutRect = Rect.create(-(PANEL_WIDTH - PAD * 2) / 2, (PANEL_WIDTH - PAD * 2) / 2, -height / 2, height / 2);
    const item = obj.createComponent(FlexItem.getTypeName()) as FlexItem;
    item.overrideHeight = height; item.flexShrink = 0;
  }

  private addButton(parent: SceneObject, label: string, height: number, action: () => void, tone: "primary" | "critical" | "neutral", width: number = PANEL_WIDTH - PAD * 2): void {
    const obj = global.scene.createSceneObject("LifelineButton_" + label.replace(/[^A-Z0-9]+/g, "_"));
    obj.setParent(parent);
    const button = obj.createComponent(Button.getTypeName()) as Button;
    button.onInitialized.add(() => { button.size = new vec3(width, height, 1); });
    button.onTriggerUp.add(action);
    const content = obj.createComponent(ElementContent.getTypeName()) as ElementContent;
    content.text = label; content.textSize = width < 20 ? 31 : TEXT_SIZE.Button;
    content.contentAlignment = "center"; content.sizeOverride = new vec2(width - 1, height - 0.5);
    const item = obj.createComponent(FlexItem.getTypeName()) as FlexItem;
    item.overrideHeight = height; item.flexShrink = 0;
    if (tone === "critical") button.opacity = 1;
  }
}

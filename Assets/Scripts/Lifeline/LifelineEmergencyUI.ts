import { LifelineController } from "./LifelineController";
import { LifelineSnapshot, LifelinePath } from "./LifelineTypes";
import { LifelineVoiceActivationController } from "./LifelineVoiceActivationController";
import { LifelineManualActivationController } from "./LifelineManualActivationController";
import { LifelinePreviewSimulationController } from "./LifelinePreviewSimulationController";
import { INDIA_EMERGENCY_CONFIG } from "./LifelineEmergencyConfig";
import { LIFELINE_SAFETY_STATEMENT } from "./LifelineGuidanceContent";
import { Frame } from "SpectaclesUIKit.lspkg/Scripts/Components/Frame/Frame";
import { Button } from "SpectaclesUIKit.lspkg/Scripts/Components/Button/Button";
import { FlexLayout } from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexLayout";
import { FlexItem } from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexItem";
import { FlexAlign, FlexDirection, FlexJustify } from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexTypes";

const FRAME_INNER_WIDTH = 36;
const FRAME_INNER_HEIGHT = 26;
const CONTENT_WIDTH = 34.5;
const CONTENT_HEIGHT = 24.5;
const PANEL_PADDING = 0.75;
const CONTENT_GAP = 0.65;
const PRIMARY_TARGET = 7.0;
const SECONDARY_TARGET = 5.0;
const TARGET_GAP = 0.8;
const VIEW_DISTANCE_CM = 105;
const SOS_WIDTH = 9.0;
const SOS_HEIGHT = 5.0;
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
  private pathOptionIndex = 0;
  private lastChosenCategory: string | null = null;
  private sosObject: SceneObject | null = null;
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

      // Frame remains within the 30 x 20 cm design limit; content uses a 0.75 cm inset.
      frame.innerSize = new vec2(FRAME_INNER_WIDTH, FRAME_INNER_HEIGHT);
      frame.padding = new vec2(PANEL_PADDING, PANEL_PADDING);
      frame.setUseFollow(true);
      frame.setFollowing(true);

      const host = global.scene.createSceneObject("Lifeline Content");
      host.setParent(frame.contentTransform.getSceneObject());
      host.getTransform().setLocalPosition(new vec3(0, 0, 0.6));
      this.contentHost = host;
      this.sosObject = this.createPersistentSosControl();
      if (this.snapshot) this.render(this.snapshot);
    });

    // Frame initializes automatically through its own OnStartEvent.
    // The ReplayEvent callback above creates the content host before the first render.

    this.createEvent("OnStartEvent").bind(() => {
      this.controller?.subscribe((snapshot) => {
        if (snapshot.state === "PATH_SELECTION" && this.snapshot?.state !== "PATH_SELECTION") {
          this.pathOptionIndex = 0;
        }
        const previousState = this.snapshot?.state;
        this.snapshot = snapshot;
        this.repeatMessage = null;
        if (snapshot.state === "IDLE" && previousState !== "IDLE") this.lastChosenCategory = null;
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
    const column = this.createFlex(page, FlexDirection.Column, CONTENT_WIDTH, CONTENT_HEIGHT, CONTENT_GAP);
    this.addPersistentSosButton(page, snapshot.state);

    switch (snapshot.state) {
      case "IDLE": this.renderIdle(column); break;
      case "EMERGENCY_HOME": this.renderEmergencyHome(column, snapshot); break;
      case "CALL_IN_PROGRESS_OR_MANUAL_CALL": this.renderCallInstructions(column); break;
      case "PATH_SELECTION": this.renderPathSelection(column, snapshot); break;
      case "BLEEDING_GUIDANCE": this.renderGuidance(column, "Severe bleeding", snapshot); break;
      case "ADULT_COLLAPSE_GUIDANCE": this.renderGuidance(column, "Adult collapse", snapshot); break;
      case "OTHER_EMERGENCY": this.renderGuidance(column, "Other emergency", snapshot); break;
      case "HELP_ARRIVED_OR_SESSION_END": this.renderEndScreen(column); break;
      case "CANCEL_CONFIRMATION": this.renderCancelConfirmation(column, snapshot); break;
      case "ACTIVATING": this.addLabel(column, "Starting Lifeline…", "Headline2", 1.2); break;
    }
  }

  private renderIdle(parent: SceneObject): void {
    this.addLabel(parent, "Lifeline", "Title2", 4.0, "center");
    this.addLabel(parent, "Emergency guidance, when every second matters.", "Subheadline", 3.4, "center");
    const status = this.voiceActivation ? this.voiceStatus : "Voice activation inactive — manual SOS is available.";
    this.addLabel(parent, status, "Caption", 2.0, "center");
    if (global.deviceInfoSystem.isEditor()) {
      this.addButton(parent, "SIMULATION — trigger voice: EMERGENCY", 24.0, SECONDARY_TARGET, () => this.previewSimulation?.simulateVoiceEmergency(), "neutral");
    }
  }

  private renderEmergencyHome(parent: SceneObject, snapshot: LifelineSnapshot): void {
    this.addLabel(parent, "Emergency help", "Headline1", 3.0);
    this.addLabel(parent, "112", "Title1", 4.0, "center");
    this.addLabel(parent, "Call emergency services now.", "Subheadline", 2.5, "center");
    this.addLabel(parent, "If you cannot call, ask someone nearby to call 112.", "Body", 2.6, "center");
    if (snapshot.userAcknowledgedCall) {
      this.addLabel(parent, "Your confirmation is recorded. Lifeline has not verified the call.", "Caption", 1.8, "center");
    }
    this.addButton(parent, "CALL INSTRUCTIONS", 22.0, PRIMARY_TARGET, () => this.controller?.showCallInstructions(), "critical");
    this.addButton(parent, "CONTINUE", 22.0, PRIMARY_TARGET, () => this.controller?.continueToPathSelection(), "primary");
  }

  private renderPathSelection(parent: SceneObject, snapshot: LifelineSnapshot): void {
    this.addLabel(parent, "WHAT IS HAPPENING?", "Headline1", 3.0, "center");
    this.addLabel(parent, "Choose one option. You can continue to 112 at any time.", "Caption", 2.0, "center");

    const grid = this.createFlex(parent, FlexDirection.Column, CONTENT_WIDTH, 15.8, 0.75);
    this.registerLayoutItem(grid, parent, CONTENT_WIDTH, 15.8);
    const rowOne = this.createFlex(grid, FlexDirection.Row, CONTENT_WIDTH, 7.4, 0.7);
    const rowTwo = this.createFlex(grid, FlexDirection.Row, CONTENT_WIDTH, 7.4, 0.7);
    this.registerLayoutItem(rowOne, grid, CONTENT_WIDTH, 7.4);
    this.registerLayoutItem(rowTwo, grid, CONTENT_WIDTH, 7.4);
    const cardWidth = (CONTENT_WIDTH - 0.7) / 2;
    this.addCategoryCard(rowOne, "PERSON COLLAPSED", "Adult casualty", "●", cardWidth, 7.4, () => this.selectCategory("person"));
    this.addCategoryCard(rowOne, "BLEEDING INJURY", "Visible injury", "✚", cardWidth, 7.4, () => this.selectCategory("bleeding"));
    this.addCategoryCard(rowTwo, "FIRE / SMOKE", "Hazard nearby", "▲", cardWidth, 7.4, () => this.selectCategory("fire"));
    this.addCategoryCard(rowTwo, "OTHER EMERGENCY", "Not sure / other", "?", cardWidth, 7.4, () => this.selectCategory("other"));
    this.addButton(parent, "SKIP — CONTINUE TO 112", 24.0, SECONDARY_TARGET, () => this.controller?.showCallInstructions(), "critical");
  }

  private selectCategory(category: string): void {
    this.lastChosenCategory = category;
    if (category === "person") {
      this.controller?.selectPath("adult_collapse");
      return;
    }
    if (category === "bleeding") {
      this.controller?.selectPath("bleeding");
      return;
    }
    // Fire is selectable as a user-described category, but no reviewed fire
    // guidance/state exists in this baseline. Keep the safe 112 / other route.
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
    sos.setParent(this.contentHost || this.sceneObject);
    // Upper-right inset within the 36 x 26 cm Frame; remains inside a comfortable target region.
    sos.getTransform().setLocalPosition(new vec3(11.0, 7.2, 0.8));
    const button = sos.createComponent(Button.getTypeName()) as Button;
    button.size = new vec3(SOS_WIDTH, SOS_HEIGHT, 1);
    button.opacity = 1.0;
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
    this.addButton(actions, "NEXT STEP", CONTENT_WIDTH, PRIMARY_TARGET, () => this.controller?.next(), "primary");
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
    const pendingItems: FlexItem[] = [];
    this.pendingFlexItems.set(container, pendingItems);
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
      if (pendingItems.length > 0) flex.addItems(pendingItems);
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

  private addLabel(parent: SceneObject, value: string, role: TextRole, height: number, alignment: "left" | "center" = "left", width: number = CONTENT_WIDTH): void {
    // ElementContent auto-sizes safely when it is the sole child of its own layout host.
    const host = global.scene.createSceneObject("Lifeline Label Host");
    host.setParent(parent);
    const hostFlex = host.createComponent(FlexLayout.getTypeName()) as FlexLayout;
    hostFlex.autoDiscoverItemsOnStart = false;
    const hostItems: FlexItem[] = [];
    this.pendingFlexItems.set(host, hostItems);
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
      if (hostItems.length > 0) hostFlex.addItems(hostItems);
    });

    const contentObject = global.scene.createSceneObject("Lifeline Label Content");
    contentObject.setParent(host);
    const text = contentObject.createComponent("Component.Text") as Text;
    text.text = value;
    text.depthTest = true;
    applyTextRole(text, role);
    text.textFill.color = PALETTE.ivory;
    text.horizontalAlignment = alignment === "center" ? HorizontalAlignment.Center : HorizontalAlignment.Left;
    text.verticalAlignment = VerticalAlignment.Center;
    text.horizontalOverflow = HorizontalOverflow.Overflow;
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

  private addButton(parent: SceneObject, label: string, width: number, height: number, action: () => void, tone: "primary" | "critical" | "neutral"): void {
    const obj = global.scene.createSceneObject("Lifeline Button " + label.replace(/[^A-Z0-9]+/g, "_"));
    obj.setParent(parent);
    const button = obj.createComponent(Button.getTypeName()) as Button;
    button.size = new vec3(width, height, 1);
    button.opacity = tone === "critical" ? 1.0 : tone === "primary" ? 0.98 : 0.88;
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

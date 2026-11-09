import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";

/**
 * Builds a non-graphic spatial training scene under the existing Lifeline root.
 * The generated objects are independent SceneObjects with colliders and SIK
 * Interactables. No patient recognition or medical sensing is performed.
 */
@component
export class LifelineIncidentScenarios extends BaseScriptComponent {
  @input
  @hint("Optional existing Lifeline Incident Scenarios parent. If empty, a named child is created under this component's SceneObject.")
  @allowUndefined
  scenariosParent: SceneObject;

  @input
  @hint("Optional camera used only for scene-collider gaze hit testing. Direct SIK Interactable selection remains available without it.")
  @allowUndefined
  camera: Camera;

  @input
  @hint("Distance in centimetres from the parent origin to the demo objects.")
  scenarioDistanceCm: number = 165;

  @input
  @hint("Assign a valid unlit or vertex-colour material from the project. Empty material graphs do not render.")
  @allowUndefined
  incidentMaterial: Material;

  @input
  @hint("Enable SIK object target selection on each incident stand-in.")
  enableDirectSelection: boolean = true;

  private scenariosRoot: SceneObject;
  private anchorsRoot: SceneObject;
  private personObject: SceneObject;
  private injuryObject: SceneObject;
  private fireObject: SceneObject;
  private markerObject: SceneObject;
  private selectedObject: SceneObject | null = null;
  private selectedKind: string = "";
  private selectionListeners: Array<(kind: string, target: SceneObject) => void> = [];
  private probe: Probe;

  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => this.buildScenario());
  }

  public onSelectionChanged(listener: (kind: string, target: SceneObject) => void): void {
    this.selectionListeners.push(listener);
    if (this.selectedObject) listener(this.selectedKind, this.selectedObject);
  }

  public selectPreviewScenario(kind: string): void {
    if (!global.deviceInfoSystem.isEditor()) return;
    const target = this.objectForKind(kind);
    if (!target) return;
    this.selectObject(kind, target);
  }

  public selectObject(kind: string, target: SceneObject): void {
    if (!target) return;
    this.selectedKind = kind;
    this.selectedObject = target;
    this.updateMarkerForSelection(target);
    this.selectionListeners.forEach((listener) => listener(kind, target));
  }

  public getSelectedKind(): string {
    return this.selectedKind;
  }

  public getSelectedObject(): SceneObject | null {
    return this.selectedObject;
  }

  public getMarkerObject(): SceneObject {
    return this.markerObject;
  }

  public clearSelection(): void {
    this.selectedObject = null;
    this.selectedKind = "";
    if (this.markerObject) this.markerObject.enabled = false;
  }

  private buildScenario(): void {
    const parent = this.scenariosParent || this.sceneObject;
    this.scenariosRoot = global.scene.createSceneObject("Lifeline Incident Scenarios");
    this.scenariosRoot.setParent(parent);

    this.anchorsRoot = global.scene.createSceneObject("Lifeline Incident Anchors");
    this.anchorsRoot.setParent(parent);

    // Scenario objects live in front of the existing camera and are arranged
    // as separate physical targets, not as content on a UI surface.
    const d = Math.max(100, this.scenarioDistanceCm);
    this.personObject = this.createPersonScenario(
      this.scenariosRoot,
      new vec3(-48, 0, -d),
      "Collapsed Person Scenario"
    );
    this.injuryObject = this.createInjuryScenario(
      this.scenariosRoot,
      new vec3(0, 0, -d),
      "Bleeding Injury Scenario"
    );
    this.fireObject = this.createFireScenario(
      this.scenariosRoot,
      new vec3(48, 0, -d),
      "Fire Smoke Scenario"
    );

    this.markerObject = this.createIncidentMarker(this.anchorsRoot);
    this.markerObject.enabled = false;

    this.probe = Physics.createGlobalProbe();
    this.bindGazeRayFallback();
    this.bindDirectSelection();

    // Default is intentionally no selection; Preview user chooses a stand-in.
    this.clearSelection();
  }

  private bindDirectSelection(): void {
    // SIK Interactable callbacks are registered on their collider SceneObjects
    // inside OnStartEvent by addSelectableCollider().
    if (!this.enableDirectSelection) return;
  }

  /**
   * Camera gaze ray against scene colliders. This is scene-object hit testing,
   * not recognition of people, wounds, flames or other real-world content.
   */
  private bindGazeRayFallback(): void {
    if (!this.camera) return;
    this.createEvent("UpdateEvent").bind(() => {
      if (!this.probe || !this.scenariosRoot) return;
      const transform = this.camera.getSceneObject().getTransform();
      const origin = transform.getWorldPosition();
      const end = origin.add(transform.forward.uniformScale(5));
      this.probe.rayCast(origin, end, (hit) => {
        if (!hit || !hit.collider) return;
        const hitObject = hit.collider.getSceneObject();
        const kind = this.kindForObject(hitObject);
        if (kind) {
          // Gaze hit is reported only; selection is the explicit SIK trigger.
          // Triggering the target itself is handled by Interactable.onTriggerStart.
        }
      });
    });
  }

  private kindForObject(object: SceneObject): string {
    if (object === this.personObject) return "person";
    if (object === this.injuryObject) return "injury";
    if (object === this.fireObject) return "fire";
    return "";
  }

  private objectForKind(kind: string): SceneObject | null {
    if (kind === "person") return this.personObject;
    if (kind === "injury") return this.injuryObject;
    if (kind === "fire") return this.fireObject;
    return null;
  }

  private createPersonScenario(parent: SceneObject, position: vec3, name: string): SceneObject {
    const root = this.createTargetRoot(parent, name, position, 0.8, 1);
    // Fully clothed, training-only mannequin assembled from rounded primitives.
    this.addPrimitive(root, "Mannequin Torso", "box", new vec3(0, 20, 0), new vec3(19, 8, 34), new vec4(0.77, 0.71, 0.58, 1));
    this.addPrimitive(root, "Mannequin Pelvis", "box", new vec3(0, 18, 28), new vec3(18, 8, 17), new vec4(0.2, 0.34, 0.35, 1));
    this.addPrimitive(root, "Mannequin Head", "sphere", new vec3(0, 27, -23), new vec3(10, 10, 10), new vec4(0.88, 0.73, 0.59, 1));
    this.addPrimitive(root, "Mannequin Left Arm", "capsule", new vec3(-13, 17, -2), new vec3(6, 22, 6), new vec4(0.2, 0.34, 0.35, 1));
    this.addPrimitive(root, "Mannequin Right Arm", "capsule", new vec3(13, 17, -2), new vec3(6, 22, 6), new vec4(0.2, 0.34, 0.35, 1));
    this.addPrimitive(root, "Mannequin Left Leg", "capsule", new vec3(-6, 12, 42), new vec3(7, 30, 7), new vec4(0.2, 0.34, 0.35, 1));
    this.addPrimitive(root, "Mannequin Right Leg", "capsule", new vec3(6, 12, 42), new vec3(7, 30, 7), new vec4(0.2, 0.34, 0.35, 1));
    this.addLabel(root, "TRAINING MANNEQUIN", new vec3(0, 48, 0));
    this.addSelectableCollider(root, new vec3(0, 20, 8), new vec3(48, 62, 112));
    return root;
  }

  private createInjuryScenario(parent: SceneObject, position: vec3, name: string): SceneObject {
    const root = this.createTargetRoot(parent, name, position, 0.8, 1);
    // Separate forearm training prop with a modest red training stripe; no blood.
    this.addPrimitive(root, "Forearm Training Prop", "capsule", new vec3(0, 8, 0), new vec3(12, 42, 12), new vec4(0.77, 0.71, 0.58, 1));
    this.addPrimitive(root, "Simulated Injury Indicator", "box", new vec3(0, 9, -1), new vec3(14, 3, 2), new vec4(0.85, 0.18, 0.18, 1));
    this.addPrimitive(root, "Forearm End", "sphere", new vec3(0, 8, 22), new vec3(12, 12, 12), new vec4(0.77, 0.71, 0.58, 1));
    this.addLabel(root, "SIMULATED INJURY", new vec3(0, 35, 0));
    this.addSelectableCollider(root, new vec3(0, 8, 0), new vec3(26, 50, 30));
    return root;
  }

  private createFireScenario(parent: SceneObject, position: vec3, name: string): SceneObject {
    const root = this.createTargetRoot(parent, name, position, 0.8, 1);
    this.addPrimitive(root, "Fire Hazard Base", "cylinder", new vec3(0, 2, 0), new vec3(26, 4, 26), new vec4(0.92, 0.48, 0.13, 1));
    this.addPrimitive(root, "Fire Hazard Flame A", "cone", new vec3(-6, 17, 0), new vec3(8, 26, 8), new vec4(0.9, 0.28, 0.12, 0.88));
    this.addPrimitive(root, "Fire Hazard Flame B", "cone", new vec3(5, 13, 3), new vec3(7, 20, 7), new vec4(0.95, 0.65, 0.2, 0.88));
    this.addPrimitive(root, "Smoke Proxy", "sphere", new vec3(0, 34, 0), new vec3(24, 20, 24), new vec4(0.68, 0.68, 0.68, 0.55));
    this.addLabel(root, "FIRE / SMOKE PROP", new vec3(0, 59, 0));
    this.addSelectableCollider(root, new vec3(0, 25, 0), new vec3(34, 70, 34));
    return root;
  }

  private createTargetRoot(parent: SceneObject, name: string, position: vec3, scale: number, rotationY: number): SceneObject {
    const root = global.scene.createSceneObject(name);
    root.setParent(parent);
    root.getTransform().setLocalPosition(position);
    root.getTransform().setLocalRotation(quat.fromEulerAngles(0, rotationY, 0));
    root.getTransform().setLocalScale(new vec3(scale, scale, scale));
    return root;
  }

  private addSelectableCollider(root: SceneObject, offset: vec3, size: vec3): void {
    const kind = root === this.personObject ? "person" : root === this.injuryObject ? "injury" : "fire";
    const hit = global.scene.createSceneObject("Selectable Incident Target");
    hit.setParent(root);
    hit.getTransform().setLocalPosition(offset);
    const collider = hit.createComponent("ColliderComponent") as ColliderComponent;
    collider.fitVisual = false;
    const boxShape = Shape.createBoxShape();
    boxShape.size = size;
    collider.shape = boxShape;
    const interactable = hit.createComponent(Interactable.getTypeName()) as Interactable;
    this.createEvent("OnStartEvent").bind(() => {
      interactable.onTriggerStart.add(() => this.selectObject(kind, root));
    });
    hit.enabled = true;
  }

  private addPrimitive(parent: SceneObject, name: string, shape: string, position: vec3, size: vec3, color: vec4): void {
    const object = global.scene.createSceneObject(name);
    object.setParent(parent);
    object.getTransform().setLocalPosition(position);
    object.getTransform().setLocalScale(size);
    const mesh = this.createMesh(shape, color);
    const visual = object.createComponent("Component.RenderMeshVisual") as RenderMeshVisual;
    visual.mesh = mesh;
    if (this.incidentMaterial) {
      visual.mainMaterial = this.incidentMaterial.clone();
      visual.mainMaterial.mainPass.depthTest = true;
      visual.mainMaterial.mainPass.depthWrite = true;
    }
  }

  private createMesh(shape: string, color: vec4): RenderMesh {
    const builder = new MeshBuilder([
      {name: "position", components: 3},
      {name: "normal", components: 3, normalized: true},
      {name: "color", components: 4},
    ]);
    builder.topology = MeshTopology.Triangles;
    builder.indexType = MeshIndexType.UInt16;
    const indices: number[] = [];
    let vertexIndex = 0;

    if (shape === "sphere") {
      // A deliberately faceted ellipsoid made from 3 orthogonal boxes.
      // Training-stand-in geometry only; no anatomy or injury is represented.
      vertexIndex = this.appendBox(builder, indices, 0, 0, 0, 0.50, 0.50, 0.50, color, vertexIndex);
    } else if (shape === "cylinder") {
      // Faceted hazard base, expressed as a low-poly square prism.
      vertexIndex = this.appendBox(builder, indices, 0, 0, 0, 0.50, 0.50, 0.50, color, vertexIndex);
    } else if (shape === "cone") {
      // Tapered cue is represented by a narrow upright stack of boxes.
      vertexIndex = this.appendBox(builder, indices, 0, -0.25, 0, 0.30, 0.25, 0.30, color, vertexIndex);
      vertexIndex = this.appendBox(builder, indices, 0, 0.25, 0, 0.16, 0.25, 0.16, color, vertexIndex);
    } else if (shape === "capsule") {
      // Rounded appearance is approximated by a stack of three beveled blocks.
      vertexIndex = this.appendBox(builder, indices, 0, -0.30, 0, 0.34, 0.20, 0.34, color, vertexIndex);
      vertexIndex = this.appendBox(builder, indices, 0, 0, 0, 0.42, 0.30, 0.42, color, vertexIndex);
      vertexIndex = this.appendBox(builder, indices, 0, 0.30, 0, 0.34, 0.20, 0.34, color, vertexIndex);
    } else {
      vertexIndex = this.appendBox(builder, indices, 0, 0, 0, 0.50, 0.50, 0.50, color, vertexIndex);
    }

    builder.appendIndices(indices);
    const mesh = builder.getMesh();
    builder.updateMesh();
    return mesh;
  }

  private appendBox(
    builder: MeshBuilder,
    indices: number[],
    cx: number, cy: number, cz: number,
    hw: number, hh: number, hd: number,
    color: vec4,
    baseIndex: number
  ): number {
    const x0 = cx - hw, x1 = cx + hw;
    const y0 = cy - hh, y1 = cy + hh;
    const z0 = cz - hd, z1 = cz + hd;
    const rgba = [color.x, color.y, color.z, color.w];
    const verts: number[] = [];
    let vi = baseIndex;
    const face = (
      p0: number[], p1: number[], p2: number[], p3: number[],
      n: number[]
    ) => {
      verts.push(
        ...p0, ...n, ...rgba,
        ...p1, ...n, ...rgba,
        ...p2, ...n, ...rgba,
        ...p3, ...n, ...rgba
      );
      indices.push(vi, vi + 1, vi + 2, vi, vi + 2, vi + 3);
      vi += 4;
    };
    face([x1,y0,z0], [x1,y1,z0], [x1,y1,z1], [x1,y0,z1], [1,0,0]);
    face([x0,y0,z1], [x0,y1,z1], [x0,y1,z0], [x0,y0,z0], [-1,0,0]);
    face([x0,y1,z0], [x0,y1,z1], [x1,y1,z1], [x1,y1,z0], [0,1,0]);
    face([x0,y0,z1], [x0,y0,z0], [x1,y0,z0], [x1,y0,z1], [0,-1,0]);
    face([x0,y0,z1], [x1,y0,z1], [x1,y1,z1], [x0,y1,z1], [0,0,1]);
    face([x1,y0,z0], [x0,y0,z0], [x0,y1,z0], [x1,y1,z0], [0,0,-1]);
    builder.appendVerticesInterleaved(verts);
    return vi;
  }

  private addLabel(parent: SceneObject, value: string, position: vec3): void {
    const label = global.scene.createSceneObject("Scenario Label " + value);
    label.setParent(parent);
    label.getTransform().setLocalPosition(position);
    const text = label.createComponent("Component.Text") as Text;
    text.text = value;
    text.size = 42;
    text.textFill.color = new vec4(1, 1, 1, 1);
    text.depthTest = true;
    text.horizontalAlignment = HorizontalAlignment.Center;
    text.verticalAlignment = VerticalAlignment.Center;
  }

  private createIncidentMarker(parent: SceneObject): SceneObject {
    const marker = global.scene.createSceneObject("Selected Incident Marker");
    marker.setParent(parent);
    // A visible locator assembled from a small ring-like four-bar marker.
    const amber = new vec4(1, 0.68, 0.22, 1);
    this.addPrimitive(marker, "Marker North", "box", new vec3(0, 0, 0), new vec3(1.1, 0.12, 0.12), amber);
    this.addPrimitive(marker, "Marker South", "box", new vec3(0, 0, 0), new vec3(1.1, 0.12, 0.12), amber);
    this.addPrimitive(marker, "Marker East", "box", new vec3(0, 0, 0), new vec3(0.12, 0.12, 1.1), amber);
    this.addPrimitive(marker, "Marker West", "box", new vec3(0, 0, 0), new vec3(0.12, 0.12, 1.1), amber);
    return marker;
  }

  private updateMarkerForSelection(target: SceneObject): void {
    const position = target.getTransform().getWorldPosition();
    const right = target.getTransform().right;
    const adjacent = position.add(right.uniformScale(18));
    const markerTransform = this.markerObject.getTransform();
    markerTransform.setWorldPosition(new vec3(adjacent.x, position.y + 3, adjacent.z));
    markerTransform.setWorldRotation(quat.quatIdentity());
    this.markerObject.enabled = true;
  }
}

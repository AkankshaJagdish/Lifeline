# Lifeline spatial incident demo — local integration and verification

This increment adds a runtime-authored, non-graphic scene demonstration. It deliberately does not change the Lifeline medical state machine, medical strings, emergency number, or live UI.

## Files

- `Assets/Scripts/Lifeline/LifelineIncidentScenarios.ts` — creates scenario props, target colliders, SIK Interactables, and a world-position marker. Assign a valid incident material via Inspector before running.
- `Assets/Scripts/Lifeline/LifelineIncidentScenarios.ts.meta` — TypeScript asset metadata.
- `Assets/Scripts/Lifeline/LifelinePreviewSimulationController.ts` — retains the existing activation simulation and adds three Editor-only scenario selector methods.
- `Assets/Scripts/Lifeline/LifelinePreviewSimulationController.ts.meta` — updated input metadata.
- `devpost/spatial-incident-demo-test-plan.md` — manual verification checklist.

## Scene hierarchy to create / wire locally

The repository's checked-in `Assets/Scene.scene` and its 2026-11-07 MCP scene export do not match the Devpost architecture document: the export contains only the Camera Object, Lighting and Preview Agent handler, while the architecture document describes the Lifeline root hierarchy. The MCP export README also says the editor-open project path was a temporary Lens Studio path different from the repository workspace. For that reason, this PR does **not** overwrite or regenerate `Assets/Scene.scene`.

In your existing working Lens Studio scene, use the current Lifeline Experience root and create / confirm:

    Lifeline Experience
    ├── Lifeline Input Adapters                  (existing)
    │   └── LifelinePreviewSimulationController (existing)
    ├── Lifeline Instruction Panel               (existing)
    ├── Lifeline Incident Scenarios               (new)
    │   ├── Collapsed Person Scenario             (runtime-created)
    │   ├── Bleeding Injury Scenario              (runtime-created)
    │   └── Fire Smoke Scenario                   (runtime-created)
    └── Lifeline Incident Anchors                 (runtime-created)

Attach `LifelineIncidentScenarios.ts` as a ScriptComponent to `Lifeline Incident Scenarios`. Its own `scenariosParent` input may be left empty; it then creates the named child hierarchy under that host. Set `scenarioDistanceCm` to 165 initially, then adjust only after Preview inspection.

On the existing `LifelinePreviewSimulationController` component:
1. Keep the existing `controllerObject` wired to `Lifeline Experience`.
2. Wire the new `incidentScenarios` input to the **LifelineIncidentScenarios ScriptComponent** (component reference, not only the host SceneObject).
3. Keep `previewSimulationEnabled` default false in serialized data; the script gates the methods with `global.deviceInfoSystem.isEditor()`.

Create three separate Preview-only buttons in a clearly marked simulation panel, not in the live Lifeline instruction UI:
- `FOUND PERSON` → call `foundPerson()`.
- `FOUND INJURY` → call `foundInjury()`.
- `FOUND FIRE` → call `foundFire()`.

Use the installed SpectaclesUIKit Button component and register each callback from its public `onTriggerUp` event. Keep the simulation panel visibly labelled `PREVIEW SCENARIO CONTROLS — SIMULATION ONLY`.

The three scenario target collider child objects have SIK Interactable components. Pinch/click on the collider area selects the corresponding scenario root. The marker is positioned from the selected root SceneObject's **actual world position**, offset 18 cm to the object's right and 3 cm upward. Switching scenario selection updates this marker.

## Build / Preview checklist

1. Sync the PR branch and open the exact `Lifeline.esproj` in Lens Studio 5.23.2.26081320 Public with Spectacles / SPECS 27 Preview configuration.
2. Recompile TypeScript. Fix compile issues in the Lens Studio project before testing; report exact error text and file/line.
3. In the Scene Hierarchy, confirm the scenario component and generated objects are children of the intended Lifeline hierarchy, not the camera or the Frame.
4. Assign a material asset to `incidentMaterial`, then open Interactive Preview. Confirm all three stand-ins are rendered as separate 3D geometry in the room, not as flat images or panel artwork.
5. Click / pinch each stand-in. Confirm it becomes selected and the locator appears adjacent to the selected root object's real world transform.
6. Switch between the three Preview FOUND controls. Confirm the marker moves to the newly selected object's position and does not remain at screen centre.
7. Move the Preview camera around the objects. Confirm each stand-in remains a separate selectable object and the marker remains spatially related to the selected target.
8. Verify that the three FOUND controls do not appear in the actual Lifeline UI and do nothing outside Editor.
9. Exercise the existing manual / voice-simulation activation and existing Lifeline flow to confirm no medical state, emergency number, content string, or transition was changed.
10. Capture a Preview screenshot showing all three scenario props, the selected target and marker, plus a second screenshot of each marker selection if useful.

## Supported targeting behavior and limitations

- Direct selection uses the installed SIK `Interactable` component and a scene collider. Official CLAD `specs-interaction-recipes` states the same Interactable events are driven by HandInteractor on device and MouseInteractor in Lens Studio Editor Preview. Subscription is performed in `OnStartEvent`.
- Lens API documentation describes Physics global-probe raycasting against scene colliders and camera gaze rays. The current script includes a non-selecting gaze-hit probe for diagnostics; direct selection is performed by Interactable trigger, not by hover or gaze alone.
- WorldQueryModule is for real-world surfaces, not the authored scene props. The current script anchors to the selected SceneObject transform, so it does not depend on Preview depth or World Query.
- No patient, wound, breathing, flame or hazard recognition is implemented.
- The mannequin, forearm and fire/smoke stand-ins are stylized, code-authored low-poly block forms, not generated GLBs or anatomical models. The signed-in Lens Studio SPECS text-to-3D / FAST3D editor tooling is unavailable in this GitHub-only workflow. The code-authored geometry is an explicit, simplified demonstration route.

## Current verification boundary

The cloud session cannot open Lens Studio, recompile TypeScript, inspect the running scene, capture Preview screenshots, or execute LEAF. Those checks must be completed locally. Do not report the spatial scene as tested until the checklist above has been exercised.

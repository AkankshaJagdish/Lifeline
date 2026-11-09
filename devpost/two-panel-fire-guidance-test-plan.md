# Lifeline two-panel guidance and fire / smoke — local verification plan

This increment adds an incident-anchored guidance workspace and a source-referenced evacuation-only Fire / Smoke pathway. It reuses the existing Lifeline controller, state machine, activation adapters, emergency configuration, Frame, and reviewed adult-collapse / severe-bleeding copy.

## Changed files

- `Assets/Scripts/Lifeline/LifelineEmergencyUI.ts`
  - Adds the `incidentScenariosObject` input and resolves the existing `LifelineIncidentScenarios` component.
  - Adds an incident-relative two-panel layout: existing Frame on the right, one UIKit BackPlate on the left.
  - Positions both panels as a shared group from the selected marker and current camera orientation.
  - Adds ordered completed/current/upcoming overview rows; the overview is read-only to prevent accidental step jumps.
  - Adds one current instruction panel with step number, heading, full current text, concise supporting copy, Back, Repeat, conditional Next, End Session and the persistent SOS 112 control.
  - Routes Fire / Smoke to the new `fire_smoke` content path.
- `Assets/Scripts/Lifeline/LifelineEmergencyUI.ts.meta`
  - Adds the `incidentScenariosObject` Inspector input.
- `Assets/Scripts/Lifeline/LifelineTypes.ts`
  - Adds the `fire_smoke` path literal and optional display-only `title` / `summary` fields on GuidanceStep. Existing path values and state names are retained.
- `Assets/Scripts/Lifeline/LifelineGuidanceContent.ts`
  - Adds seven Fire / Smoke evacuation steps. The existing bleeding and adult-collapse arrays are retained unchanged.
- `devpost/medical-content-sources.md`
  - Adds the Indian fire-safety sources, exact proposed UI copy, scope and exclusions.
- `devpost/two-panel-fire-guidance-test-plan.md`
  - Local compile, scene wiring, Preview and LEAF instructions, and screenshot checklist.
- `devpost/acceptance-criteria.md`
  - Adds UX acceptance checks for the two-panel guidance and fire route; original AC-1..AC-4 remain unchanged.
- `README.md`
  - Documents the feature and the local test instructions.

No edits are made to `LifelineController.ts`, `LifelineStateMachine.ts`, `LifelineIncidentScenarios.ts`, `LifelineEmergencyConfig.ts`, the existing adult-collapse / bleeding wording, `Assets/Scene.scene`, or any packed UIKit / SIK package source.

## Inspector / scene wiring

1. Sync the branch and open the exact `Lifeline.esproj` in Lens Studio 5.23.2.26081320 Public, targeting Spectacles / SPECS Preview.
2. Keep the existing `LifelineEmergencyUI.controllerObject` and `activationAdaptersObject` references wired as before.
3. In the `LifelineEmergencyUI` component, wire the new `incidentScenariosObject` input to the SceneObject that holds the existing `LifelineIncidentScenarios` ScriptComponent. This is a SceneObject reference, not a second component or a new manager.
4. Keep `LifelineIncidentScenarios` under the existing Lifeline Experience root and keep its three non-human scenario targets / marker. Assign its required project material as described by `spatial-incident-demo-test-plan.md`.
5. Do not create another Frame. The existing Frame is resized for the right panel during guided states. The left panel is a single UIKit BackPlate.
6. If no scenario is selected or the new input is not wired, the UI deliberately falls back to the existing single-panel guidance so the user still has the instructions and SOS. Two-panel anchoring requires a valid selected marker.

## Two-panel behavior and geometry

- Combined envelope: 30 cm wide × 18.5 cm high (within the approved 30 × 20 cm maximum).
- Left panel: 10.5 cm wide BackPlate.
- Gap: 1 cm.
- Right panel: existing Frame, 18.5 cm wide.
- Both panels use the same Lifeline root transform. They are not parented to the marker and cannot drift independently.
- The root transform is positioned from the selected marker, offset toward the user by 55 cm from the default 165 cm scenario plane, 8 cm below the camera's forward basis, with the right Frame offset so the 1 cm gap straddles the marker.
- The group is oriented to the camera basis when placed. A new scenario selection repositions the shared group. No patient, body, face, wound or clothing targeting is introduced.
- Left overview rows are read-only: completed = teal check, current = amber dot, upcoming = neutral dot. These are navigation/progress states only, not medical outcomes.
- Right panel: DO NOW / step count, current step heading, full current instruction, one concise support line, Back (in left-panel header), Repeat, Next only when another step exists, End Session, and the existing SOS 112.
- Repeat visually re-displays the same current instruction and marks it “REPEATED”; no speech synthesis or audio playback is claimed.
- End Session calls the existing confirmation flow. Confirm returns to IDLE; Cancel returns to the previous guidance step.

## Fire / Smoke path

The seven steps are sourced in `medical-content-sources.md`:

1. Raise the alarm.
2. Use a safe exit.
3. Stay low in smoke while moving out.
4. Use stairs, not lifts.
5. Reach the designated assembly area and wait for the all-clear.
6. Do not re-enter until authorities advise it is safe.
7. Once outside and safe, contact 112 (integrated response) or 101 (Fire Services).

The pathway does not advise fighting a fire, operating firefighting equipment, investigating the source, entering smoke, checking rooms, attempting rescue, assessing exits, or drawing a route through the building. It does not claim to call emergency services. Fire / Smoke reuses the existing `OTHER_EMERGENCY` guidance state; no new state-machine enum or transition has been added.

## Interactive Preview checklist

1. Recompile TypeScript. Stop on any compiler error; capture the complete error text and file/line.
2. Confirm the new Inspector reference resolves to the existing `LifelineIncidentScenarios` component.
3. Open Preview and click / pinch one of the authored non-human stand-ins. Confirm the existing incident marker moves adjacent to that stand-in.
4. Activate Lifeline and follow the emergency-first 112 screen. Continue to category selection.
5. Select Person collapsed. Confirm the adult-collapse steps appear in both panels; check the adult-only boundary remains visible.
6. Return to category selection and choose Bleeding injury. Confirm the exact original bleeding copy and order are unchanged.
7. Select Fire / Smoke. Exercise all seven steps in order. Confirm 112 and 101 are displayed, and the final contact step explicitly says “once outside and safe.”
8. Select Other emergency. Confirm it still presents only the existing 112 / operator instructions.
9. Next: verify both the current instruction and overview status update. Previous steps become teal completed; the new step is amber current; later steps remain neutral upcoming.
10. Back: verify both panels return to the prior step and completed/current/upcoming statuses update consistently.
11. Repeat: verify the same instruction remains current, marked REPEATED, and no step advances.
12. Verify Next is absent on each pathway's final step.
13. End Session: confirm it opens the existing confirmation screen; Cancel restores the previous step; confirm returns to IDLE.
14. Verify SOS 112 remains visible and pinches correctly on the two-panel workspace and across all other active states. It activates Lifeline's existing emergency home; it does not place or verify a call.
15. Move the Preview camera around the authored stand-in. Check both panels remain grouped relative to the marker, do not overlap the stand-in, and remain readable in the binocular viewing region.
16. Re-select a different stand-in while the guidance group is active. Confirm both panels move together to the new marker.
17. Check that no second Frame has appeared in the Scene Hierarchy and that no packed package source has been modified.

## Required Preview screenshots

Capture and attach these six actual Preview screenshots after a clean compile:

1. Emergency selection: all four category cards and SOS 112.
2. Person collapsed: both panels with first adult-collapse instruction.
3. Bleeding guidance: both panels with first severe-bleeding instruction.
4. Fire / Smoke: both panels with a Fire / Smoke evacuation step and 112 / 101 contact context.
5. Other emergency: both panels with the 112 / operator fallback.
6. Completed-step state: advance at least once and show the left panel's completed check, current highlight and upcoming indicators.

The cloud session cannot open Lens Studio or capture genuine Preview screenshots. No screenshot, successful compile, or runtime pass is claimed here; this checklist is for local verification.

## LEAF

No LEAF scenarios or LeafIndex are authored or registered by this GitHub-only change. The local CLAD Live Lens Tester requires Lens Studio MCP to inspect the current installed LEAF package, attach LeafIndex, compile and execute scenarios. Use the official [Live Lens Tester](https://github.com/lens-studio-devs/ls-extensions/blob/main/plugins/ls-clad/agents/live-lens-tester.md), [scenario authoring skill](https://github.com/lens-studio-devs/ls-extensions/tree/main/plugins/ls-clad/skills/specs-leaf-write-scenarios) and [Preview run skill](https://github.com/lens-studio-devs/ls-extensions/tree/main/plugins/ls-clad/skills/specs-leaf-run-in-preview).

Recommended additional scenario IDs (planned, not registered):
- `ux_6_incident_anchored_two_panel_progress`: choose a stand-in, verify marker-relative panel grouping, Next / Back / Repeat and completed/current/upcoming state.
- `ux_7_fire_smoke_evacuation`: select Fire / Smoke, verify all seven ordered steps, 112 / 101 labels, conditional Next, and no fire-fighting / rescue instructions.
- `ux_8_two_panel_end_session_and_sos`: verify SOS remains accessible, End Session confirmation, Cancel, and confirmed return to IDLE.

Create and attach these additively to the existing AC-1..AC-4 LEAF coverage. Do not replace the existing tests or mark the planned IDs as runnable until the Live Lens Tester confirms they are registered. Run scenarios serially; treat the Lens-side scenario-manager PASSED / FAILED log line as authoritative.

## Verification boundary

This branch has been reviewed through GitHub source reads and the official public reference material. It has not been compiled in Lens Studio, executed in Interactive Preview, tested with SIK pinch, or run through LEAF by this cloud session.

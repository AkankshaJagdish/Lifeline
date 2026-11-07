# Lifeline acceptance criteria

**Status: none of the runtime criteria has passed.** Each criterion is binary and requires actual Lens Studio Preview or supported hardware evidence as described.

| ID | Done when | Verification | Current status |
|---|---|---|---|
| AC-1 Activation and emergency access | In Preview, manual pinch and the clearly labelled voice simulation enter the same emergency home; 112 and the helper alternative are immediately visible. | Interact with both controls and inspect the resulting screen. Simulation is not ASR evidence. | Scene authored in branch; compile/Preview pending. |
| AC-2 Call honesty | UI never claims a call was placed or confirmed by the platform; user acknowledgement appears only after explicit selection. | Inspect and exercise call instructions and acknowledgement. | Scene authored in branch; compile/Preview pending. |
| AC-3 Severe bleeding | Approved safety, help, barrier, direct pressure, maintain-pressure, and sourced follow-up steps appear one at a time; no packing or tourniquet instructions. | Walk the actual Preview sequence and compare each string with `medical-content-sources.md`. | Scene authored in branch; runtime path not verified. |
| AC-4 Adult collapse | Adult-only boundary, unresponsiveness and abnormal breathing/gasping guidance, emergency activation, verified adult compression guidance; no pulse check or paediatric CPR. | Walk the Preview path and compare each string with `medical-content-sources.md`. | Not yet — no runtime path. |

## Current validation snapshot — 2026-11-07

- Project target remains Spectacles; Lens Studio 5.23.2.26081320 Public.
- Installed packages remain SIK 2.0.0, UI Kit 2.0.0, LEAF 2.0.2.
- The user reports that the actual Lifeline project is confirmed and the prior TypeScript compilation issue was repaired. This cloud branch adds further scene/UI changes and has not yet been recompiled.
- The repository scene now serializes a Lifeline root, Input Adapters child, Instruction Panel child, and typed SceneObject input references. This is not yet Lens Studio or Preview verification.
- Voice activation is disabled pending successful visual-flow compile and Preview verification. Preview simulation and manual activation remain available in the authored UI.
- No runtime acceptance criterion has passed; LEAF and hardware ASR have not been run.

See `test-report.md` for the detailed test matrix. Do not mark a criterion passed until the Lens compiles, is integrated in the scene, and the actual interaction is exercised.

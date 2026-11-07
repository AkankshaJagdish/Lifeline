# Lifeline acceptance criteria

**Status: none of the runtime criteria has passed.** Each criterion is binary and requires actual Lens Studio Preview or supported hardware evidence as described.

| ID | Done when | Verification | Current status |
|---|---|---|---|
| AC-1 Activation and emergency access | In Preview, manual pinch and the clearly labelled voice simulation enter the same emergency home; 112 and the helper alternative are immediately visible. | Interact with both controls and inspect the resulting screen. Simulation is not ASR evidence. | Not yet — no integrated scene. |
| AC-2 Call honesty | UI never claims a call was placed or confirmed by the platform; user acknowledgement appears only after explicit selection. | Inspect and exercise call instructions and acknowledgement. | Not yet — compile/scene blocked. |
| AC-3 Severe bleeding | Approved safety, help, barrier, direct pressure, maintain-pressure, and sourced follow-up steps appear one at a time; no packing or tourniquet instructions. | Walk the actual Preview sequence and compare each string with `medical-content-sources.md`. | Not yet — no runtime path. |
| AC-4 Adult collapse | Adult-only boundary, unresponsiveness and abnormal breathing/gasping guidance, emergency activation, verified adult compression guidance; no pulse check or paediatric CPR. | Walk the Preview path and compare each string with `medical-content-sources.md`. | Not yet — no runtime path. |

## Current validation snapshot — 2026-11-06

- Project target: Spectacles; Lens Studio 5.23.2.26081320 Public.
- Installed packages observed: SIK 2.0.0, UI Kit 2.0.0, LEAF 2.0.2.
- Compile fails in LEAF sources because installed `Packages/Leaf 2.lspkg` does not satisfy `Leaf.lspkg/...` internal imports, and AI Preview Inspect examples import obsolete UIKit/SIK aliases.
- Current scene has no Lifeline app root or LEAF scenario index.
- A UI callback/controller method mismatch was corrected, but compilation remains blocked by package errors.

See `test-report.md` for the detailed test matrix. Do not mark a criterion passed until the Lens compiles, is integrated in the scene, and the actual interaction is exercised.

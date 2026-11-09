# Lifeline acceptance criteria

The four original acceptance criteria remain unchanged in scope. This branch records the user's report that the core Lifeline interaction passed actual Lens Studio Interactive Preview testing. The exact action-by-action results, screenshot, and runtime log were not supplied to this cloud review, so that report is recorded as user-reported evidence rather than independently verified evidence. No criterion below is marked independently passed by this session.

| ID | Done when | Verification | Current status |
|---|---|---|---|
| AC-1 Activation and emergency access | Manual pinch and the clearly labelled Preview voice simulation enter the same emergency home; India 112 and the helper alternative are immediately visible. | Exercise both controls in actual Interactive Preview; capture the emergency home and verify the label. Simulation is not ASR evidence. | User reports the core Preview interaction passed. Exact AC-1 actions and screenshot/log evidence are not attached; local evidence capture remains open. |
| AC-2 Call honesty | UI never claims a call was placed or confirmed by the platform; user acknowledgement appears only after explicit selection. | Exercise call instructions, return, and acknowledgement. Confirm the acknowledgement is separate from any claim that a call was placed. | Static source review finds no call-success claim in the UI code. Runtime interaction evidence is not attached; not independently passed here. |
| AC-3 Severe bleeding | Approved safety, help, barrier, direct pressure, maintain-pressure, and sourced follow-up steps appear one at a time; no packing or tourniquet instructions. | Walk every bleeding step in actual Preview and compare each displayed sentence with `medical-content-sources.md`. | Source-copy review completed. Full step-by-step Preview evidence is not attached; not independently passed here. |
| AC-4 Adult collapse | Adult-only boundary, unresponsiveness and abnormal breathing/gasping guidance, emergency activation, and reviewed adult compression guidance appear in sequence; no pulse check or paediatric CPR. | Walk every adult-collapse step in actual Preview and compare each displayed sentence with `medical-content-sources.md`. | Source-copy review completed. Full step-by-step Preview evidence is not attached; not independently passed here. |

## Cross-cutting MVP checks

These are required alongside the four criteria and are not new acceptance criteria:

- Other emergency displays only the 112 / emergency-operator fallback.
- Back, Next, Repeat, End Session, Cancel, and confirmed return to IDLE work.
- Emergency access remains available throughout active paths.
- The Preview simulation does not request or depend on microphone access.
- Optional ASR stops when an emergency session begins and only restarts after explicit session end and return to IDLE.
- The physical-person stand-in remains visible; the panel does not obstruct the central view; placement remains stable and readable while the Preview camera moves.
- No real call, patient recognition, diagnosis, or clinical performance is claimed.

## Current validation snapshot — 2026-11-07

- PR #1 and PR #2 are merged into the repository's default branch, `master`. The Lifeline scene root, Input Adapters child, Instruction Panel child, and typed SceneObject references are present in `Assets/Scene.scene`.
- The user reports that the core interaction passed actual Lens Studio Interactive Preview testing. This is user-reported; no screenshot or fresh logs were supplied in this cloud review.
- This verification branch changes optional ASR lifecycle/error handling and documentation. The changed TypeScript has not been recompiled in Lens Studio.
- The scene's serialized `voiceActivationEnabled` value remains false by default. Manual ACTIVATE and the labelled Preview simulation remain available.
- Snap's ASR API exposes `Unauthenticated`, `NoInternet`, and `InternalError` statuses. The official CLAD ASR skill cautions that short commands / keyword spotting are unreliable; voice remains optional and best-effort.
- No hardware ASR result is claimed.
- No LEAF scenarios or LeafIndex are registered in this repository. The official Live Lens Tester procedure requires Lens Studio MCP; that connection is unavailable in this cloud session, so LEAF authoring, attachment, installed-version verification, compilation, and execution are blocked.
- No real emergency call is implemented or claimed.

See `test-report.md` for the detailed evidence matrix and local test instructions. Do not change a status to passed until the corresponding interaction has actually been exercised and its evidence recorded.


## Additive spatial UI UX checks

These checks are additive to AC-1..AC-4 above and do not replace or expand the original medical-content acceptance criteria.

| ID | Done when | Verification |
|---|---|---|
| UX-1 Persistent SOS | SOS 112 is visible, inset within the comfortable upper-right interaction area, and manually activates Lifeline from IDLE and remains available throughout active states. | Exercise the control from IDLE, emergency home, category selection, guidance and cancellation; capture Preview evidence. |
| UX-2 Idle hierarchy | Idle shows Lifeline, “Emergency guidance, when every second matters.”, voice status, manual SOS and a discreet Preview-only simulation. | Preview screenshot and check that no long guidance or category grid appears while idle. |
| UX-3 Four simultaneous categories | Person collapsed, Bleeding injury, Fire / smoke and Other emergency are visible as four large 2 × 2 UIKit targets after the emergency-first screen. | Capture full grid and exercise all four selections. |
| UX-4 Existing-path preservation | Person and bleeding map to the existing approved pathways; Other emergency retains its 112 / operator fallback; Fire / Smoke uses only the new sourced evacuation copy. | Confirm callbacks and compare the unchanged medical text and new fire copy with `medical-content-sources.md`. |
| UX-5 UI readability and context | Larger typography, readable contrast, comfortable target sizes and central incident visibility are maintained. | Inspect Preview at neutral head position and while moving around the incident stand-in. |

Fire / smoke is selectable as a user-described category, but the unchanged baseline controller/state machine has no fire guidance state. The current implementation routes this selection to the existing “other emergency” fallback and does not claim a fire response.


## Additive two-panel guidance and Fire / Smoke checks

These checks extend the UI-specific UX criteria. They do not change original MVP acceptance criteria AC-1..AC-4 or claim clinical / fire-authority validation.

| ID | Done when | Verification | Current status |
|---|---|---|---|
| UX-6 Two-panel spatial guidance | A left ordered RESPONSE PLAN rail and right DO NOW panel render together around the selected incident marker. The two panels share a parent transform, keep the incident visible, and stay within the approved 30 × 20 cm envelope. | Select a non-human Preview stand-in, enter each guided path, move the Preview camera, change the selected stand-in and verify both panels move as one group. Capture screenshots for person, bleeding, fire and other. | Not run in this cloud session; local Preview verification required. |
| UX-7 Coordinated progress and navigation | Left rows show completed/current/upcoming states; Next and Back update both panels; Repeat does not advance; Next is absent on the last guided step; End Session uses confirmation and returns to IDLE only after confirmation. | Exercise forward/back navigation, Repeat, last-step behavior, End Session, Cancel and confirmed end. Capture a completed/current/upcoming screenshot. | Not run in this cloud session; local Preview verification required. |
| UX-8 Fire / Smoke evacuation | Seven ordered evacuation-only instructions appear, including alarm, safe exit, staying low in smoke while moving out, no lifts, assembly/all-clear, no re-entry and contact after safety. 112 and 101 are visible. | Walk every Fire / Smoke step and compare exact copy with the Fire / smoke section of `medical-content-sources.md`. Confirm no firefighting, investigation, smoke-entry, rescue or route-assessment advice appears. | Source review recorded; compile and runtime validation pending locally. |
| UX-9 Existing-path text preservation | Adult-collapse, severe-bleeding and other-emergency copy remains unchanged and appears in the new two-panel layout. | Compare every existing instruction string against the source register; inspect all steps in Preview. | Static source diff reviewed; runtime validation pending locally. |

**Implementation constraints:** Fire / Smoke reuses the existing `OTHER_EMERGENCY` guidance state; no state-machine enum was added. The left overview is display-only to avoid accidental step navigation. Progress indicators are navigation status, not claims about a medical outcome. A missing/unselected incident marker causes a safe fallback to the existing single-panel guidance; two-panel placement requires the Inspector input to be wired and a valid selected non-human marker.

**Verification boundary:** The branch has not been compiled or run in Lens Studio, no Preview screenshots were captured, and no LEAF tests were registered or executed by the cloud session. Do not mark UX-6 through UX-9 passed until the local evidence is attached.
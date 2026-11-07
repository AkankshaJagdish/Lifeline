# Lifeline build and validation report

Date: 2026-11-07

## Current verdict

**The Lifeline scene is integrated in merged `master`. The user reports that the core interaction passed actual Lens Studio Interactive Preview testing.** This cloud review records that as a user-reported result; the screenshot, fresh Logger output, and exact action-by-action results were not supplied here.

This verification branch hardens the optional ASR lifecycle and fallback messaging and updates the project documentation. The new TypeScript has not been recompiled or run in Lens Studio from this cloud session. Do not treat repository edits or static inspection as a compile/runtime pass.

**LEAF is blocked in this session.** The official `live-lens-tester` agent and LEAF authoring/run skills require Lens Studio MCP. No Lens Studio MCP tools are available here, and the official live-lens-tester instructions say to stop rather than fall back to shell or repository-only authoring. Therefore no LEAF scenarios were created, no LeafIndex was attached, the currently installed LEAF version was not re-verified, and no LEAF results are claimed.

## Baseline and scope

- Repository default branch is `master`; PR #1 and PR #2 are merged.
- The merged scene file contains `Lifeline Experience`, `Lifeline Input Adapters`, and `Lifeline Instruction Panel`.
- The scene serializes the controller and adapter inputs as typed SceneObject references.
- Project target remains Spectacles; project version metadata remains Lens Studio 5.23.2.26081320 Public.
- The original Game Plan file was not edited.
- No feature beyond the fixed MVP was added. The code change in this branch is limited to optional ASR session lifecycle and failure handling.

## Official sources reviewed

### SPECS / CLAD workflow

- [SPECS Experience Builder and agents/skills](https://github.com/lens-studio-devs/ls-extensions/blob/main/plugins/ls-clad/agents/specs-experience-builder.md)
- [Live Lens Tester agent](https://github.com/lens-studio-devs/ls-extensions/blob/main/plugins/ls-clad/agents/live-lens-tester.md)
- [Verify Preview skill](https://github.com/lens-studio-devs/ls-extensions/tree/main/plugins/ls-clad/skills/verify-preview)
- [Preview Inspection skill](https://github.com/lens-studio-devs/ls-extensions/tree/main/plugins/ls-clad/skills/preview-inspection)
- [LEAF scenario authoring skill](https://github.com/lens-studio-devs/ls-extensions/tree/main/plugins/ls-clad/skills/specs-leaf-write-scenarios)
- [LEAF Preview run skill](https://github.com/lens-studio-devs/ls-extensions/tree/main/plugins/ls-clad/skills/specs-leaf-run-in-preview)
- [Learn AR with SPECS plan-lens skill](https://github.com/challengepost/learn-specs/blob/main/skills/plan-lens/SKILL.md), [AR design rules](https://github.com/challengepost/learn-specs/blob/main/skills/plan-lens/references/ar-design-rules.md), and [Preview limits](https://github.com/challengepost/learn-specs/blob/main/skills/plan-lens/references/preview-limits.md)

The Live Lens Tester requires Lens Studio MCP for current package verification, scene inspection, LeafIndex attachment, compile, and scenario execution. Its instructions explicitly require stopping when MCP is unavailable. This is why LEAF work is blocked here rather than approximated.

### ASR API and official samples

- [Snap ASR Module API](https://developers.snap.com/spectacles/about-spectacles-features/apis/asr-module)
- [CLAD ASR skill](https://github.com/lens-studio-devs/ls-extensions/blob/main/plugins/ls-clad/skills/specs-asr/SKILL.md) — explicitly cautions that ASR is not recommended for voice commands / keyword spotting because short trigger words are often misrecognized.
- [Official Agent Manager VoiceInputController.ts](https://github.com/specs-devs/samples/blob/main/Agent%20Manager/Assets/Scripts/Input/VoiceInputController.ts)
- [Official Agent Manager AgentInputBar.ts](https://github.com/specs-devs/samples/blob/main/Agent%20Manager/Assets/Scripts/UI/AgentInputBar.ts)
- [Official SPECS samples repository](https://github.com/specs-devs/samples)

The API uses transcription update and error callbacks, and documents the `Unauthenticated`, `NoInternet`, and `InternalError` statuses. The Agent Manager sample stops transcription on final/error events and gives a clear fallback when camera + internet permissions prevent microphone access unless Extended Permissions are enabled. The CLAD ASR skill cautions against using ASR as a reliable short-command / keyword-spotting system. Lifeline therefore keeps voice optional and best-effort, with manual pinch fallback.

### Spatial design and Preview

- [Snap design best practices](https://developers.snap.com/spectacles/best-practices/design-for-spectacles/design-best-practices)
- [Snap positioning and sizing](https://developers.snap.com/spectacles/best-practices/design-for-spectacles/positioning-sizing-content)
- [Snap designing for movement](https://developers.snap.com/spectacles/best-practices/design-for-spectacles/designing-for-movement)
- [Snap Preview Panel](https://developers.snap.com/spectacles/get-started/start-building/preview-panel)
- [Google: Early Challenges in AR UX](https://design.google/library/early-challenges-in-ar-ux)
- [Google: Designing for Transparent Screens](https://design.google/library/transparent-screens)
- [Google Glass design principles](https://developers.google.com/glass/design/principles)
- [Meta hand interaction best practices](https://developers.meta.com/horizon/design/hands-best-practices)
- [Microsoft Holographic Frame](https://learn.microsoft.com/en-us/windows/mixed-reality/design/holographic-frame)

## Design review against Learn AR with SPECS

| Requirement | Current design decision | Review status |
|---|---|---|
| Use a real strength of glasses | Keeps the physical situation in the user's view while leaving both hands available for help and pinch navigation. | Structurally aligned; actual unobstructed view requires fresh Preview evidence. |
| Avoid a website floating in front of the face | Uses one compact head-relative instruction card, not a full dashboard or patient-locked annotation. No patient recognition is claimed. | Deliberate safety tradeoff: patient-anchoring is excluded because recognition is not implemented. |
| Show content only when needed | Idle contains only activation/status controls; emergency content appears after activation; guidance is one instruction at a time. | Source/structure review aligned; timing and visual presentation require Preview evidence. |
| Few large targets; pinch as tap | UIKit Button controls, primary 5.6 cm, secondary 3.9 cm at 105 cm, 2 cm gaps. | Static dimensions align with Snap angular guidance; actual collider and pinch reach remain to be tested. |
| Keep content in view | Head-following panel, centred and slightly below natural gaze; initial position 105 cm and 8 cm below horizon. | Static transform/config review aligned; camera movement and stability not independently inspected in this session. |
| Comfortable viewing distance and scale | 105 cm detailed-content distance; panel capped at 30 × 20 cm. | Consistent with Snap's approximately 1 m detailed-content recommendation and far-field use. |
| Preview-demonstrable interactions | Manual pinch and labelled simulation are standard Preview paths; no patient recognition or live microphone behavior is required for the core Preview demonstration. | Static design review aligned; the user reports core Preview interaction passed. No screenshot attached here. |
| Voice fallback | Manual ACTIVATE remains available; voice is optional and disabled in the serialized scene by default. | Design decision aligned with Preview limitations and ASR reliability caveat. |
| Consent / privacy | No recording, identification, following, or patient recognition is implemented. | Source/code review aligned. |

Snap's current guidance recommends detailed content around 1 m, far-field use for more detailed content, centring within binocular overlap, targets of at least 2° and spacing of at least 1°. At the authored 105 cm distance, the primary 5.6 cm target is approximately 3.1°, the 3.9 cm secondary target approximately 2.1°, and the 2 cm gap approximately 1.1°. These are geometric checks only; they do not prove that the collider, hover feedback, or physical reach works in Preview.

## Medical copy and prohibited-content audit

The displayed guidance strings in `LifelineGuidanceContent.ts` were compared with the proposed exact copy and limitations in `devpost/medical-content-sources.md`. The current displayed copy is confined to the reviewed source categories: safe approach, emergency help / 112, barrier, direct pressure, maintain pressure, adding material over the first layer, leaving an embedded object in place and pressing around it, the narrow dressing follow-up, adult responsiveness, abnormal breathing including gasping, emergency activation, adult compressions, compression rhythm, and recoil.

A static scan of the current Lifeline UI, guidance, activation, and state scripts found no user-facing `911` text, no call-success wording, no diagnosis or patient-recognition feature, no pulse-check instruction, no pediatric/infant CPR instruction, no wound-packing advice, and no tourniquet advice. Negative safety statements in planning documents are not app instructions. The child/infant boundary remains adult-only and directs users to 112 / operator guidance; it does not introduce pediatric CPR.

The source register itself includes US-source caveats and explicit exclusions. Those references are not surfaced as app copy. Recheck the final rendered strings in Preview before public release.

## Changes in this verification branch

- Kept the scene's serialized `voiceActivationEnabled` value false by default.
- Added a stop-promise guard so a new ASR session waits for the previous stop operation to finish.
- Ignored late transcription callbacks after listening stops or while the controller is outside IDLE, preventing a delayed callback from re-entering an active session.
- Ensured voice stops when the controller enters any active emergency state.
- Restarted listening only when the state machine transitions from an active session back to IDLE; that transition is reached through the explicit end-session confirmation.
- Added distinct calm fallback copy for unauthenticated ASR, no internet, and internal/microphone/Extended Permissions failure.
- Kept the Preview simulation controller separate from ASR. Its action calls the shared controller directly and does not require microphone access.
- Updated README and project test/demo documents to remove stale claims that the Lifeline scene is absent from the merged branch.

**Compilation status for these changes: not run.** Lens Studio MCP and local Lens Studio are not available to this cloud session. Recompile locally before accepting this branch.

## Validation matrix

| Test / review | Result | Evidence / limitation |
|---|---|---|
| Repository baseline | Pass (repository inspection) | Merged `master` contains the Lifeline scene and UI integration. |
| User-reported core Interactive Preview | User-reported pass | User states core interaction passed actual Lens Studio Preview; screenshot, exact test log, and action-level breakdown not attached here. |
| Scene hierarchy / serialized references | Pass (static repository inspection) | `Assets/Scene.scene` contains the root, two named children, scripts, and typed SceneObject references. |
| ASR API / Agent Manager sample review | Pass (source review) | Snap API and official sample controller / error UI reviewed. |
| Optional ASR lifecycle changes | Authored; compile pending | Static code review only; no Lens Studio compile or hardware execution. |
| ASR stops on emergency entry | Code path reviewed; runtime pending | State listener stops listening for any non-IDLE state. |
| ASR restarts after explicit end | Code path reviewed; runtime pending | Restart is requested only on active-to-IDLE transition; stop Promise is awaited. |
| ASR unauthenticated fallback | Authored; runtime pending | `Unauthenticated` gets a manual-activation fallback. |
| ASR internet fallback | Authored; runtime pending | `NoInternet` gets a manual-activation fallback. |
| ASR permission/internal fallback | Authored; runtime pending | `InternalError` and start failure direct user to microphone / Extended Permissions and ACTIVATE. |
| Preview simulation microphone independence | Pass (static source review) | Simulation calls `activateEmergency("preview_simulation")` directly; no ASR reference. |
| Fresh TypeScript compile after this branch | Not run | No Lens Studio MCP or local editor in this cloud session. |
| RunAndCollectLogsTool / firstActivityAtMs | Not run | Requires live Lens Studio runtime. |
| Fresh Preview screenshot | Not captured | CapturePanelScreenshotTool is unavailable in this cloud session. |
| Exact Preview action matrix | User-reported core pass; detailed coverage pending | See local checklist below; do not infer every listed action from the phrase “core interaction passed.” |
| Physical stand-in visibility / central-view obstruction | Not independently verified in this session | Requires camera/Preview screenshot inspection. |
| Camera movement stability / readability | Not independently verified in this session | Requires moving the local Preview camera and inspecting actual render. |
| LEAF package version | Not re-verified | No live Lens Studio package query; older repository notes are not a current install check. |
| LEAF scenarios / LeafIndex | Blocked; not created | Official live-lens-tester requires Lens Studio MCP and directs stop if unavailable. |
| LEAF Preview runs | Blocked; not run | No registered Lifeline scenarios and no LEAF panel access here. |
| Hardware ASR | Not run | Requires compatible Spectacles hardware, OS, internet, authentication, and permissions. |
| Real emergency phone call | Not implemented / not tested | No call launch or verification claim. |

## Local verification instructions

1. Sync this branch / PR and open the exact `Lifeline.esproj` in Lens Studio 5.23.2.26081320 Public, targeting Spectacles.
2. Recompile TypeScript. If it fails, stop and send the complete inline diagnostics; do not proceed to Preview with an invalid build.
3. After a clean compile, run runtime log collection. Inspect errors, prints, and `firstActivityAtMs`.
4. Open or refresh Interactive Preview and capture a screenshot. Confirm the Lifeline panel is actually rendered and readable, the physical-person stand-in remains visible, and the panel does not block the central view.
5. Test ACTIVATE and `SIMULATION — trigger voice: EMERGENCY` separately. Verify both reach the same emergency home and that simulation works with voice disabled.
6. Test emergency home / 112, call instructions and return, explicit user acknowledgement, path selection, every severe-bleeding step, every adult-collapse step, other emergency, Back, Repeat, Next, End Session confirmation, Cancel, and confirmed end returning to IDLE.
7. Move the Preview camera around the stand-in. Check panel stability, readability, targeting feedback, and central-view obstruction.
8. Do not enable hardware ASR merely to make Preview work. If testing voice on compatible Spectacles, enable the scene input deliberately, verify OS / network / authentication / Extended Permissions, and record each ASR status separately. Do not claim ASR passed unless actual speech recognition succeeds on hardware.
9. For LEAF, first confirm the current installed package and LeafPlugin locally. The four planned scenario mappings are listed in README; no scripts are currently registered. The official Live Lens Tester needs Lens Studio MCP to author, attach, compile, and run them. Do not report LEAF pass until each scenario returns a clean succeeded result and the Lens-side scenario-manager log confirms it.

## Preservation checks

- Original `codexsources/GAME PLAN do not change arwithspecs.txt`: untouched.
- `.esproj`, Lens Studio version, and Spectacles target: unchanged.
- LEAF, SIK, UI Kit, and AI Preview Agent Inspect package sources: not modified.
- India (`IN`), emergency number 112, medical safety boundaries, and MVP scope: unchanged.
- No new medical advice, patient sensing, emergency calling, or additional feature path introduced.
- No successful ASR hardware test, LEAF pass, fresh compile, or fresh screenshot is claimed by this cloud session.

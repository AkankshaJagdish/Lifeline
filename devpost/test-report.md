# Lifeline build and validation report

Date: 2026-11-09

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
- [Official Agent Manager InputBarController.ts](https://github.com/specs-devs/samples/blob/main/Agent%20Manager/Assets/Scripts/UI/Input/InputBarController.ts)
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
- Added a stop-promise guard so a new ASR session waits for the previous stop operation to finish; if stop fails, automatic voice restart is blocked and the manual fallback remains available.
- Ignored late transcription callbacks after listening stops or while the controller is outside IDLE, preventing a delayed callback from re-entering an active session.
- Ensured voice stops when the controller enters any active emergency state.
- Restarted listening only when the state machine transitions from an active session back to IDLE; that transition is reached through the explicit end-session confirmation.
- Added distinct calm fallback copy for unauthenticated ASR, no internet, and internal/microphone/Extended Permissions failure.
- Kept the Preview simulation controller separate from ASR. Its action calls the shared controller directly and does not require microphone access.
- Updated README and project test/demo documents to remove stale claims that the Lifeline scene is absent from the merged branch.

**Compilation status for these changes: not run.** Lens Studio MCP and local Lens Studio are not available to this cloud session. Recompile locally before accepting this branch.

## Medical-copy source recheck — 2026-11-07

The displayed bleeding instructions were compared against the original IFRC 2025 PDF, not only the local source register. The relevant IFRC severe-bleeding pages confirm scene safety (general approach, pp. 114–115), direct manual compression, emergency services and self-protection with gloves / improvised barriers, the use of a second dressing over the first when blood soaks through, pressure around an embedded object without removing it, and that a bandage may be applied once severe bleeding is controlled (pp. 255–257). This supports each displayed bleeding line in `LifelineGuidanceContent.ts`; no tourniquet or wound-packing advice was copied into the Lens.

The AHA 2025 Adult Basic Life Support guideline confirms that an unresponsive adult with absent or abnormal breathing, including gasping, should be treated as cardiac arrest by a lay rescuer; the recognition guidance does not require a lay rescuer pulse check. It also supports emergency response activation, chest compressions at 100–120/min, and complete chest-wall recoil. The displayed content stays adult-only and omits depth measurement, ventilation ratios, AED instructions, and paediatric/infant CPR.

The National Portal of India Helpline page currently lists 112 as the Integrated Helpline / Emergency Response Support System for police, fire and rescue, and health services. The MHA ERSS page remains the primary source cited in the source register; the National Portal listing independently corroborates the India-specific number.

This is a source-to-copy audit, not clinical approval or proof that the final Lens runtime displays the text correctly. Runtime verification remains outstanding.

## Repository LEAF snapshot

The current repository tree contains the editor-side `LeafPlugin` folder, but the committed `MCP-Export/03-packages/installed-packages.json` export lists five package entries and does not identify a LEAF package or version. The committed `MCP-Export/07-mcp/leaf-scenarios.json` is an error response stating that the LEAF panel was not open; it is not a scenario inventory. Therefore the current installed `Leaf.lspkg` version and the live `LeafPlugin` installation cannot be established from this repository snapshot. The live Lens Studio Asset Browser / Plugin Manager must be checked locally, as required by the official install skill. No package source was edited.

The official SPECS samples repository was checked directly. The exact files reviewed are:
- `Agent Manager/Assets/Scripts/Input/VoiceInputController.ts`
- `Agent Manager/Assets/Scripts/UI/AgentInputBar.ts`
- `Agent Manager/Assets/Scripts/UI/Input/InputBarController.ts`

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


## Verification round — 2026-11-09 (cloud-only source audit)

### Environment and scope

- Repository: `AkankshaJagdish/Lifeline`; default branch: `master`.
- PR #11 (`Add two-panel guidance and Fire / Smoke pathway`) is merged. Merge commit: `a510115e0f0844aa05e82de896e183027e0b6c0c`.
- The merged PR head has no GitHub Actions workflow runs and no GitHub commit status checks attached. This is not a Lens Studio compile or runtime result.
- Available connection in this session: GitHub repository access. No Lens Studio MCP namespace, local Lens Studio editor, active Preview panel, runtime capture, or local filesystem for the user's working Lens is available.
- Read the official `verify-preview/SKILL.md`, `lens-studio-field-notes/SKILL.md`, `agents/live-lens-tester.md`, `specs-leaf-write-scenarios/SKILL.md`, `specs-leaf-write-scenarios/references/leaf-reference.md`, and `specs-leaf-run-in-preview/SKILL.md` from `lens-studio-devs/ls-extensions`.

### Actual cloud outcomes

| Check | Outcome | Evidence |
|---|---|---|
| PR / merged revision | PASS — repository state | GitHub reports PR #11 closed and merged, with merge commit above. |
| Required code and docs exist on master | PASS — source presence | Read back `LifelineEmergencyUI.ts`, `.meta`, `LifelineTypes.ts`, `LifelineGuidanceContent.ts`, README, acceptance criteria, source register, and two-panel test plan. |
| Fire copy source review | PASS — source review only | Seven fire steps and source scope / exclusions are present in `medical-content-sources.md`. |
| Existing adult / bleeding text preservation | PASS — static source review only | Read back both existing guidance arrays; their instruction text remains the same as the pre-two-panel implementation. |
| Current serialized scene supports Lifeline walkthrough | BLOCKED | `Assets/Scene.scene` begins with Camera Object and Lighting. Its serialized hierarchy does not contain `Lifeline Experience`, `Lifeline Input Adapters`, `Lifeline Instruction Panel`, or `LifelineIncidentScenarios`. Prior spatial test documentation also warns that this is not the working local scene. |
| Inspector references / Editor-only FOUND controls | BLOCKED | The merged UI metadata has the new `incidentScenariosObject` input, and preview controller exposes `foundPerson()`, `foundInjury()`, `foundFire()`. The current serialized scene does not show those components wired. User's known-good scene must be opened and checked locally. |
| TypeScript compile | BLOCKED | Not run; no `RecompileTypeScriptTool` / Lens Studio MCP available. |
| Runtime initialization / logs | BLOCKED | Not run; no `RunAndCollectLogsTool` or running Preview. |
| Preview visuals / interaction | BLOCKED | Not run; no `CaptureRuntimeViewTool`, `PreviewInteractTool` or `InjectPreviewGesture` connection. No actual screenshot returned. |
| LEAF package / plugin / registration | BLOCKED | Not inspected in a running editor. Repository contains no registered Lifeline `LeafIndex` or scenario classes. |
| LEAF execution | BLOCKED | No Lens Studio MCP; official Live Lens Tester explicitly says STOP when MCP is unavailable. No scenario-manager PASS / FAIL lines exist. |
| Continuous demo recording | BLOCKED | No running Preview capture or video tool is available. |
| Hardware ASR / Spectacles | NOT RUN | No Spectacles hardware or hardware log evidence. |

### Official `/verify-preview` procedure reviewed

The official skill is `plugins/ls-clad/skills/verify-preview/SKILL.md`. It uses the See-and-fix loop in `lens-studio-field-notes`: `RecompileTypeScriptTool` (read compiler diagnostics), `RunAndCollectLogsTool` (record error baseline and compare new errors), `CaptureRuntimeViewTool` (inspect actual pixels), drive one interaction using `PreviewInteractTool` or `InjectPreviewGesture`, capture again, inspect logs, then fix and re-capture. If Preview state is dirty, reset it first and re-discover object uniqueIds after reset. Capture object-framed and scene-wide views as appropriate; use two timestamps for animated elements. Never treat a stale screenshot as evidence.

**Cloud execution result:** BLOCKED at the first editor-dependent operation. The skill was read and the workflow was documented; no compile, reset, runtime capture, interaction, log collection or screenshot was run.

### Official Live Lens Tester / LEAF procedure reviewed

The official `plugins/ls-clad/agents/live-lens-tester.md` says to check the Lens Studio MCP first and STOP if no tools are present. It then requires: verify/install `Leaf.lspkg` through the LEAF package skill; compile; read the LEAF Reference; inspect the scene and confirm exact object names; author focused scenarios with observed assertions; add `createIKInteractor()` reachability coverage for reach-sensitive UI; append/register scenarios through `LeafIndex`; attach LeafIndex to the scene through MCP; compile; verify LeafPlugin `com.snap.leaf.LeafPlugin`; open the LEAF panel; list scenarios; run each scenario serially.

The official run skill states that each scenario execution resets the Lens scene, so parallel runs can abort one another. Only a clean returned `succeeded` status plus the matching Lens-side scenario-manager PASSED line counts as PASS. On failure or timeout, set a log baseline, rerun only with explicit debugging intent, inspect the log slice and report the verbatim scenario-manager FAILED / RUNS line; do not automatically retry or cite a lagging plugin UI line as proof of success.

**Cloud execution result:** BLOCKED at the required MCP availability check. No package install, scenario authoring, LeafIndex attachment, Preview run, or LEAF result was attempted. This follows the official STOP rule.

### Local known-good scene integration gate

1. Open the known-good Lifeline scene in the exact project, not the checked-in `Assets/Scene.scene` export. Confirm the expected root, Input Adapters and Instruction Panel hierarchy in Lens Studio.
2. Confirm `LifelineEmergencyUI.controllerObject` and `activationAdaptersObject` reference the existing controller / input-adapter objects.
3. Wire `LifelineEmergencyUI.incidentScenariosObject` to the SceneObject containing the `LifelineIncidentScenarios` ScriptComponent.
4. Confirm `LifelinePreviewSimulationController.incidentScenarios` references that same ScriptComponent. Keep preview simulation Editor-only.
5. Add or confirm visibly labelled Preview-only FOUND PERSON / FOUND INJURY / FOUND FIRE controls wired to the existing methods. Assign the `incidentMaterial` required by the scenario script.
6. Confirm the actual user-selectable incident targets and marker are created, then compile. Do not edit package source.

### Evidence to append after local run

- Lens Studio version and selected target / Preview mode.
- Complete TypeScript compiler result.
- Runtime log baseline and post-run log excerpt; quote every remaining error verbatim.
- Six actual Preview screenshots required by `two-panel-fire-guidance-test-plan.md`.
- Per-scenario LEAF returned status and matching Lens-side scenario-manager PASSED / FAILED line.
- Video file or shareable recording link and its duration.
- Hardware tests reported separately from Preview. Never infer real ASR from the labelled Preview simulation, or claim an emergency call was placed.

**Current verdict:** Source review complete; end-to-end Preview and LEAF remain BLOCKED pending the known-good local scene and a connected Lens Studio MCP session. No compile, runtime, screenshot, LEAF or hardware pass is claimed by this cloud session.
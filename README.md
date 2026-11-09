# Lifeline

> **Current status:** The Lifeline root, input adapters, and UIKit instruction panel are integrated in the merged `master` scene. The user reports that the core interaction passed actual Lens Studio Interactive Preview testing. That result is recorded as user-reported; no screenshot or fresh runtime log was supplied to this cloud review. This verification branch hardens optional ASR lifecycle handling, but its new TypeScript changes still require a local Lens Studio compile and Preview check. LEAF scenarios have not been registered or run.

## Project overview

Lifeline is a hands-free first-aid companion prototype for ordinary bystanders in India. It keeps the India emergency number, 112, readily accessible and presents short, reviewed instructions one at a time so the bystander can keep looking toward the person and use both hands. Lifeline does not detect or diagnose a person, place a call, or replace emergency services.

## MVP behavior

- Manual pinch activation through the visible ACTIVATE control.
- Optional spoken “Emergency” activation through Spectacles ASR on compatible hardware. The scene input is disabled by default; manual activation remains available.
- A clearly labelled Preview-only control: `SIMULATION — trigger voice: EMERGENCY`. It exercises the same state transition without microphone access and is not an ASR test.
- Immediate India emergency access (112), including the instruction to call emergency services and the alternative to ask someone nearby to call.
- A separate user acknowledgement that must never be presented as proof that a call was placed or connected.
- Sequential severe-bleeding, adult-collapse / possible cardiac-arrest, and other-emergency paths.
- Back, Next, Repeat, End Session, and Cancel controls, with explicit confirmation before ending a session.

## Voice and permission boundaries

The Spectacles ASR API provides transcription, but the official CLAD ASR skill warns that short voice commands and keyword spotting are unreliable. Treat “Emergency” as an optional best-effort shortcut, not the only entry path. ASR requires compatible Spectacles hardware/OS, internet, authentication, and microphone permissions. For a Lens using camera plus internet, microphone access may require Extended Permissions.

The voice controller now stops listening when the emergency state begins. It only starts a fresh listening session after an active session returns to IDLE through explicit user confirmation. It waits for the previous stop operation before restarting; if stopping fails, voice remains off and manual ACTIVATE is the fallback. Unauthenticated, no-internet, and internal/permission failures also surface short fallback messages. This branch has not yet been compiled or hardware-tested. Do not describe Preview simulation as real ASR.

## Safety boundaries

- India region only for the current number: 112. It is not a universal emergency number.
- Lifeline does not place or verify a phone call.
- Follow emergency operator instructions; they take precedence over Lifeline.
- The guided CPR path is adult-only. No pediatric or infant CPR instructions are provided.
- No diagnosis, triage, patient recognition, camera-based assessment, pulse checks, wound packing, tourniquet instructions, medication advice, or advanced trauma techniques.
- Displayed medical copy is governed by [medical-content-sources.md](devpost/medical-content-sources.md). That register is not clinical validation or regulatory approval.

## Technology and project files

- Lens Studio 5.23.2.26081320 Public; target platform: Spectacles.
- TypeScript Lens source under `Assets/Scripts/Lifeline/`.
- Scene hierarchy in `Assets/Scene.scene`: `Lifeline Experience` root, `Lifeline Input Adapters`, and `Lifeline Instruction Panel`.
- The UI uses the installed Spectacles UIKit Frame, Button, ElementContent, FlexLayout, and FlexItem components; the main controller remains UI-independent.
- The current scene keeps voice activation disabled by default. Do not enable it for a Preview-only demonstration.
- Package sources and `.lspkg` contents are not modified by this verification branch.

## Open and verify locally

1. Sync this branch / PR into the Lifeline repository.
2. Open the exact `Lifeline.esproj` from this repository in Lens Studio 5.23.2.26081320 Public, targeting Spectacles.
3. Recompile TypeScript. If it fails, stop and share the complete inline compiler output before running Preview.
4. After a clean compile, collect fresh runtime logs and check errors, prints, and `firstActivityAtMs`.
5. Open or refresh Interactive Preview and capture a fresh screenshot. Inspect the actual rendered panel, the physical-person stand-in, central-view obstruction, text readability, and camera movement stability.
6. Exercise manual ACTIVATE and the labelled Preview simulation separately. Then test 112, call instructions, return, user acknowledgement, path selection, every guidance step, Back, Repeat, Next, End Session confirmation, Cancel, and confirmed return to IDLE.
7. Keep hardware ASR separate from Preview. Test it only on compatible Spectacles hardware with the required OS, internet, authentication, and permissions. Record the actual error/result; do not infer hardware behavior from simulation.

## LEAF status and local run instructions

**No Lifeline LEAF scenario files or LeafIndex are currently registered in this repository.** The four planned scenario mappings are:

| Acceptance criterion | Planned scenario ID | Coverage |
|---|---|---|
| AC-1 Activation and emergency access | `ac_1_activation_and_112` | Manual activation, Preview simulation, shared emergency home, immediate 112 |
| AC-2 Call honesty | `ac_2_call_acknowledgement_honesty` | Call instructions, explicit user acknowledgement, no platform call-success claim |
| AC-3 Severe bleeding | `ac_3_severe_bleeding_steps` | Every bleeding step, one at a time, plus Back / Next / Repeat |
| AC-4 Adult collapse | `ac_4_adult_collapse_steps` | Adult-only boundary, responsiveness, abnormal breathing including gasping, help first, adult compression steps |

These are planned IDs, not existing or runnable scenarios. The official Live Lens Tester procedure requires Lens Studio MCP to verify the installed LEAF package, inspect the scene, attach LeafIndex, compile, and run scenarios. The current repository snapshot's package export lists five packages but does not identify a LEAF package/version; it does contain a LeafPlugin folder, which is not proof of the currently installed LEAF package version. The live installed version must be checked in Lens Studio. This cloud session has no Lens Studio MCP connection, so no scenario files are being fabricated or claimed as registered.

### Create and run the scenarios locally

The official Live Lens Tester agent must be invoked from a CLAD session with Lens Studio MCP connected. It explicitly stops when that connection is absent.

1. Sync this branch / PR and open the exact `Lifeline.esproj` in Lens Studio. Start the coding agent in the project folder (the one containing `.esproj` and `.mcp.json`) and confirm the `lens-studio` MCP server is connected.
2. Invoke the official `live-lens-tester` agent. Ask it to use the four scenario IDs and acceptance-criterion mappings above, add only additive LEAF test files / LeafIndex, and not modify Lifeline runtime scripts, existing scene objects, project settings, or any `*.lspkg/` package source.
3. Let the agent verify the currently installed LEAF package and LeafPlugin, read the official LEAF Reference, inspect the actual scene objects, and compile after each change. Do not install or upgrade a different LEAF / SIK version merely to make a test pass.
4. Confirm that the agent registers all four scenarios in `LeafIndex.ts` and attaches that index to the scene. Because Lifeline's panel and pinch targets are reach-sensitive UI, the official LEAF Reference also requires at least one IK-interactor scenario to test actual reachability; include this coverage within AC-1 rather than inventing a fifth acceptance criterion. Use only object names confirmed by the scene inspection. The IDs above are a requested naming convention, not proof that scenarios already exist.
5. Open the LEAF panel from Window → LEAF, reset Preview to a clean state, and confirm all four registered scenarios appear.
6. Run scenarios **serially**, waiting for each to finish before starting the next. A scenario run resets the Lens; parallel runs can abort one another.
7. Treat the Lens-side scenario-manager PASSED / FAILED log line as authoritative. If a run times out or does not return a status, inspect the Lens Studio log using the official LEAF run procedure before retrying; do not infer success from the plugin UI alone and do not auto-retry.
8. Record the exact outcome and verbatim failure line in `devpost/test-report.md` and update `devpost/acceptance-criteria.md` only with observed results.

Official procedures: [Live Lens Tester](https://github.com/lens-studio-devs/ls-extensions/blob/main/plugins/ls-clad/agents/live-lens-tester.md) · [LEAF scenario authoring](https://github.com/lens-studio-devs/ls-extensions/tree/main/plugins/ls-clad/skills/specs-leaf-write-scenarios) · [Run LEAF in Preview](https://github.com/lens-studio-devs/ls-extensions/tree/main/plugins/ls-clad/skills/specs-leaf-run-in-preview).

## Demo and public release

The under-three-minute recording sequence is in [demo-video-script.md](devpost/demo-video-script.md). Record only actual Preview behavior. Keep the physical stand-in visible, show the simulation label when using it, and disclose that it does not test ASR or a real emergency call.

Before public submission, use [submission-checklist.md](devpost/submission-checklist.md). Do not mark a compile, Preview, LEAF, hardware ASR, or medical-validation item as passed without its corresponding evidence. Recheck the public repository for secrets before release.

## Repository contents

- `Lifeline.esproj`, scene, project assets, and installed package references.
- Lifeline TypeScript source and setup files.
- `codexsources/` contains the supplied project research corpus, including the immutable Game Plan.
- `devpost/` contains the design brief, user journey, technical architecture, medical source register, safety boundaries, acceptance criteria, demo plan, test report, source audit, submission description, and final checklist.

The original `codexsources/GAME PLAN do not change arwithspecs.txt` is preserved unchanged.


## Spatial incident demonstration (new proposal branch)

The spatial-demo increment is on the draft PR branch. It adds three separate runtime-authored training targets (collapsed-person mannequin-style prop, forearm injury prop with restrained red stripe, and fire/smoke proxy), each with its own collider and SIK Interactable. Selecting a target moves the incident marker to an offset from that target's actual world transform.

- Runtime module: `Assets/Scripts/Lifeline/LifelineIncidentScenarios.ts`
- Preview-only selector methods: `foundPerson()`, `foundInjury()`, `foundFire()` on `LifelinePreviewSimulationController`
- Local scene attachment and verification: [spatial incident demo test plan](devpost/spatial-incident-demo-test-plan.md)

The scenario props are simplified low-poly training shapes, not generated anatomical GLBs. Assign a renderable project material to the `incidentMaterial` input. The scenario component must be attached beneath the actual working Lifeline Experience root, and the Preview controller's new `incidentScenarios` input must reference its ScriptComponent. Add a clearly labelled, Editor-only Preview panel with separate FOUND PERSON / FOUND INJURY / FOUND FIRE controls; these controls are not part of the live emergency UI.

The PR intentionally does not replace `Assets/Scene.scene`: the checked-in scene and the exported MCP scene snapshot do not match the documented working Lifeline hierarchy, and the MCP export identifies a temporary editor project path different from the repository workspace. Reconcile / attach in the known-good local scene rather than risk overwriting it.

No local Lens Studio compile, Preview screenshot, scene inspection or LEAF run has been performed by the cloud session. Follow the test plan and record actual outcomes before marking this spatial demo verified.


## Spatial UI redesign

The follow-on UI redesign keeps the existing Lifeline controller, state machine, activation adapters, emergency configuration and reviewed medical content. It retains the approved 30 × 20 cm Frame and changes the existing `LifelineEmergencyUI` composition to provide a persistent inset SOS 112 control, a cleaner idle introduction, larger role-based typography and a simultaneous 2 × 2 emergency category menu.

The four category selections route to existing pathways only: Person collapsed → adult collapse; Bleeding injury → severe bleeding; Other emergency → existing other path. Fire / smoke has no reviewed guidance or state in the existing state machine, so the selection routes to the safe existing fallback; no new fire instructions are added.

The four category cards currently use simple glyph placeholders because the repository has no `Assets/Icons/` directory and the cloud-only workflow cannot call the Lens Studio icon selector. Local compile and Preview checks are documented in [ui-redesign-test-plan.md](devpost/ui-redesign-test-plan.md). The branch has not been compiled or visually verified in Lens Studio by this cloud session.

# Lifeline

> **Current readiness: not ready to record or submit as a working Lens.** Lifeline's TypeScript source and planning materials are present, but the open scene is still the Spectacles Base Template, the Lifeline UI is not integrated into the scene, and Lens Studio compilation currently fails in installed package sources. See [`devpost/test-report.md`](devpost/test-report.md) for observed results. This README separates intended MVP behavior from what is actually verified.

## Project overview

Lifeline is a proposed hands-free first-aid companion for ordinary people in India who may be frightened and unsure what to do when someone nearby suffers severe bleeding or collapses. It is designed to keep the user's attention on the person and both hands available while presenting short, reviewed guidance and the India emergency number, 112. SPECS glasses can keep a glanceable instruction in the user's field of view without requiring the bystander to hold and look down at a phone. Lifeline does not detect or diagnose the person.

## Features and current implementation status

The following are the **specified MVP behaviors**. Their presence in project source is not evidence that they currently run: the scene integration and Preview journey have not passed validation.

- Emergency activation through a supported spoken “Emergency” command, with manual pinch fallback.
- India region configuration for emergency number **112**. It is India-specific, not a universal number.
- A visibly labelled Preview voice-trigger simulation that is intended to call the same state transition as spoken activation. It does not test microphone recognition.
- Short, sequential severe external bleeding guidance.
- A separate adult-only collapse / possible cardiac arrest guidance path.
- An “other emergency” fallback that prioritizes 112 and the operator's instructions.
- Step-by-step controls intended to support repeat, back, and next actions.

**Actual platform vs simulation:** No successful ASR hardware test or real emergency call was observed. No phone-call launch capability is claimed. Preview simulation, when available, is a test trigger only; it must never be presented as real microphone recognition. The current scene does not yet display the Lifeline UI.

## Safety boundaries

- Lifeline does not diagnose, triage, or determine a person's condition.
- It does not contact emergency services and does not replace emergency responders or professional care.
- Follow the emergency operator's instructions; they take precedence over Lifeline.
- The guided CPR pathway is for adults only. The MVP contains no paediatric or infant CPR instructions.
- The specified scope is severe external bleeding, adult collapse / possible cardiac arrest, and a generic other-emergency fallback.
- It does not provide medication advice, dosages, wound packing, tourniquet guidance, or other advanced trauma instructions.
- The medical copy and its references are recorded in [`devpost/medical-content-sources.md`](devpost/medical-content-sources.md). That register is not clinical validation or regulatory approval.

## Technology

- Lens Studio 5.23.2.26081320 Public; project target: Spectacles.
- TypeScript Lens source under `Assets/Scripts/Lifeline/`.
- Spectacles Interaction Kit (SIK) 2.0.0 and Spectacles UI Kit 2.0.0 are installed in the project.
- LEAF 2.0.2 is installed, but its current package path/import mismatch blocks compilation; no Lifeline LEAF scenarios have been integrated or run.
- CLAD skills, Lens Studio MCP, and Codex CLI were used in the development workflow. MCP inspection and project-open operations were observed; this does not imply a successful runtime build.

## Open and inspect the project

1. Install/open Lens Studio 5.23.2.26081320 Public or a compatible version that supports this project. Do not migrate the target automatically.
2. Open `Lifeline.esproj` from this folder. The manifest target is `Spectacles`. The current manifest metadata and scene still identify the Specs Base Template, not an integrated Lifeline Lens.
3. Allow Lens Studio to generate its local `Cache/` and `Support/` files; these are intentionally not versioned.
4. Check the Logger and compile status. At this snapshot, compilation fails on LEAF's `Leaf 2.lspkg` versus `Leaf.lspkg` imports and stale package aliases in AI Preview Agent Inspect example files. Until those are resolved through supported package workflows, a valid Lifeline Preview is unavailable.

## Preview and tests

The intended test flow, after successful integration, is:

1. Open Lens Studio's Preview panel and select the project's interactive Spectacles preview configuration.
2. Pinch the large manual activation control to enter the emergency home screen.
3. Use `SIMULATE VOICE: EMERGENCY` only as a clearly labelled Preview test control. It is not ASR evidence.
4. Check that the India number 112 appears immediately, then exercise the bleeding, adult collapse, and other-emergency paths with repeat/back/next.
5. Open the LEAF panel and run the persistent registered scenarios after they exist and compile.

**This test flow is not currently executable end to end.** No Lifeline screen or LEAF scenario is integrated into the current scene. Consult [`devpost/test-report.md`](devpost/test-report.md) and [`devpost/submission-checklist.md`](devpost/submission-checklist.md) for pass/fail/not-yet statuses. A checklist item is not complete merely because the corresponding source or document exists.

## Repository contents

- `Lifeline.esproj`, scene, project assets, and installed package archives.
- Lifeline TypeScript source and project setup files.
- `codexsources/` contains the supplied project research corpus, including the immutable Game Plan.
- `devpost/` contains the planning brief, journey, architecture, medical source register, safety boundaries, acceptance criteria, source audit, demo plan, test report, reconstructed prompt log, submission description, and final checklist.

The original Game Plan at `codexsources/GAME PLAN do not change arwithspecs.txt` is preserved unchanged. Local credentials, signing keys, generated caches, editor workspace state, and lock files are excluded by `.gitignore`.

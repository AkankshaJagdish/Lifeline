# Lifeline — technical architecture

**Implementation status checked 2026-11-07: scene and UI authored in the cloud branch; fresh Lens Studio compilation and runtime verification are pending.** The user's latest report says the actual Lifeline project is confirmed and TypeScript compilation was repaired before this scene pass. The changes described here have not yet been compiled or run in Lens Studio.

## Current project facts

- Project: `Lifeline.esproj`; Lens Studio 5.23.2.26081320 Public; target platform `Spectacles`.
- Installed packages remain unchanged: SIK 2.0.0, Spectacles UI Kit 2.0.0, LEAF 2.0.2. No `.lspkg` contents were modified.
- The existing Specs Base Template scene contains World Device Tracking and its SIK setup. The Lifeline scene now has one `Lifeline Experience` root at `(x=0, y=-8, z=-105)` cm, with two named children: `Lifeline Input Adapters` and `Lifeline Instruction Panel`.
- `LifelineController` is attached to the root. Manual activation, Preview simulation, and voice activation components are attached to `Lifeline Input Adapters`. `LifelineEmergencyUI` is attached to `Lifeline Instruction Panel`.
- All current `@input` contracts are SceneObject-typed and are serialized as SceneObject references: the adapters point to the controller root; the UI points to the controller root and the adapter child. No component-typed input is being wired through a SceneObject reference.
- The UI module uses installed UIKit `Frame`, `Button`, `ElementContent`, `FlexLayout`, and `FlexItem` components. The main controller does not construct UI. Labels use ElementContent layout hosts; layout children are explicitly registered with `FlexLayout.addItems()`.
- The instruction frame is head-following, initially authored at 105 cm viewing distance and 8 cm below the horizon. The Frame is capped at 30 × 20 cm; its content layout is 28.5 × 18.5 cm after the 0.75 cm inset. Primary targets are 5.6 cm; secondary targets are 3.9 cm; adjacent interactive targets are separated by 2 cm.
- Path selection shows one option at a time. Guidance shows one approved instruction at a time. Next is the primary action; Back, Repeat, and End Session are on a separate More Actions screen. Repeat visibly re-presents the current instruction.
- Voice activation is deliberately disabled in the scene until the basic visual flow compiles and runs. The Preview-only simulation remains editor-visible and calls the same emergency transition as manual activation. This does not test hardware ASR.
- The severe-bleeding path includes the reviewed follow-up about securing material with a dressing after severe bleeding is controlled. No medical content outside the reviewed sources was added.
- No actual phone-call launch or call confirmation is implemented. `I HAVE CALLED 112` remains an explicit user acknowledgement only.
- The serialized scene and script wiring have been edited in GitHub, but have not been loaded by Lens Studio in this environment. Do not treat repository serialization as evidence that the scene compiles or runs.

## Intended minimal runtime

1. **Single Lifeline controller** owns a small explicit state machine: `idle â†’ emergency â†’ help_acknowledged? â†’ bleeding | adult_collapse | other â†’ step_n â†’ handoff`. The actual screen state may not depend on inferred health status.
2. **Activation adapter** supports manual SIK pinch from idle and a Spectacles `AsrModule` transcription callback for the configured trigger phrase. The ASR event calls the same `enterEmergency()` transition as the manual control. ASR listening must be explicitly started/stopped and its listening state made clear; guard duplicate activations. Handle no internet, unauthenticated and microphone/Extended Permissions errors by preserving manual entry and showing a concise fallback.
3. **Preview adapter** exposes the clearly labelled `SIMULATION â€” trigger voice: EMERGENCY` control. It calls the same `enterEmergency()` state transition; it must never call a claim that a mic recognized speech.
4. **UI** uses installed SIK/UI Kit components and normal accessible SIK focus/hover/pinch patterns. It presents one instruction at a time and keeps 112 accessible. The lens does not require a custom collider UI or camera-based recognition.
5. **Content** is a small, static, versioned set of India region configuration and reviewed medical strings. `countryCode = "IN"`, `emergencyNumber = "112"`; the only user-facing localization in the MVP is India English. No network content fetch is required for instructions.
6. **Cadence aid** is optional, local, deterministic audio/visual rhythm at 100â€“120 compressions/minute. If stable timing and a clear stop/pause control cannot be validated, omit it rather than ship an inaccurate metronome. It does not measure compressions.
7. **LEAF** scenarios map to the four acceptance criteria when LEAF can open and the project compiles. Otherwise report which scenario could not run; do not describe a blocked test as passing.

## Voice and Preview facts

Snap documents `AsrModule` for Spectacles only, with Lens Studio 5.9+ and Spectacles OS 5.61+ prerequisites and transcription/error callbacks. The current editor version satisfies the stated editor minimum, but OS state and hardware behavior were not verified. The official Agent Manager `VoiceInputController.ts` starts/stops transcription, distinguishes partial/final transcript events, and surfaces errors. `AgentInputBar.ts` handles NoInternet and reports that microphone use can be disabled by the OS for a Lens with camera + internet unless Extended Permissions are enabled. Reuse only this narrow lifecycle/error pattern, not Agent Manager's architecture. Voice cannot be treated as guaranteed. The current cloud branch has not yet been recompiled after its UI and scene changes; the earlier package diagnostics are historical, not fresh compiler output.

Snap's Preview page documents additive rendering simulation for Spectacles (2024), interactive preview and device-type override. It does not establish that actual microphone input/ASR or emergency calling can be validated in the local Preview. The voice simulation is therefore a logic demonstrator only. [ASR Module](https://developers.snap.com/spectacles/about-spectacles-features/apis/asr-module) Â· [Preview Panel](https://developers.snap.com/spectacles/get-started/start-building/preview-panel)

## Emergency calling decision

No supported phone-call launch API was found in the official Spectacles documentation reviewed. Treat direct calling as unavailable/unverified for this project. A â€œCall 112â€ control must not be a fake button success; use a clear instruction to call using a phone or ask a nearby person. The independent â€œI have called 112â€ acknowledgement only records the user's manual confirmation in the UI.

## CLAD development sequence (later implementation phase)

Use the existing project and MCP connection. First resolve the current package example TypeScript import failure with a narrow, reviewed compatibility fix; recompile and establish Preview rendering. Then implement the smallest vertical path (manual activation â†’ 112 â†’ one route), validate placement in Preview, add the two fixed guidance paths, verify UI Kit/SIK pinch behavior, then author/run LEAF scenarios. Add ASR only after compile and hardware/OS constraints are confirmed; preserve manual activation regardless. Do not update Lens Studio, migrate targets, replace packages, or import the Agent Manager architecture as part of this plan.

## Official implementation references

- [CLAD](https://developers.specs.com/docs/clad), [agents and skills](https://developers.specs.com/docs/clad/overview-section/agents-and-skills), [development loop](https://developers.specs.com/docs/clad/how-clad-works), [LEAF](https://developers.specs.com/docs/clad/tools/test-your-lens-with-leaf)
- [Official SPECS samples](https://github.com/specs-devs/samples), including [Agent Manager voice controller](https://github.com/specs-devs/samples/blob/main/Agent%20Manager/Assets/Scripts/Input/VoiceInputController.ts) and [voice error UI](https://github.com/specs-devs/samples/blob/main/Agent%20Manager/Assets/Scripts/UI/AgentInputBar.ts); inspected current source. Reuse only narrow ASR lifecycle/error-handling patterns after compatibility check.
- [Essentials sample](https://github.com/specs-devs/samples/tree/main/Essentials)
- [Spectacles Interaction Kit](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/get-started), [Spectacles UI Kit](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-ui-kit/get-started)
- [Compatibility list](https://developers.snap.com/spectacles/about-spectacles-features/compatibility-list); do not infer SPECS 27 compatibility from Spectacles (2024) samples.




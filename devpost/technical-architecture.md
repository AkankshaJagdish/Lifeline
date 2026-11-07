# Lifeline — technical architecture

**Implementation status checked 2026-11-06: not runnable or validated.** This document separates the intended runtime design from the current project state. The source scripts are present, but the scene remains the Specs Base Template and does not contain a Lifeline root or LEAF scenario index. TypeScript compilation fails in installed package sources; no Lifeline Preview or LEAF test has passed.

## Current project facts

- Project: `Lifeline.esproj`; Lens Studio 5.23.2.26081320 Public; target platform `Spectacles`.
- Package versions from Lens Studio MCP: SIK 2.0.0, Spectacles UI Kit 2.0.0, LEAF 2.0.2.
- LEAF is present as `Packages/Leaf 2.lspkg`, while its TypeScript modules import `Leaf.lspkg/...`. Lens Studio MCP `renameAsset` returned `success:false` for the descriptor.
- AI Preview Agent Inspect examples import old `UIKit.lspkg` and `InteractionKit.lspkg` aliases. `RecompileTypeScriptTool` reports these and LEAF import errors; the Lifeline UI/controller method mismatch was fixed, but compile is still failing.
- The live scene is the Specs Base Template. It has no Lifeline app root or LEAF scenario index. Earlier `VirtualScene apply` failed with an immutable-model error; no alternate scene-writer was used.
- The project now has nine unique Lifeline TypeScript modules (and an identical extra `LifelineTypes 2.ts`). Source presence does not establish that components are registered or attached.
- Actual microphone ASR, emergency call placement, visual layout, and any full Preview journey remain unverified. No real phone call API or medical sensing is claimed. No TTS or cadence loop is implemented.
- Local Git was absent during initial audit. GitHub CLI (`gh`) is not installed, and no public remote URL is known.

## Intended minimal runtime

1. **Single Lifeline controller** owns a small explicit state machine: `idle â†’ emergency â†’ help_acknowledged? â†’ bleeding | adult_collapse | other â†’ step_n â†’ handoff`. The actual screen state may not depend on inferred health status.
2. **Activation adapter** supports manual SIK pinch from idle and a Spectacles `AsrModule` transcription callback for the configured trigger phrase. The ASR event calls the same `enterEmergency()` transition as the manual control. ASR listening must be explicitly started/stopped and its listening state made clear; guard duplicate activations. Handle no internet, unauthenticated and microphone/Extended Permissions errors by preserving manual entry and showing a concise fallback.
3. **Preview adapter** exposes the clearly labelled `SIMULATION â€” trigger voice: EMERGENCY` control. It calls the same `enterEmergency()` state transition; it must never call a claim that a mic recognized speech.
4. **UI** uses installed SIK/UI Kit components and normal accessible SIK focus/hover/pinch patterns. It presents one instruction at a time and keeps 112 accessible. The lens does not require a custom collider UI or camera-based recognition.
5. **Content** is a small, static, versioned set of India region configuration and reviewed medical strings. `countryCode = "IN"`, `emergencyNumber = "112"`; the only user-facing localization in the MVP is India English. No network content fetch is required for instructions.
6. **Cadence aid** is optional, local, deterministic audio/visual rhythm at 100â€“120 compressions/minute. If stable timing and a clear stop/pause control cannot be validated, omit it rather than ship an inaccurate metronome. It does not measure compressions.
7. **LEAF** scenarios map to the four acceptance criteria when LEAF can open and the project compiles. Otherwise report which scenario could not run; do not describe a blocked test as passing.

## Voice and Preview facts

Snap documents `AsrModule` for Spectacles only, with Lens Studio 5.9+ and Spectacles OS 5.61+ prerequisites and transcription/error callbacks. The current editor version satisfies the stated editor minimum, but OS state and hardware behavior were not verified. The official Agent Manager `VoiceInputController.ts` starts/stops transcription, distinguishes partial/final transcript events, and surfaces errors. `AgentInputBar.ts` handles NoInternet and reports that microphone use can be disabled by the OS for a Lens with camera + internet unless Extended Permissions are enabled. Reuse only this narrow lifecycle/error pattern, not Agent Manager's architecture. Voice cannot be treated as guaranteed. The current project compile blocker prevents a meaningful integration test.

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




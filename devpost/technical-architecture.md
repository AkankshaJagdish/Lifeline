# Lifeline — technical architecture

**Implementation status checked 2026-11-07:** The Lifeline scene and UIKit flow are present in merged `master`. The user reports that the core interaction passed actual Lens Studio Interactive Preview testing. This verification branch adds a narrow optional-ASR lifecycle/error-handling correction and updated documentation; those new changes have not been recompiled in Lens Studio from this cloud session. LEAF scenarios remain unregistered because the official Live Lens Tester requires a Lens Studio MCP connection that is unavailable here.

## Current project facts

- Project: `Lifeline.esproj`; Lens Studio 5.23.2.26081320 Public; target platform `Spectacles`.
- The scene hierarchy contains one `Lifeline Experience` root and two named children: `Lifeline Input Adapters` and `Lifeline Instruction Panel`.
- `LifelineController` is attached to the root. Manual activation, Preview simulation, and voice activation components are attached to `Lifeline Input Adapters`. `LifelineEmergencyUI` is attached to `Lifeline Instruction Panel`.
- All current `@input` contracts are SceneObject-typed and serialized as SceneObject references: the adapters point to the controller root; the UI points to the controller root and adapter child.
- The UI module uses installed UIKit `Frame`, `Button`, `ElementContent`, `FlexLayout`, and `FlexItem`. The main controller does not construct UI. Labels use ElementContent layout hosts; layout children are explicitly registered with `FlexLayout.addItems()`.
- The instruction frame is head-following, initially authored at 105 cm viewing distance and 8 cm below the horizon. The Frame is capped at 30 × 20 cm; content layout is 28.5 × 18.5 cm after the 0.75 cm inset. Primary targets are 5.6 cm; secondary targets are 3.9 cm; adjacent targets are separated by 2 cm.
- Path selection shows one option at a time. Guidance shows one approved instruction at a time. Back and Call 112 remain in the header on path-selection and guidance screens; Next is the primary action; Repeat and End Session are separated lower actions. End Session requires explicit confirmation; Cancel restores the active flow.
- Emergency home displays India 112, the instruction to call emergency services, and the alternative to ask someone nearby to call. The `I HAVE CALLED 112` control is user acknowledgement only.
- The Preview control is labelled exactly `SIMULATION — trigger voice: EMERGENCY`. It calls the same emergency transition as manual/voice activation without using the microphone.
- The serialized `voiceActivationEnabled` value remains false by default. Manual ACTIVATE and Preview simulation remain available.
- The original Game Plan, project manifest, target platform, and package sources are unchanged.

## Intended minimal runtime

1. **Controller:** `LifelineController` owns the explicit state machine: IDLE → emergency home → call instructions / acknowledgement → path selection → one of the three fixed paths → end/handoff → explicit end confirmation → IDLE. It does not infer health status.
2. **Manual activation:** SIK pinch calls the controller's shared `activateEmergency("manual")` transition. It remains available if ASR is disabled, unauthenticated, offline, or permission-blocked.
3. **Optional voice activation:** Spectacles `AsrModule` transcription checks for the configured word “Emergency” and calls the same controller transition. ASR is transcription, not dependable keyword spotting; voice is an optional best-effort shortcut, not the primary reliability assumption.
4. **Preview simulation:** The visibly labelled `SIMULATION — trigger voice: EMERGENCY` control calls `activateEmergency("preview_simulation")` directly. It has no dependency on ASR, microphone permission, network, or authentication.
5. **UI:** Installed SIK/UI Kit components provide buttons, layout, and targeting feedback. One instruction is shown at a time; 112 remains accessible during active paths.
6. **Content:** A small static set of India region configuration and reviewed medical strings. `countryCode = "IN"`, `emergencyNumber = "112"`. No network content fetch is required for the instructions.
7. **LEAF:** Four scenarios are planned to map to AC-1 through AC-4. No scenario source files or LeafIndex are currently registered. The official Live Lens Tester needs Lens Studio MCP to inspect exact objects, verify the installed LEAF package, attach LeafIndex, compile, and run; no substitute execution is claimed here.

## Voice lifecycle and fallback behavior

The voice controller is optional and is disabled in the serialized scene by default. When enabled on compatible hardware:

- It starts listening only while the controller is IDLE.
- Any transition into an active emergency state stops transcription.
- A late transcript callback is ignored if listening has stopped or the controller is no longer IDLE.
- A new ASR session is not started until the previous `stopTranscribing()` promise has completed. If that stop fails, the controller fails closed and leaves voice off; manual activation remains available.
- Listening restarts only on an active-session → IDLE transition, which follows the user's explicit End Session confirmation. Cancel returns to the active guidance state and does not restart listening.
- `Unauthenticated` shows an authorization fallback; `NoInternet` shows an internet fallback; `InternalError` / start failure directs the user to check microphone access or Extended Permissions. Each leaves ACTIVATE available.
- A failed ASR session does not block manual activation or the emergency UI.

Snap's ASR API documents transcription callbacks and the `Unauthenticated`, `NoInternet`, and `InternalError` statuses. The official Agent Manager sample stops transcription on final/error events and surfaces a permission fallback for camera + internet Lenses where the OS may disable microphone access unless Extended Permissions are enabled. The [CLAD ASR skill](https://github.com/lens-studio-devs/ls-extensions/blob/main/plugins/ls-clad/skills/specs-asr/SKILL.md) explicitly cautions that short commands / keyword spotting are unreliable. Hardware ASR has not been tested in this cloud session.

References: [Snap ASR Module](https://developers.snap.com/spectacles/about-spectacles-features/apis/asr-module) · [Agent Manager VoiceInputController](https://github.com/specs-devs/samples/blob/main/Agent%20Manager/Assets/Scripts/Input/VoiceInputController.ts) · [Agent Manager AgentInputBar](https://github.com/specs-devs/samples/blob/main/Agent%20Manager/Assets/Scripts/UI/AgentInputBar.ts).

## Learn AR with SPECS / spatial design review

The design uses two core strengths of glasses: sharing the user's view of the real scene and leaving hands free for assistance and pinch navigation. It does not anchor text to a patient or wound because patient recognition is explicitly out of scope. The UI is a compact head-relative card rather than a full dashboard; idle is restrained, active guidance is one-step-at-a-time, and the Preview demonstration uses only standard pinch interactions plus a clearly labelled simulation.

The 105 cm distance is near Snap's recommended approximately 1 m detailed-content plane. At 105 cm, the 5.6 cm primary target is about 3.1° angular size, the 3.9 cm secondary target about 2.1°, and the 2 cm spacing about 1.1°. The 30 × 20 cm panel fits within the documented far-field usable region at approximately 110 cm. These calculations are not a substitute for Preview inspection of actual colliders, binocular overlap, readability, head-follow stability, or physical-person obstruction.

The Learn AR with SPECS rules also emphasize show-only-when-needed, few large targets, content kept in view, and Preview-demonstrable criteria. The current layout is structurally aligned. Actual central-view obstruction and camera-movement stability still require the local Preview screenshot and camera test.

References: [Learn AR plan-lens skill](https://github.com/challengepost/learn-specs/blob/main/skills/plan-lens/SKILL.md) · [AR design rules](https://github.com/challengepost/learn-specs/blob/main/skills/plan-lens/references/ar-design-rules.md) · [Preview limits](https://github.com/challengepost/learn-specs/blob/main/skills/plan-lens/references/preview-limits.md) · [Snap design best practices](https://developers.snap.com/spectacles/best-practices/design-for-spectacles/design-best-practices) · [Positioning and sizing](https://developers.snap.com/spectacles/best-practices/design-for-spectacles/positioning-sizing-content) · [Designing for movement](https://developers.snap.com/spectacles/best-practices/design-for-spectacles/designing-for-movement).

## Emergency calling decision

No supported phone-call launch mechanism is implemented or claimed. A “Call 112” action displays instructions; it does not place a call. The separate “I have called 112” action records only the user's acknowledgement. Do not describe the UI as having contacted emergency services.

## Validation state

- The user reports that the core interaction passed actual Lens Studio Interactive Preview testing. No screenshot or fresh logs were supplied to this cloud review, so the result is user-reported and not independently re-run here.
- This branch's ASR lifecycle changes are authored but not recompiled in Lens Studio.
- No fresh runtime logs, `firstActivityAtMs`, screenshot, or camera-movement inspection are available here.
- LEAF installed-version verification, scenario authoring, LeafIndex attachment, and scenario runs are blocked by the missing Lens Studio MCP connection. The official Live Lens Tester procedure requires stopping in this situation.
- Hardware ASR and actual emergency calling have not been tested.

See `devpost/test-report.md` for the complete test matrix and local instructions. Do not mark an acceptance criterion passed without corresponding evidence.

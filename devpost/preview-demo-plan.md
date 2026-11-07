# Lifeline — Preview demo plan

**Goal:** Demonstrate the fixed Lifeline MVP in actual Lens Studio Interactive Preview without suggesting that Preview validates real speech recognition, patient detection, emergency calling, or medical performance.

## Current status

The user reports that the core Lifeline interaction passed actual Lens Studio Interactive Preview testing. No screenshot or fresh runtime log was attached to this cloud review. The current verification branch also changes optional ASR lifecycle handling and must be recompiled and regression-tested locally before recording.

## Demo setup

- Open the exact `Lifeline.esproj` in Lens Studio 5.23.2.26081320 Public.
- Select the project's Spectacles Interactive Preview configuration. Use the Preview mode supported by the installed Lens Studio version; do not force a different device override to work around a compile/runtime problem.
- Keep a neutral physical-person stand-in visible in the Preview scene. No recognition target or patient object is required.
- Keep the instruction panel centred, slightly below natural gaze, and compact enough not to obstruct the stand-in.
- Use the exact visible control: `SIMULATION — trigger voice: EMERGENCY`.
- Demonstrate manual ACTIVATE separately. Do not enable ASR for the Preview demonstration.

## Full interaction checklist

1. **Idle and activation:** Confirm the physical stand-in is visible. Use ACTIVATE, return to idle, then use the Preview simulation. Both must enter the same emergency home.
2. **Emergency help:** Confirm India 112 and the alternative to ask someone nearby to call appear immediately. Open call instructions, return, and explicitly select the user acknowledgement. Do not imply that Lifeline placed a call.
3. **Path selection:** Select each fixed path. Exercise NEXT OPTION and Back. Confirm Call 112 remains available.
4. **Severe bleeding:** Walk every step, one at a time. Exercise Next, Back, and Repeat. Compare each rendered sentence with `medical-content-sources.md`.
5. **Adult collapse:** Walk every step, one at a time. Confirm the adult-only boundary, responsiveness, abnormal breathing including gasping, help first, adult compression instruction, rhythm, recoil, and operator guidance. Confirm there is no pulse check or pediatric/infant CPR.
6. **Other emergency:** Confirm only the 112 / emergency-operator fallback appears.
7. **Session end:** Open End Session confirmation, choose Cancel / Keep Guidance, confirm the active path remains, then confirm End Session and verify return to idle.
8. **Spatial inspection:** Move the Preview camera around the stand-in. Inspect central-view obstruction, panel stability, text readability, binocular placement, target feedback, and whether the stand-in remains visible.
9. **Evidence capture:** Capture a fresh Preview screenshot and fresh runtime log. Record the exact actions tested and any failure. A screenshot proves only the rendered frame, not every interaction.

## Voice and simulation boundary

- Preview simulation calls the shared application transition directly and must work with voice activation disabled. It does not request microphone access and does not test speech recognition.
- Hardware ASR is optional. Test separately only on compatible Spectacles hardware after checking OS version, network, authentication, microphone access, and Extended Permissions.
- The current scene input `voiceActivationEnabled` remains false by default.
- Never describe simulated voice as real ASR. Never claim that Lifeline placed an actual emergency call.

## LEAF boundary

No Lifeline scenarios are currently registered. The official Live Lens Tester requires Lens Studio MCP to inspect the scene, verify the installed LEAF version, attach LeafIndex, compile, and run. It explicitly stops when Lens Studio MCP is unavailable. LEAF results must therefore remain blocked until a connected Lens Studio environment can perform that workflow.

## Demo capability disclosure

- Preview can demonstrate spatial placement, camera movement, and standard SIK pinch interactions when the current build runs.
- Preview cannot establish real ASR performance, patient/object recognition, breathing detection, wound recognition, medical diagnosis, compression sensing, a real 112 call, or emergency dispatch.
- Hardware comfort, real-world tracking reliability, and long-duration readability remain separate device/user checks.
- Do not claim a criterion passed unless the actual interaction was exercised and evidence recorded.

## Presentation rubric mapping

- **Design:** Show the one-step flow, compact readable placement, large pinch targets, continued view of the stand-in, and calm copy.
- **Technical implementation:** Show actual Preview interaction. Show LEAF results only after scenarios run and the Lens-side scenario manager confirms them. Distinguish the simulation from ASR.
- **Innovation / idea:** Explain the hands-free emergency context without claiming machine vision or emergency calling.
- **Presentation:** State the problem, demonstrate the full flow in a clear order, and disclose platform / medical limits plainly.

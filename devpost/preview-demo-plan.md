# Lifeline — Preview demo plan

**Goal:** Demonstrate the Lifeline interaction end to end without suggesting that Preview validates real speech recognition, patient detection, emergency calling, or medical performance.

## Demo setup

- Lens Studio Preview in Interactive mode, configured for the project-supported Spectacles target after resolving the existing compile issue.
- A clear neutral real-world stand-in in Preview; no recognition target. The user or presenter narrates that a bystander is facing a person who has collapsed or has severe bleeding.
- Camera movement may show the compact, slightly low, centred instruction card while preserving view of the stand-in.
- Visible control: `SIMULATION — trigger voice: EMERGENCY`.
- Also demonstrate manual pinch activation and pinch-based navigation. Do not need ASR hardware for the Preview path.

## One-minute sequence

1. **Problem (5–8 sec):** “A bystander is scared, needs both hands, and must keep watching the person.” Keep person/stand-in visible.
2. **Activate (5 sec):** Show the simulation label, click/pinch the simulation control, and show the same transition as manual activation. State: “Preview is simulating the voice trigger; it is not recognizing microphone speech.”
3. **Emergency action (8 sec):** 112 appears immediately with “Call emergency services now” and “Ask someone nearby to call 112.” Select “I have called 112” only as acknowledgement; explicitly note Lifeline does not place the call in this MVP.
4. **Bleeding route (10–12 sec):** Demonstrate one-step-at-a-time direct pressure guidance and pinch navigation, then return to emergency access.
5. **Adult CPR route (10–12 sec):** Show adult recognition wording (including gasping), emergency help first, no pulse check, and compression rhythm if timing is verified. Show child/infant boundary.
6. **Close (5 sec):** Reaffirm that Lifeline supports the bystander and the emergency operator/responder remains the authority.

## Preview capability disclosure

- Preview demonstrates layout, spatial placement, camera movement and SIK pinch interactions only to the extent they run in the current project build.
- The voice simulation triggers the shared state machine; it does **not** prove microphone access or ASR accuracy.
- Do not claim patient/object recognition, breathing detection, wound recognition, medical diagnosis, compression sensing, a real 112 call, or emergency dispatch.
- Actual ASR requires compatible Spectacles hardware/OS and internet/authentication per Snap docs; test separately on device if available.
- Current project Preview was not rendering during audit because TypeScript compilation failed. Do not record a successful Preview demo until this blocker is resolved and the actual Lens runs.

## Presentation rubric mapping

- **Design:** Show the one-step flow, readable placement, large pinch target, continued view of the person, and calm language.
- **Technical Implementation:** Show actual Lens Studio Preview interaction, CLAD/MCP work and LEAF results only after they run; distinguish the simulated voice event.
- **Innovation/Idea:** Explain the hands-free emergency context and meaningful cadence support without claiming machine vision.
- **Presentation:** State audience/problem before interacting; show the complete path in clear order; disclose call/recognition limits plainly.

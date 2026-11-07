---
status: draft
---

# Design brief: Lifeline

**Product specification; not evidence that the Lens is integrated or runnable.**  
**Target region:** India (`IN`)  
**Emergency number:** 112  
**Project target observed:** Spectacles; Lens Studio 5.23.2.26081320 Public  
**Planning date:** 2026-11-06

## Product statement

Lifeline is a calm, hands-free first-aid companion for an ordinary bystander who is frightened and unsure what to do when someone nearby is suddenly injured or collapses. It keeps the India emergency action immediately available and presents one short, source-checked step at a time, so the bystander can keep watching the person and use both hands.

Lifeline does not diagnose, detect a patient, assess severity, dispatch help, or replace emergency responders. It offers only the fixed MVP pathways below. The `112` number is India-specific and configurable as a region setting for later localisation; it is not universal.

## User and moment

- **Target user:** An untrained or minimally trained adult bystander in India.
- **Moment:** Someone nearby collapses or has a serious external bleed. The bystander is stressed, attention must remain on that person, and hands may be needed to help.
- **Why glasses:** The glasses preserve a view of the person, keep both hands free, and let the next short instruction stay in the user's glanceable field. Physical context remains visible behind the additive display. This is useful only if the overlay stays compact and does not obstruct the person.
- **Occupied Hands principle:** The bystander should not need to hold, look down at, or repeatedly operate a phone to receive sequential guidance. Emergency-service contact remains the priority, and Lifeline never claims it has contacted anyone unless a verified call mechanism actually succeeds.

## Spatial moment and layout

Show one compact, stable, head-relative instruction card centred and slightly below the user's natural forward gaze. Keep it inside binocular overlap and leave the central real-world view as open as practical. It is glanceable support, not a simulated scene overlay, patient marker, reticle, or floating dashboard. The card remains available while the wearer looks toward the person and does not require repeated head or arm movement.

Initial authored placement is **z = âˆ’105 cm** from the viewing origin, with the card centre **8 cm below** the forward horizon. Keep the card no wider than **30 cm** and no taller than **20 cm** at that distance; these are design starting measurements to verify in Preview and adjust if they block the person's view. Use a single text instruction at a time. Use a large primary pinch target approximately **6 cm** across at 105 cm, with at least **2 cm** clear spacing to adjacent targets. Avoid a row of competing choices. If a secondary action is needed, place it on a subsequent step or clearly separated lower action.

Snap's positioning guidance gives about 1 m as a detailed-content distance, describes the far-field usable view and recommends targets of at least 2Â° with 1Â° spacing; at about 110 cm, 6 cm is a recommended button size. The exact panel dimensions and offset above are proposed starting values, not a claim that one fixed placement is right for every wearer. [Positioning and sizing](https://developers.snap.com/spectacles/best-practices/design-for-spectacles/positioning-sizing-content) Â· [Design best practices](https://developers.snap.com/spectacles/best-practices/design-for-spectacles/design-best-practices) Â· [Designing for movement](https://developers.snap.com/spectacles/best-practices/design-for-spectacles/designing-for-movement)

## Product or overlay

- **Type:** A first-aid guidance product presented as a minimal overlay in the user's real view.
- **What the real version senses:** No patient or injury sensing. Hardware voice activation may recognize the spoken trigger through ASR; it does not inspect the emergency.
- **Preview stand-in:** A visibly labelled â€œSIMULATION â€” trigger voice: EMERGENCYâ€ control triggers the same state transition as the phrase. No real-world recognition stand-in is needed because the MVP does not claim recognition.

## Hands and input

- **Start/route/advance/acknowledge:** SIK/UI Kit pinch controls with visible hover/focus/selection feedback.
- **Targets:** Primary target starts at approximately 6 cm across at 105 cm viewing distance, spaced by at least 2 cm; verify in Preview.
- **Voice:** â€œEmergencyâ€ if supported on hardware; the manual â€œStartâ€ pinch does the same job. Preview simulation is clearly labelled and does not prove ASR.

## When things show

- **Idle:** A restrained manual â€œStartâ€ control is available; no medical content overlays the scene.
- **Emergency active:** 112 and the helper alternative appear immediately and remain readily accessible throughout every pathway.
- **Guidance:** Only the current instruction appears; the next step is revealed after pinch. No full pathway dump.
- **Unsupported pathway / child or infant:** Show the short 112 and operator instruction; do not show unrelated treatment content.
- **Attention out of view:** No arrow or sound is required; do not draw attention away from the person.

## Activation and interaction

- **Hardware voice entry:** â€œEmergencyâ€ is a proposed short activation phrase using the documented Spectacles `AsrModule`, subject to compatible device OS, internet availability, authentication, runtime permission, and actual device testing. The user can use manual pinch at any time.
- **Reliable fallback:** A prominent manual â€œStartâ€ pinch target is available before an emergency flow. The initial emergency state exposes 112 immediately; no questionnaire or injury choice comes first.
- **112 action:** Show â€œCall emergency services nowâ€ and the large India number â€œ112â€, with a concise alternative: â€œAsk someone nearby to call 112.â€ Include â€œI have called 112â€ as a user-confirmed acknowledgement only. It must not report success automatically. No documented phone-call launch mechanism was verified for this target, so this MVP does not claim or simulate a phone call.
- **Navigation:** One step at a time, using large SIK/UI Kit controls and clear hover/focus/selection feedback. Do not require speech after activation. Back and emergency number remain available; no complex menu tree.

## Fixed MVP scope

### 1. Emergency activation and help

`Emergency` voice activation on compatible Spectacles hardware (subject to later hardware verification), manual pinch fallback, immediate prominent 112, â€œask someone nearby to call 112,â€ and explicit user acknowledgement â€œI have called 112.â€ The card always makes clear that Lifeline itself has not placed a call.

### 2. Severe external bleeding

Sequential, short guidance: approach only if safe; get emergency help; use a barrier such as gloves if available; apply firm direct pressure with clean material or a dressing; maintain pressure. If blood comes through, put more material over the first layer and keep pressing. If an object is embedded, do not remove it; apply pressure around it. Once severe bleeding is controlled, a dressing/bandage may secure it. Keep 112 available throughout. Do not guide wound packing, tourniquets, hemostatic products, or other advanced techniques in this MVP.

### 3. Adult collapse / possible cardiac arrest

Adult-only path: check responsiveness; if the adult is unresponsive and not breathing normally (including gasping), treat this as possible cardiac arrest; activate emergency response first (ask another person to call 112 or use a phone), then begin adult chest compressions. Provide only short, source-grounded compression guidance and an optional dependable cadence aid at **100â€“120 compressions/minute**. Do not ask for or instruct a pulse check. Do not add pediatric or infant CPR steps. If the person is a child or infant, show: â€œThis guided CPR path is for adults. Call 112 and follow the emergency operatorâ€™s instructions.â€

### 4. Other emergency

Keep 112 available; instruct the user to call emergency services and follow the operator's instructions. No other medical pathway, diagnosis, or additional treatment advice.

## Preview stand-in and capability boundary

Provide an obvious Preview-only control labelled **â€œSIMULATION â€” trigger voice: EMERGENCYâ€**. It calls the exact same application transition as a final â€œEmergencyâ€ ASR transcript. The label remains visible in the simulation state or demo frame. This exercises state transitions only; it does not test a microphone, speech recognition, accuracy, or hardware permissions. Interactive Preview can demonstrate spatial placement, camera movement, and pinch interactions, but cannot prove that real-world recognition or patient understanding works. No patient/object recognition, injury classification, scene understanding, automated triage, or spatial patient anchoring is part of this MVP.

## Medical safety and content governance

India's Ministry of Home Affairs identifies 112 as the nationwide unified emergency number for police, fire, health and other emergencies. Bleeding content is limited to verified direct-pressure and barrier advice from IFRC's 2025 international first-aid guidelines. Adult CPR recognition and compression guidance is based on the AHA's 2025 adult BLS guideline, with population limits clearly stated. Every displayed medical sentence must match the reviewed wording in [`medical-content-sources.md`](medical-content-sources.md). If any line cannot be verified, omit it. Do not use 911 in India-facing UI.

## User journey

1. The bystander sees a collapse or injury and keeps looking toward the person.
2. They say â€œEmergencyâ€ on compatible hardware or pinch â€œStartâ€; Preview uses the explicitly labelled simulation control.
3. Lifeline immediately displays 112, â€œCall emergency services now,â€ and â€œAsk someone nearby to call 112.â€ The user can acknowledge â€œI have called 112â€; acknowledgement is not presented as proof of a connected call.
4. The user selects one of the two guided paths only after emergency contact has been surfaced: severe bleeding or adult collapse. For anything else, 112 and operator instructions remain the guidance.
5. Lifeline shows one concise step at a time; user advances by pinch while the physical situation stays visible. Emergency contact remains accessible.
6. In adult CPR, a simple cadence aid may run at 100â€“120/min. The Lens tells the user to continue following the emergency operator and does not claim to assess compression quality.

## Use of AR and Occupied Hands evaluation

| AR capability | Lifeline's role | Evidence/limit |
|---|---|---|
| Share the user's view of the real world | Additive display keeps the person in view while a small card presents the next step. | No video recording or patient recognition; keep overlay compact and visibly non-obstructive. |
| Draw meaningful content in the physical world | Stable, glanceable guidance is positioned in the user's view during the physical emergency; cadence feedback can accompany real compressions. | No patient-locked annotation or overlay on wounds in the MVP because recognition is not implemented or simulated as real. |
| Leave hands and body free | Voice activation plus pinch navigation; instructions do not require holding a phone or repeated large gestures. | Emergency-service contact may still require a phone or another bystander; do not imply the glasses make the call. |

**Assessment:** Strong fit for the Occupied Hands principle and meaningful AR use if the emergency number is immediate, guidance stays one-step-at-a-time, and the panel never masks the person. The limitation is that call placement is not established by the platform research; Lifeline helps the user reach a phone or recruit a helper but does not replace that need.

## Hackathon judging criteria

The official Learn AR with SPECS rules list four equally weighted criteria. [Official judging rules](https://learn-specs.devpost.com/rules)

| Criterion | Lifeline's evidence in the MVP |
|---|---|
| **Design** | A complete, humane end-to-end bystander flow; one concise instruction at a time; compact binocular placement; large reachable targets; clear safety boundaries. The user-journey and Preview demo should show all branches without a clinical dashboard. |
| **Technical Implementation** | Lens Studio and CLAD-managed project work, MCP use, SIK/UI Kit interactions, supported ASR integration behind a fallback, labelled simulation, and LEAF scenarios where the plugin works. Current snapshot has package compile errors and no Lifeline scene integration; do not claim technical implementation evidence until the Lens compiles, runs in Preview, and its interactions are verified. |
| **Innovation/Idea** | A glasses-native response to an occupied-hands emergency moment, integrating hands-free activation, world awareness without claiming machine perception, and optional physical compression cadence. Originality is in the interaction and context rather than invented medical AI. |
| **Presentation** | A short, clear end-to-end demonstration that identifies the untrained Indian bystander, shows 112 immediately, demonstrates the labelled Preview simulation and pinch navigation, then proves bleeding and adult CPR paths. State plainly that voice and calls are not proven by Preview. |

## Binary done criteria

1. **Activation and emergency access:** In Preview, both manual pinch and the labelled voice simulation enter the same emergency state; that state shows `112`, the instruction to call emergency services, and the helper alternative immediately, without a questionnaire.
2. **Call honesty:** The emergency UI offers a user-controlled â€œI have called 112â€ acknowledgement and never displays a placed/connected call success state from a simulation or unverified event.
3. **Bleeding path:** The severe-bleeding flow presents the reviewed safety, help, barrier, direct-pressure, continued-pressure, and dressing/embedded-object limits in the specified order, with 112 continuously reachable and no wound-packing/tourniquet steps.
4. **Adult CPR path:** The adult flow includes unresponsive plus absent/abnormal breathing including gasping, no pulse check, emergency activation before compressions, an explicit child/infant boundary, and no pediatric CPR instructions. If the cadence aid is included, a 30-second timing capture must show an average of 100â€“120 cues per minute; otherwise the cadence aid is omitted.

## Risks and open questions

- The installed project is Spectacles target, while its Preview configuration displayed `SPECS 27`; current documentation distinguishes Spectacles (2024) Preview guidance and SPECS 27 migration. The exact runtime/device compatibility must be confirmed before implementation; this plan does not authorize migration.
- Real ASR needs compatible hardware, OS, internet/authentication and microphone permissions; Preview only tests the labelled simulation.
- No supported phone-call launch mechanism was confirmed. Call initiation remains manual using a phone or another bystander.
- Current TypeScript compile errors and LEAF panel failure prevent proving a working Preview or automated scenarios today.

## References and build handoff

- [MHA ERSS / 112](https://www.mha.gov.in/emergency-response-support-system-erss)
- [IFRC International First Aid, Resuscitation and Education Guidelines 2025](https://www.ifrc.org/document/ifrc-international-first-aid-resuscitation-and-education-guidelines-2025)
- [AHA 2025 Adult Basic Life Support](https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-basic-life-support)
- [Snap ASR Module](https://developers.snap.com/spectacles/about-spectacles-features/apis/asr-module)
- [Preview Panel for Spectacles](https://developers.snap.com/spectacles/get-started/start-building/preview-panel)
- Supporting detail: [`user-journey.md`](user-journey.md), [`technical-architecture.md`](technical-architecture.md), [`medical-content-sources.md`](medical-content-sources.md), [`safety-boundaries.md`](safety-boundaries.md), [`acceptance-criteria.md`](acceptance-criteria.md), [`preview-demo-plan.md`](preview-demo-plan.md), [`source-audit.md`](source-audit.md).

### Build notes (preserved from the plan-lens workflow)

- Build for SPECS so it runs and can be demonstrated in Lens Studio's preview. No SPECS device is available.
- Use Spectacles Interaction Kit (SIK) and UI Kit for all interactions, so they work with the mouse in Interactive Preview and with LEAF.
- Build any stand-in exactly as described above, and keep it obvious in the scene.
- Use real-world scale in centimeters. Keep content inside the user's view during the main task.
- The display is additive: black renders as transparent. Don't rely on black or very dark content to be seen; keep text light and readable from where the user stands.
- Get the basic flow working first, then add detail.
- Write LEAF scenarios for each done criterion, run them in preview, and report which pass. Say which criteria have no test.
- Don't record, identify, or follow people.

### After the build: judge it

This part is for you, after CLAD finishes.

1. **Does it work?** Ask your agent which LEAF tests passed and which done criteria have no test.
2. **Walk around it.** Open the preview in Interactive Preview. Use WASD to move, Q and E to go down and up, and right-drag (or hold Shift) to look around. Clicking acts as a pinch. Stand where a user would and look at the task.
3. **Ask the three questions.**
   - Does it use what I'm looking at?
   - Does it put something in my space, where it belongs?
   - Does it free my hands or let me keep my eyes up?
   - Would it be just as good on a phone? If so, what would make it need the glasses?
4. **Check comfort.**
   - Everything I need is in view while I do the task. Nothing sits at the edges, behind me, or stuck to my face.
   - Every control is within reach of someone standing there.
   - Text reads easily from where I stand. No dark UI disappearing.
   - Things show when needed and get out of the way.
5. **Label what you know.** Write "logic proven" next to anything the tests and preview show working, and "feel unproven" next to anything only real glasses could tell you (comfort over time, real hand tracking, real recognition).
6. **Fix with design notes, not code.** Tell your agent what to change in design terms, for example: "Move the step card 15 cm lower and next to the pan. Make the Next button twice as big. Re-run the tests." If a fix takes under a minute, like nudging a panel, do it yourself in the scene.
7. **Submit.** Record a video under 3 minutes of your Lens in the preview, public on YouTube. Make your repo public with your Lens Studio project and this `devpost/` folder. Details are on the hackathon site: https://learn-specs.devpost.com/resources


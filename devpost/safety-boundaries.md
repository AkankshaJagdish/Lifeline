# Lifeline — safety boundaries

## What Lifeline is

A limited first-aid prompt companion for an untrained bystander in India. It keeps 112 available and presents reviewed, simple steps for severe external bleeding and adult collapse/possible cardiac arrest.

## What Lifeline is not

- Not a diagnostic or triage system; it does not identify a condition or judge severity.
- Not an emergency dispatch service and does not place/confirm a call.
- Not a replacement for emergency responders, an emergency operator, or formal first-aid training.
- Not a patient, wound, breathing, or scene-recognition system. It does not inspect the camera view to choose a pathway.
- Not a clinical dashboard, medical record, treatment recommender, or medication guide.
- Not pediatric or infant CPR instruction.

## Always-on rules for every flow

1. India configuration is `IN`, emergency number `112`; the UI must not describe 112 as universal and must not show 911.
2. Surface 112 before a user selects a pathway or answers any question.
3. State “Call emergency services now” and “Ask someone nearby to call 112.” The user can acknowledge “I have called 112”; the system must not claim a call was placed or connected.
4. If the user is unsure, the flow fails, or the emergency is outside scope: keep 112 available and tell them to follow the operator's instructions.
5. Keep the person's view open. A panel that blocks the person or causes the user to look away defeats the central safety and Occupied Hands purpose.
6. Show one short instruction at a time. No decorative animation, alarming countdown, gamification, or noisy UI.
7. Voice is optional. Manual pinch remains available when ASR, internet, authentication, or microphone access fails.
8. Preview voice is a visibly labelled simulation, never evidence of microphone recognition.
9. No external recording, upload, or sharing of patient imagery is part of this MVP.

## Path-specific limits

### Severe bleeding

- Approach only if safe; emergency help and practical barrier; direct pressure and maintaining it; only source-checked, basic follow-up.
- No wound packing, tourniquet, hemostatic dressing, pressure points, embedded-object removal, or improvised advanced procedure.
- Do not claim that the Lens sees bleeding, measures blood loss, or confirms it has stopped.

### Adult collapse

- Adult-only guided pathway. Recognition uses responsiveness and breathing; absent or abnormal breathing includes gasping. No pulse check.
- Call emergency services first, then adult chest compressions; provide a 100–120/min pace cue only if timing is validated.
- Do not claim to recognize cardiac arrest, measure compression depth, or assess CPR quality.
- Children and infants are outside the guided path. Call 112 and follow operator instructions.

### Other emergency

No extra advice: show 112 and direct the user to emergency services/operator instructions.

## Medical content governance

The exact proposed user-facing instructions and cited sections are in [`medical-content-sources.md`](medical-content-sources.md). Only those reviewed lines may enter the MVP. Re-check authoritative sources before implementation/release; remove any unsupported line. No generated or AI-written medical instructions.

## Failure handling

- **ASR error/offline:** calm unavailable message and manual pinch fallback; preserve emergency access.
- **Preview simulation:** visibly label simulation on trigger; never display an ASR success claim.
- **No phone integration:** show 112 and manual phone/helper direction; never simulate a connected call.
- **Tracking/interaction failure:** keep UI simple and retryable; do not gate emergency number behind tracking or scene understanding.
- **Unsupported population/condition:** return immediately to 112 and emergency operator guidance.

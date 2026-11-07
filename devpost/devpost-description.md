# Devpost project description (draft)

**Lifeline** is a hands-free first-aid companion prototype for SPECS glasses, designed for ordinary bystanders in India who may be frightened and unsure what to do when someone nearby experiences severe bleeding or an adult collapse. It follows the Occupied Hands principle: keep the India emergency number 112 readily available, present one concise, source-referenced instruction at a time, and let the bystander keep their eyes on the person rather than repeatedly looking down at a phone.

The fixed MVP includes manual pinch activation, an optional best-effort “Emergency” ASR trigger on compatible hardware, a clearly labelled Preview-only trigger simulation, an India-specific 112 emergency screen, sequential severe-bleeding and adult-only collapse guidance, and an other-emergency fallback. The scene uses Spectacles UIKit and SIK interactions. Preview simulation exercises the shared state transition but does not demonstrate microphone recognition. Lifeline does not place or verify emergency calls.

**Verification status:** The user reports that the core interaction passed actual Lens Studio Interactive Preview testing. The merged repository contains the Lifeline scene and UIKit flow. The current verification branch hardens optional ASR lifecycle and error fallbacks, but those changes still require a fresh local compile and regression Preview run. LEAF scenarios are not currently registered; the official Live Lens Tester workflow is blocked in this cloud session because Lens Studio MCP is unavailable. Hardware ASR has not been tested here.

Lifeline is not clinically validated or approved as a medical device. It does not diagnose, detect or recognize a patient, assess injury severity, measure CPR quality, or replace emergency services and operator instructions. The adult-collapse guidance is adult-only; advanced trauma advice, pediatric CPR, pulse checks, wound packing, and tourniquet instructions are outside the MVP.

## What we learned

Designing for glasses requires treating the real scene as the primary view: keep the overlay compact, show only the current instruction, and use large pinch targets rather than carrying a phone-style interface into the field of view. Preview can validate layout and interaction, but it cannot establish real speech recognition, patient recognition, emergency calling, or clinical performance. The Devpost Learn skill pack helped turn the concept into a bounded design brief; SPECS Experience Builder / CLAD supported the Lens scene and UI implementation.

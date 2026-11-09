# Lifeline — continuous Preview demo and submission plan

**Target duration:** 2 minutes 55 seconds.
**Recording format:** one continuous Lens Studio Interactive Preview recording; no composited UI, simulated outcomes, inserted screenshots or voice-over that implies untested behavior.

## Current readiness

The two-panel / Fire / Smoke implementation is merged in PR #11. This cloud session completed GitHub source review and read the official `/verify-preview` and Live Lens Tester / LEAF instructions. It did not access a running Lens Studio Preview, compile TypeScript, capture screenshots, collect runtime logs or execute LEAF.

The checked-in `Assets/Scene.scene` does not contain the documented Lifeline root / input / UI / incident-manager hierarchy. The recording must use the user's known-good local Lifeline scene after confirming the new Inspector references and Preview controls are wired. Do not record from the checked-in exported scene if it does not open the working hierarchy.

**Do not record a feature as working until its interaction has been exercised in the current Preview build.** If the build, scene wiring or a scenario fails, stop the take and resolve / document the issue before recording.

## Pre-recording gate

1. Open the known-good local Lifeline project and scene in the Lens Studio version selected for the hackathon. Confirm target platform and Preview mode. Record the exact editor version.
2. Confirm the root, Lifeline Controller, Input Adapters, Instruction Panel, incident scenario manager, marker and three non-human stand-ins are present in the running scene.
3. Confirm `LifelineEmergencyUI.controllerObject` and `activationAdaptersObject` are wired. Wire `incidentScenariosObject` to the SceneObject holding `LifelineIncidentScenarios`.
4. Confirm `LifelinePreviewSimulationController.incidentScenarios` references the same scenario component. Wire clearly labelled Editor-only FOUND PERSON / FOUND INJURY / FOUND FIRE controls to `foundPerson()`, `foundInjury()`, and `foundFire()`. Assign the required `incidentMaterial`.
5. Compile with Lens Studio. Save the exact successful compiler result. If there are TypeScript errors, stop.
6. Run the official `/verify-preview` See-and-fix loop: reset Preview if dirty; collect logs; capture the initial scene; inspect the real pixels; drive a real Preview interaction; capture again; inspect runtime logs. Fix and re-capture after any change.
7. Verify that all four emergency categories appear simultaneously, SOS is visible, each stand-in and marker is visible, both guidance panels render, and camera movement does not obscure the selected incident.
8. Run the LEAF scenarios locally and record their actual statuses. Do not display a PASS card for an unregistered or unrun test. Only the Lens-side scenario-manager PASS line paired with a clean returned `succeeded` result counts.
9. Capture the six screenshots in the two-panel test plan. They are evidence snapshots, not substitutes for exercising the full interaction.

## Continuous recording script (2:55)

| Time | Live action | Suggested narration / evidence |
|---|---|---|
| 0:00–0:20 | Show the selected non-human incident stand-ins and Lifeline idle screen in Preview. Keep the incident visible. | “Lifeline is an India-focused emergency guidance prototype. It keeps emergency access visible and presents concise, source-reviewed instructions. It does not identify patients or contact emergency services.” |
| 0:20–0:40 | Pinch the red SOS 112 control. Show the emergency-first screen and helper alternative. | “SOS opens the 112 guidance screen. The application does not place or verify a phone call.” |
| 0:40–1:00 | Use the labelled Preview-only FOUND PERSON control or pinch the collapsed-person stand-in. Show the marker appearing beside the selected prop. Do not imply automatic recognition. | “This is an explicit Preview selection of a non-human stand-in. The marker is a user-selected location cue, not person detection.” |
| 1:00–1:30 | Select Person Collapsed. Show RESPONSE PLAN and DO NOW together. Exercise Next, Repeat and Back while the left progress states update. | “The overview shows the pathway order; the right panel shows the current action. Repeat does not advance. Navigation states indicate progress through the instructions, not a medical outcome.” |
| 1:30–1:50 | Return to selection; select the injury stand-in with FOUND INJURY; show its marker. Select Bleeding Injury and advance at least one step. | “The injury target is a user-selected Preview prop. The bleeding copy retains its approved wording and sequence.” |
| 1:50–2:10 | Select the fire stand-in with FOUND FIRE; show the marker; select Fire / Smoke. Advance through representative evacuation steps, including no lifts and the final contact instruction. | “Fire guidance focuses on evacuation and professional help: raise the alarm, leave by a safe exit, stay low if smoke is in the way, avoid lifts, assemble, do not re-enter, then call 112 or 101 once outside and safe.” |
| 2:10–2:35 | Return to the emergency selection grid. Hold the camera long enough to show all four simultaneous categories and SOS. Optionally show Other Emergency fallback if time permits. | “The four choices are explicit user selections. Other Emergency retains the 112 and operator fallback. No camera-based classification is claimed.” |
| 2:35–2:55 | Show the public repository, design brief, source register, acceptance criteria and test report. If all LEAF tests passed, briefly show the actual LEAF result panel / scenario-manager results. Otherwise show the report's BLOCKED status. | “The repository includes the architecture, source register and test plans. We report only the tests actually run. Preview simulation is not ASR, and Preview is not a hardware test.” |

The recording must remain one continuous take. If a transition cannot be completed within the scheduled slot, omit the optional segment rather than insert a fabricated result or accelerate a confusing interaction.

## Recording controls and boundaries

- Use only visible manual pinch / interaction controls and the clearly labelled Editor-only Preview simulation / scenario selection controls.
- Do not enable microphone activation for the Preview recording. If hardware ASR is later demonstrated, record it separately on compatible Spectacles hardware and identify it as a hardware test.
- Do not narrate “detected,” “recognized,” “called an ambulance,” “ambulance dispatched,” “breathing verified,” or other unsupported claims.
- The incident stand-ins are stylized training props. Selecting them is not object or patient recognition.
- Keep the selected incident / marker visible while showing the two panels. Do not claim binocular comfort, reachability or obstruction-free placement until those have been checked in Preview and on hardware.
- Show 112 and 101 as contact information only. Lifeline does not place calls.
- If a scenario fails, the last step does not fit, a button is unreachable, panels drift, text clips, or a runtime error appears, do not hide it with an edit. Stop and record the issue for correction.

## Submission assets

Save these only after they are actually captured:

- `devpost/evidence/01-emergency-selection.png`
- `devpost/evidence/02-person-collapsed-two-panel.png`
- `devpost/evidence/03-bleeding-two-panel.png`
- `devpost/evidence/04-fire-smoke-two-panel.png`
- `devpost/evidence/05-other-emergency-two-panel.png`
- `devpost/evidence/06-completed-step-overview.png`
- `devpost/evidence/lifeline-continuous-demo.mp4` (or link to the actual hosted recording)

Do not create empty placeholders or name source-only diagrams as Preview screenshots. Add the compile result, relevant runtime log excerpts, scenario IDs / status lines and recording duration to `devpost/test-report.md`.

## LEAF / results presentation

Use the official Live Lens Tester in a CLAD runtime with Lens Studio MCP connected. It must first verify the installed LEAF package and LeafPlugin; read the LEAF Reference; inspect the actual scene and object names; author and register scenarios; attach LeafIndex; compile after each modification; then run scenarios **serially** in Preview.

Recommended coverage:
- SOS activation and 112 emergency-first screen.
- Four simultaneous categories and explicit category choice.
- Incident stand-in selection and marker placement.
- Adult collapse and bleeding guidance, Next / Back / Repeat.
- Fire / Smoke seven-step pathway and 112 / 101 contacts.
- Other Emergency fallback.
- End Session confirmation, cancel, confirmed IDLE reset.
- At least one IK-interactor reachability scenario for the reach-sensitive UI.

If any scenario fails or times out, follow the official run skill's log-baseline procedure and quote the Lens-side scenario-manager line. Do not auto-retry and do not cite plugin UI success messages as proof when the scenario-run call timed out.

## Present submission status

As of this cloud review, actual Preview screenshots, compiler output, runtime logs, LEAF outcomes and video do not exist in the available evidence. The recording plan is ready; the recording and end-to-end proof remain blocked pending local Lens Studio setup and execution.
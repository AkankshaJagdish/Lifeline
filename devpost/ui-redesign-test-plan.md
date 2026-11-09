# Lifeline UI redesign — local compile and Preview checklist

This increment redesigns only the existing `LifelineEmergencyUI` composition. It retains the existing controller, state machine, manual / voice / Preview adapters, emergency configuration, and reviewed medical guidance content.

## Files changed

- `Assets/Scripts/Lifeline/LifelineEmergencyUI.ts` — new persistent SOS 112 control, idle introduction, emergency-first screen, 2 × 2 category menu, typography scale, button label helper and colour roles.
- `Assets/Scripts/Lifeline/LifelineEmergencyUI.ts.meta` — updated component description.
- `README.md` — current UI redesign and local checks.
- `devpost/ui-redesign-test-plan.md` — detailed local verification.
- `devpost/acceptance-criteria.md` — additive UX checks only; existing MVP AC-1..AC-4 unchanged.

No changes are made to `LifelineController.ts`, `LifelineStateMachine.ts`, `LifelineTypes.ts`, `LifelineGuidanceContent.ts`, `LifelineEmergencyConfig.ts`, or activation adapters.

## Design and behavior

- Frame inner size: 30 × 20 cm, with the existing Frame initialization lifecycle and content +Z z-fighting offset retained.
- Persistent SOS 112 control: a UIKit Button in the upper-right inset of the Frame content host. Its action calls the existing `manualActivation.activateManually()` route, which uses the shared controller activation path. It does not place or verify a phone call.
- Idle: Lifeline identity, exact requested description, voice status, manual SOS and Editor-only simulation entry.
- First active screen: emergency-first 112 display and helper instruction remain ahead of incident selection.
- Category selection: four simultaneously visible UIKit buttons in a 2 × 2 arrangement, with glyph, title and subtitle.
- Person collapsed → existing `adult_collapse` path.
- Bleeding injury → existing `bleeding` path.
- Other emergency → existing `other` path.
- Fire / smoke → selectable, but the current state machine has no reviewed fire guidance or fire state. It routes to existing `other` guidance; no new fire instructions are introduced.
- Emergency 112 access remains available through the persistent SOS activation affordance and in-page call-instruction / Call 112 controls.

## Local integration and validation

1. Sync this branch and open the exact `Lifeline.esproj` in Lens Studio 5.23.2.26081320 Public.
2. Recompile TypeScript. If it fails, record the complete error and file/line before further tests.
3. Confirm `LifelineEmergencyUI` still references the same controller and input-adapter SceneObjects.
4. Open Interactive Preview. Confirm the 30 × 20 cm panel is readable and does not dominate the central incident view.
5. Idle: confirm the exact description, voice inactive/unavailable status where applicable, the persistent SOS control and Editor-only simulation entry.
6. Pinch SOS once from IDLE. Confirm the existing shared activation route enters the normal emergency-first state.
7. Confirm the SOS control remains visible and targetable on Emergency Home, Call Instructions, Category Selection, guidance, end screen and cancellation confirmation.
8. Emergency Home: verify 112 and the helper alternative remain prominent; use Call Instructions and confirm no call-success claim.
9. Category menu: verify all four cards appear simultaneously and are individually pinchable. Confirm they do not require Next / cycling.
10. Verify Person collapsed reaches adult-collapse guidance, Bleeding Injury reaches severe-bleeding guidance, and Other Emergency reaches the existing other path.
11. Verify Fire / Smoke reaches only the existing safe fallback path; do not interpret it as a fire-response workflow.
12. Verify manual ACTIVATE remains available, Preview simulation remains explicitly labelled, and neither depends on ASR.
13. Verify Next, Back, Repeat, End Session, Cancel and 112 navigation remain functional.
14. Capture Preview screenshots of Idle, Emergency Home, the full 2 × 2 category grid, and one guidance screen with SOS visible.
15. Record any target-size, clipping, visual contrast or frame/follow issues. No acceptance criterion should be marked passed without actual Preview evidence.

## Source and capability boundaries

The implementation follows the official `specs-build-ui` reference patterns for UIKit Button sizing before initialization, `onTriggerUp`, +0.08 cm button label lift, text roles, and deferred FlexLayout child registration. It does not modify installed UIKit / SIK package source.

The repository has no `Assets/Icons` folder, and no cloud icon-generation tool is available in this workflow. The current category cards use simple text glyphs as placeholders. Replace them with authored / selected icon assets later if desired; do not reference nonexistent asset paths.

No Lens Studio compile, actual Preview screenshot or runtime interaction test has been performed in this cloud session.

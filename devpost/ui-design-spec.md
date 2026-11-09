# Lifeline — spatial experience design specification

**Status:** Proposal for user approval. No implementation is authorized by this document.  
**Project:** Lifeline — emergency first-aid companion for inexperienced bystanders in India  
**Repository baseline reviewed:** master, with source and MCP snapshots through 2026-11-07  
**Project metadata:** Lens Studio 5.23.2.26081320 Public; target platform recorded as Spectacles  
**Design intent:** SEE THE SITUATION. KNOW WHAT TO DO.

---

## 1. Executive design decision

Lifeline should evolve from its working single-card, head-following instruction UI into a compact, spatially contextual emergency-assistance experience. The bystander must be able to choose an incident category, understand the ordered response, read the current action at a glance, and keep the real incident in view.

The proposal retains the current controller, manual activation, optional ASR adapter, Preview simulation adapter, emergency-first 112 screen, medical guidance content register, and end-session confirmation. It changes the active-screen composition and proposes a bounded incident marker and fire/evacuation concept.

The experience must not become a floating website or clinical dashboard. The selected incident remains the visual centre of the user's real environment. The UI is an instrument: it gives an immediately available emergency action, a short ordered overview, and one expanded instruction at a time.

### Approval-stage scope

The proposed category selector contains four options:

1. Person collapsed.
2. Bleeding injury.
3. Fire / smoke.
4. Other emergency.

All four options are visible simultaneously after the emergency number has already been surfaced. Selection is an explicit SIK interaction. The system does not classify what the camera sees.

A spatial incident marker is placed only after an explicit user action on a safe, static environmental surface or an authored Preview stand-in. It must not attach to a real patient's body, wound, face, or clothing. It is a location cue, not a recognition result, patient label, diagnosis, severity indicator, or treatment annotation.

Two coordinated guidance panels are proposed:

- **Left — response overview:** compact ordered steps and progress, with the current phase clearly indicated.
- **Right — current action:** one large expanded instruction with a clear Next action and a visible route back to 112.

A persistent SOS control is present on all active screens. It must be unmistakable and remain inside the comfortable interaction region rather than being pinned to the extreme display corner.

---

## 2. Existing product and implementation to retain

The following components already exist and should remain the foundation.

| Existing element | Current responsibility | Design decision |
|---|---|---|
| LifelineController | UI-independent public controller over the state machine | Retain; continue to own state transitions and shared activation entry point. |
| LifelineStateMachine | IDLE, emergency home, call instructions, path selection, bleeding, adult collapse, other emergency, session end and confirmation | Retain its current semantics. Extend only after approval for fire and selected incident metadata. |
| LifelineManualActivationController | Manual pinch activation | Retain as a primary fallback. |
| LifelineVoiceActivationController | Optional Spectacles ASR activation | Retain as an optional hardware shortcut; do not rely on it for emergency entry. |
| LifelinePreviewSimulationController | Clearly labelled simulated voice trigger, same transition as activation | Retain. Extend Preview-only responsibilities to selecting deterministic incident stand-ins only after the scene-selection model is approved. |
| LifelineEmergencyUI | UIKit Frame, content host, labels, buttons, FlexLayout composition and state rendering | Retain the component and event wiring; refactor its view composition rather than replacing the UI architecture. |
| LifelineGuidanceContent | Reviewed fixed first-aid wording | Retain all existing reviewed copy unchanged. Fire copy must be separately sourced and reviewed before it is added. |
| LifelineTypes | Shared state, path and snapshot contracts | Extend additively only if approved; do not conflate a visual incident category with a medical diagnosis. |
| Installed SpectaclesUIKit / SIK / Icons / Motion | Interactive UI, layout, hand/ray input and icon assets | Reuse installed versions. Do not upgrade or modify package source. |

### Current UI behavior

The existing UI renders these states: IDLE, EMERGENCY_HOME, CALL_IN_PROGRESS_OR_MANUAL_CALL, PATH_SELECTION, BLEEDING_GUIDANCE, ADULT_COLLAPSE_GUIDANCE, OTHER_EMERGENCY, HELP_ARRIVED_OR_SESSION_END, CANCEL_CONFIRMATION, and ACTIVATING.

The emergency screen displays India 112, asks the user to call emergency services, and offers the helper alternative. The separate “I HAVE CALLED 112” action is acknowledgement only. The pathway screen currently cycles through three options one at a time. Guidance renders one current instruction, Step n of m, Next, Repeat, End Session, Back, and Call 112.

### Existing scene hierarchy

The current serialized scene / architecture summary is:

    Scene
    ├── Camera Object
    │   └── Camera
    ├── Lighting
    ├── Lifeline Experience
    │   ├── LifelineController
    │   ├── Lifeline Input Adapters
    │   │   ├── LifelineManualActivationController
    │   │   ├── LifelinePreviewSimulationController
    │   │   └── LifelineVoiceActivationController
    │   └── Lifeline Instruction Panel
    │       └── LifelineEmergencyUI
    └── [existing editor / preview support objects]

This proposal does not require a new application root or controller architecture. Added scene elements are proposed as children of the existing Lifeline root / UI layer, or as separately named world-space objects owned by an incident-anchor controller. Exact object IDs and transform parenting must be confirmed from the live scene at implementation time.

### Existing authored UI measurements

- Current Frame inner size: 30 × 20 cm.
- Current content area: 28.5 × 18.5 cm after a 0.75 cm inset.
- Existing authored viewing distance: approximately 105 cm.
- Existing authored vertical offset: approximately 8 cm below the forward horizon.
- Current primary target: 5.6 cm.
- Current secondary target: 3.9 cm.
- Current target gap: 2 cm.

Keep these values as the baseline during prototype layout. The new two-panel geometry below is a proposal to test against the same 1 m focus plane, not a claim that it has already been measured in Preview.

---

## 3. Spatial interaction model

### 3.1 The marker is a user-selected location cue, not object recognition

The original safety and product brief explicitly excludes patient recognition, wound recognition, breathing recognition, camera-based assessment, automatic diagnosis and scene understanding. The new marker must not quietly reintroduce any of these claims.

Proposed sequence:

1. The user activates Lifeline.
2. Lifeline presents 112 and the helper instruction before asking for a category.
3. The user chooses one of the four categories.
4. A short prompt invites the user to place a marker near the incident, only if it is safe and helpful.
5. The user points at a static surface or an explicitly authored Preview stand-in and pinches to confirm.
6. The marker is placed at the selected world hit position and aligned to the returned surface normal.
7. Guidance UI is offset from the selected point so it does not cover the object or person.
8. If surface selection is unavailable or no hit is returned, the user can skip placement; guidance and SOS remain fully usable.

The marker should be a simple high-contrast ring / locator with a short category glyph, not a label hovering over a person. A brief, restrained confirmation transition is sufficient; do not use persistent pulsing.

**Human-target restriction:** never invite the user to target a patient's body, face, wound, clothing or other identifying detail. In Preview, use authored non-human incident stand-ins (for example, a box/prop representing a hazard, or a floor marker beside a mannequin substitute). The marker is placed on the stand-in surface or a nearby surface location, not on the person.

### 3.2 Proposed platform APIs and confidence

The official CLAD specs-world-query skill documents a viable surface-placement path:

- WorldQueryModule from LensStudio:WorldQueryModule.
- HitTestSession created with createHitTestSession() or createHitTestSessionWithOptions().
- session.start() is mandatory before hit tests produce results.
- For an interactor ray, the skill uses the SIK targeting interactor API: SIK.InteractionManager.getTargetingInteractors().
- hitTest(interactor.startPoint, interactor.endPoint, callback) supplies a WorldQueryHitTestResult.
- The result exposes position and normal, suitable for placing and orienting a marker.
- A null result is possible, including when the ray falls outside the camera field of view.
- Semantic classification is experimental and requires Experimental APIs. It is not needed for Lifeline's first placement design.

**Recommendation:** use World Query for explicit surface placement only, after validating the installed API and Preview behavior. The marker is then a world-space SceneObject at the sampled position. Use the world tracking origin / world-space transform APIs supported by the current project for placement stability. Do not assume that generic SceneObject parenting alone guarantees persistence.

World Query updates at approximately 5 Hz and is recommended for static or slow surfaces, not fast-moving objects. It is not an appropriate basis for tracking a moving casualty or a moving hazard.

**Not approved for this design:** camera AI, SnapML/object tracking, automatic patient/incident classification, depth-cache plus AI grounding, face/body tracking, or tracking a moving casualty. These would materially change the safety/privacy proposition and add platform and clinical validation requirements.

### 3.3 Related platform capabilities and their limits

| Capability | Documented role | Lifeline use |
|---|---|---|
| SIK targeting interactor | Provides a ray for targeting and pinch interaction | Explicit selection of a static surface / Preview stand-in. |
| World Query Module | Raycasts against real surfaces; returns world position and surface normal | Marker placement. Updates around 5 Hz; not for fast-moving objects. |
| Device Tracking / World tracking | Establishes spatial tracking for stable world placement | Required project-level basis for the marker; inspect current camera setup before any change. |
| Depth Module | Provides depth frames and world-space reconstruction | Not proposed for first iteration: the current CLAD depth skill states Lens Studio Preview does not stream depth; device-only validation would be needed. |
| Custom Locations | Anchors content to a scanned known place | Not required for an incident-level marker. |
| SIK + UIKit | Shared spatial interaction model and prebuilt interactive visual controls | Category buttons, SOS, Next, step selection and explicit placement confirmation. |

The SIK/UI Kit skill documentation also cautions that the installed Interaction Kit prefab and camera World Tracking setup must be present exactly once, and that visual controls can render even while input fails if interaction infrastructure is missing. The existing scene should be inspected before adding anything; do not duplicate the SIK prefab.

### 3.4 Marker lifecycle

- **Unplaced:** no marker is shown; guidance works normally.
- **Placement preview:** a lightweight preview marker follows the current valid surface hit while the user is actively targeting. It is not shown on invalid or out-of-FOV hits.
- **Placed:** pinch release confirms the latest valid surface hit. Marker remains world-anchored while the user moves.
- **Reposition:** a deliberate “Move marker” action re-enters placement mode. Do not make the marker draggable by accident.
- **Lost / unsupported:** if tracking or surface hits fail, hide the transient preview marker and show a small “Marker unavailable — continue without it” fallback. Never block the 112 control or current instruction.
- **Session ended:** remove or hide the marker with the current emergency UI. Do not preserve incident-associated location data between sessions.

---

## 4. Screen-by-screen wireframes

The wireframes are schematic; exact font metrics and dimensions are specified in section 6. The central real-world scene remains visible behind every screen.

### Screen A — Idle / start

    REAL-WORLD VIEW REMAINS OPEN

                  LIFELINE
             Emergency assistance

             [      START      ]

      SIMULATION — trigger voice: EMERGENCY
                 (Preview only)

        Basic guidance • India • 112

Retain the existing restrained idle state. The Preview simulation control remains visibly labelled and must not appear as a real-world user action. Do not show a four-category grid before activation.

### Screen B — Emergency help first

    REAL-WORLD VIEW REMAINS OPEN

    [SOS 112]                      EMERGENCY HELP

                    CALL 112 NOW
          Ask someone nearby to call 112.

                [ CALL INSTRUCTIONS ]

                   [ CONTINUE ]

This is the first active state after any activation source. It preserves the existing emergency-first flow. The 112 action is prominent and is not displaced by incident classification or marker placement.

The user acknowledgement remains a distinct optional control on the call-instructions / return flow. Do not change its meaning or present a successful call state.

### Screen C — Four-category selection

    REAL-WORLD VIEW REMAINS OPEN

    [SOS 112]                    WHAT IS HAPPENING?

    ┌──────────────────┐   ┌──────────────────┐
    │ PERSON COLLAPSED │   │ BLEEDING INJURY  │
    └──────────────────┘   └──────────────────┘

    ┌──────────────────┐   ┌──────────────────┐
    │ FIRE / SMOKE     │   │ OTHER EMERGENCY  │
    └──────────────────┘   └──────────────────┘

            [ SKIP — CONTINUE TO 112 ]

All four choices are visible simultaneously after the emergency-first screen. Categories are user descriptions, not inferred diagnoses. The selected category receives a strong but calm selected state; the other controls remain recognizable. The selection screen should not include explanatory paragraphs.

“Skip / other” is retained for uncertainty and unsupported cases. The user must not be forced to identify the incident before reaching 112.

### Screen D — Place incident marker (optional)

    REAL-WORLD VIEW REMAINS OPEN

    [SOS 112]                   MARK NEAR THE INCIDENT

          Aim at a nearby safe surface.
               Pinch to place.

               [ SKIP MARKER ]

            Selected category: FIRE / SMOKE

The visual marker preview appears in the real environment on a valid hit. No instruction asks the user to touch, point at, or mark a person. It must be possible to skip and continue immediately.

### Screen E — Coordinated guidance workspace

    REAL-WORLD VIEW
    [Marker beside selected incident surface]

    ┌──────────────────────────────┐
    │ SOS 112                 FIRE │
    │                              │
    │ RESPONSE OVERVIEW             │
    │ 1  Get help                   │
    │ 2  Move away from danger      │
    │ 3  Use a safe exit            │
    │ 4  Stay out / hand off        │
    │                              │
    │ ● Current phase  2 of 4       │
    └──────────────────────────────┘
          LEFT / OVERVIEW

    ┌────────────────────────────────────┐
    │ CURRENT ACTION                     │
    │                                    │
    │ Move away from smoke and           │
    │ immediate danger.                  │
    │                                    │
    │ Follow the safest available exit   │
    │ and emergency guidance.            │
    │                                    │
    │         [ NEXT STEP ]               │
    │  [ REPEAT ]   [ MORE DETAIL ]       │
    └────────────────────────────────────┘
           RIGHT / INSTRUCTION

The fire text above is illustrative placeholder language for wireframe only. It is not approved user-facing fire-safety copy. No fire copy may ship until an authoritative India-specific source and exact wording are added to the content register and reviewed.

### Screen F — Expanded detail (progressive disclosure)

    REAL-WORLD VIEW REMAINS OPEN

    [SOS 112]              CURRENT STEP — MORE DETAIL

    [Short current action remains visible]

    Additional source-checked explanation appears here.
    Only one expanded detail group is open at a time.

                 [ COLLAPSE ]
                 [ NEXT STEP ]

“More detail” expands only the current step. It does not reveal a full help article, diagnosis, or every pathway instruction at once. Keep the current action visible while expanded content is open.

### Screen G — Adult / bleeding pathway and handoff

Both existing routes keep their approved step order and exact source-reviewed wording. The left rail gives a compact ordered overview; the right side shows only the current step at readable size. The existing Back, Next, Repeat, End Session and Call 112 actions remain available, with SOS persistent. Existing end-session confirmation and acknowledgement semantics remain unchanged.

### Screen H — Unsupported / other emergency

    REAL-WORLD VIEW REMAINS OPEN

    [SOS 112]                  OTHER EMERGENCY

                   CALL 112 NOW

          Follow the emergency operator's
                 instructions.

               [ CALL INSTRUCTIONS ]

No invented treatment advice is added.

---

## 5. Interaction flow and state additions

### 5.1 Proposed happy path

1. IDLE → activate by manual pinch or optional ASR.
2. EMERGENCY_HOME → show 112 and helper alternative immediately.
3. User continues to category selection.
4. User chooses one of the four visible categories.
5. User optionally places the incident marker on a safe, static surface or authored Preview stand-in.
6. The correct guidance workspace opens; the category and marker context remain available.
7. User advances through steps with large SIK/UI Kit controls. The left overview indicates order and progress; the right side presents the single current instruction.
8. SOS remains available from every active screen.
9. Existing session-end confirmation and return-to-idle behavior remains explicit.

### 5.2 State-machine delta

Existing states and transitions should be preserved. The smallest additive conceptual changes are:

- A category-selection screen that presents four simultaneous choices.
- A marker-placement substate or UI mode with Place / Skip / Move marker behavior.
- A fire/evacuation guidance state, but only after content source approval.
- A snapshot field for the user-selected category and optional marker state/position (transient, session-scoped).

Do not add person_collapsed as a medically stronger label than the current adult collapse / possible cardiac arrest route. The selection label “Person collapsed” is a user's report. The adult pathway retains its explicit adult-only boundary; if the person may be a child or infant, fall back to 112/operator instructions.

### 5.3 Category-to-path mapping

| User selection | Destination | Content rule |
|---|---|---|
| Person collapsed | Existing adult-collapse path only if the adult-only route is appropriate; otherwise 112/operator fallback | Do not infer age or breathing. Keep the explicit adult limitation visible. |
| Bleeding injury | Existing severe-bleeding path | Preserve exact current approved sequence and wording. |
| Fire / smoke | New fire evacuation guidance, conditional on source review and approval | No firefighting, rescue entry, smoke assessment, or route guarantee. |
| Other emergency | Existing Other emergency fallback | 112 and operator instructions only. |

### 5.4 Persistent emergency action

The red SOS control is available in every active state, including marker placement, expanded details, and all guidance steps. Activating it returns to the 112 emergency surface / call instructions without clearing the active path unless the user explicitly ends the session. This is a navigation-to-help action, not a phone-call launch. Lifeline still does not place or verify a call.

---

## 6. Geometry, dimensions and relative positioning

### 6.1 Coordinate and distance convention

Lens Studio uses negative local Z for objects in front of the camera. The original design reference and Snap spatial guidance place detailed content around the 1 m focus plane. The proposal keeps the instruction UI near that plane and offsets it from the incident object.

The current UI was authored around 105 cm; the spatial guide recommends approximately 110 cm for full binocular overlap. Keep 105 cm as the current project baseline for the first layout prototype, then compare 105 and 110 cm in Interactive Preview without changing target platform or migrating the project.

### 6.2 Combined panel envelope

Proposed initial envelope for the dual-panel workspace:

- Total combined UI envelope: **30 cm wide × 20 cm high maximum**.
- Distance: **105–110 cm** from viewing origin, slightly below natural forward gaze.
- Preserve a clean central opening toward the physical incident. Do not place a panel directly over the selected object.
- The incident marker is at the selected world-space hit; the UI is not a child of the marker and must not move with a moving person.
- Each panel uses one backing surface and a separate content SceneObject with the established +0.6 cm z-fighting offset.
- Preserve margins around the combined workspace. If the two panels cannot remain readable and inside the usable field, use a narrower overview rail and one active card rather than enlarging the UI into the central view.

Initial allocation to prototype:
- Left response overview: **10.5 cm wide × 16.5 cm high**.
- Inter-panel gap: **1.0 cm**.
- Right current-instruction panel: **18.5 cm wide × 16.5 cm high**.
- Header / SOS band: within the overall 30 × 20 cm envelope; approximately **2.5 cm high**.
- Combined layout keeps at least 0.75 cm inset and avoids placing an SOS collider at the extreme visual edge.

These widths are a design starting point. They are not verified against text wrapping, binocular overlap, visual obstruction, or exact installed font metrics.

### 6.3 Targets and spacing

At approximately 105–110 cm:

- Keep interactive target colliders at least **4 cm**; aim for **6 cm** wherever space permits.
- Keep at least **1 degree** of visual angle between neighboring targets (the existing 2 cm gap at 105 cm is approximately 1.1 degrees).
- The persistent SOS target should be approximately **6 cm** across. Do not shrink it just to preserve a decorative corner position.
- Category cards should use a 2 × 2 grid with generous separation. Suggested minimum card face/collider: **12.5 × 5.5 cm** per card, subject to a 30 × 20 cm envelope prototype and fit.
- Do not place multiple small action buttons side-by-side. Next is dominant; Repeat and More Detail are secondary, separated and individually targetable.

### 6.4 Spatial relationship to the incident

- Marker: at the selected world hit position, aligned using the hit normal.
- Overview panel: to the user's lower-left of forward gaze, away from the marker and not overlapping the central person/object.
- Current instruction panel: lower-right of the overview, but still within binocular overlap and comfortable reach.
- If marker and guidance panels compete with the incident, the interface yields: move panels outward/downward within the safe view, reduce secondary content, or hide the overview rail temporarily. Never ask the user to look away from the incident to keep UI visible.
- No arrows should pull gaze away from the casualty or toward a hazard. Do not animate a path through an unverified room.

---

## 7. Visual system: colour, typography and motion

### 7.1 Palette intent

The requested palette is warm ivory, deep teal, coral red, warm amber and luminous neutrals. SPECS displays are additive: black is transparent and dark colors can be weak or disappear. Therefore colour names are brand intent, not permission to use low-luminance values.

| Role | Palette direction | Usage |
|---|---|---|
| Primary text / high-priority glyph | Luminous ivory / warm white | Main instruction, 112, headings and key numbers. |
| Structural accent | Teal with sufficient display brightness | Panel outlines, overview progress, noncritical state distinction. Avoid near-black teal for essential content. |
| SOS / emergency | Clear coral red | Persistent SOS control, urgent alert state only. Keep label “SOS 112” so meaning is not color-only. |
| Caution / selected fire category | Warm amber | Category accent and caution highlight; not a severity meter. |
| Secondary neutral | Luminous neutral at reduced opacity | Progress, captions and inactive UI. |

Use a restrained luminous surface/backing or text plate for legibility against variable real-world backgrounds. Avoid relying on a large full-white panel or pure black fill: black is transparent in the additive display and full-white expanses can dominate the scene. Test actual material values against the target SPECS display. The CLAD UIKit guide recommends a dark-background/light-text hierarchy, but also warns that black is transparent and dark colors may vanish; in this project, use a tested mid-luminance backing or outline with luminous type rather than a large near-black rectangle.

### 7.2 Typography

Use installed UI Kit text roles, not arbitrary per-label sizes. At the 110 cm far plane the published CLAD type scale is:

- Title 1: 105
- Title 2: 93
- Headline XL: 62
- Headline 1: 54
- Headline 2: 48
- Subheadline: 41
- Button / Callout / Body: 39
- Caption: 38

At the current 105 cm design distance, scale proportionally only through the shared role helper. Do not reduce readable list labels below the 38 caption floor at 110 cm to squeeze the entire response sequence into the left panel. If the eight-step sequence does not fit, show fewer phase names in the overview and disclose the selected phase details on demand.

### 7.3 Motion

- Use a short opacity/scale transition when the active state changes.
- Use a single restrained placement confirmation.
- No continuous pulsing SOS, spinning rings, flashing, ticking countdown, dramatic shake, or animated arrows around the person.
- Avoid repeated full-panel rebuild motion between sequential instruction steps; content should feel stable.
- Keep all motion subtle enough that the physical incident remains visually dominant.

---

## 8. The two-panel content architecture

The complete ordered overview must coexist with the requirement that no small text or wall of text appears. The proposed compromise is an ordered vertical overview and an expanded current step.

**Left panel — response overview**
- Shows the route's ordered sequence in short, plain-language labels.
- Shows current position and number of steps.
- Current step has an unmistakable highlight and progress indicator.
- Previous steps are visibly completed only as navigation/progress state, not as medical outcome claims.
- Upcoming steps remain muted but readable.
- If the route is longer than the panel can display at the caption floor, the overview becomes a scrollable list with the current row pinned into view; do not shrink text.
- Do not add explanatory paragraphs to the overview.

**Right panel — current instruction**
- Shows one approved instruction in the strongest text hierarchy.
- One primary Next / Continue action.
- A separate Repeat action.
- More Detail opens only the current step's source-reviewed extension.
- Persistent SOS is available without navigating away from the current route.
- Keep existing Back and End Session confirmation semantics.

### Route overview labels

These are proposed concise UI labels only. They do not replace or rewrite approved medical instructions.

| Route | Ordered overview label sequence |
|---|---|
| Bleeding | Stay safe → Get help → Barrier → Press firmly → Keep pressure → Add material if needed → Work around embedded object → Secure dressing when controlled |
| Adult collapse | Adult only → Check response → Check normal breathing → Get help → Compressions → Pace → Full recoil → Follow operator |
| Fire / smoke | Content pending authoritative India source review. Do not ship a placeholder or generated action sequence. |
| Other | Call 112 → Follow operator |

For the adult path, “Check normal breathing” must not imply AI assessment or a pulse check; approved text and age limitation remain governed by the medical-content register.

---

## 9. Fire / smoke pathway: conditional scope and safety gate

This is a new emergency content domain. The current medical register covers 112, severe bleeding and adult basic life support. It does **not** contain an approved fire/evacuation pathway. Therefore the fire panel in section 4 is a layout wireframe only; implementation is blocked until the source and copy gate below is met.

### Proposed product boundary

Fire / smoke guidance should be evacuation-first and avoid firefighting instructions. Lifeline should not tell an untrained bystander to approach a fire, investigate smoke, operate extinguishers, re-enter a building, use lifts, or follow a route that has not been verified safe. It must not use AR to draw a route through a building or assert that a doorway/staircase is safe.

### Candidate content research (not approved for product copy)

The Government of India's Directorate General Fire Services publishes fire-safety material including “Survival Guide in Case of Fire”, “Plan Your Escape Route”, “Fire Safety in High Rise Building”, “Fire Precautions in Industries” and “Fire Safety for Disabled People”. These appear to be appropriate primary materials for a dedicated content review, but exact PDF contents and page numbers were not reviewed in this design pass.  
https://dgfscdhg.gov.in/fire-prevention  
https://dgfscdhg.gov.in/mass-awareness-in-print

The Maharashtra State Disaster Management Authority page gives generic fire advice. It is a state authority, not a national all-context authority; it should not by itself be treated as sufficient for a national India pathway.  
https://sdma.maharashtra.gov.in/en/dos-and-donts/

The current 112 value is validated by the existing MHA ERSS register. Keep that India-specific value and continue to describe it as the emergency number, not a call the application has placed.

### Mandatory fire content gate before build

1. Read relevant current Directorate General Fire Services official PDFs in full.
2. Identify context-specific guidance that can safely be summarized for a general adult bystander.
3. Cross-check with a current national emergency-services / disaster authority source.
4. Write an exact copy table in devpost/medical-content-sources.md, with source name, version/date, section/page, exact proposed UI text, scope and exclusions.
5. Have the user approve the fire route wording before it is added to the app.
6. Do not add a route-finding arrow, smoke-density claim, flame recognition, fire-size classifier, fire-suppression technique or safety-of-exit judgement.

Until those steps occur, Fire / smoke selection should route to the existing Other emergency fallback rather than display invented fire guidance.

---

## 10. Preview simulation and demonstrability

### What can be shown

The Learn AR with SPECS Preview FAQ describes a simulation with simulated hand/pinch interaction, world mesh and camera. Interactive Preview supports moving around and interacting using mouse and keyboard. This is sufficient to design a demonstration of:

- Four simultaneous category controls.
- Explicit user pinch selection.
- Placing a marker on an authored non-human stand-in / world surface where World Query returns a hit.
- Moving the Preview camera while observing world-space stability.
- Left response overview and right current instruction panel.
- SOS path from every active state.
- Next, Repeat, More Detail, Back and session-end confirmation.

Preview should not be treated as proof of real object recognition, person tracking, medical sensing, depth behavior, ASR accuracy or emergency calling.

### Preview stand-in plan

Add a visibly authored and labelled simulation environment in the future implementation phase:

- A neutral physical environment and floor/table surface to raycast against.
- Distinct non-human stand-ins for “bleeding injury,” “fire / smoke,” and “other” only as scene props; do not render a wound or person-detection claim.
- A separate static “person collapsed” stand-in may be a mannequin or simplified silhouette, but no actual recognition or body-target interaction. User chooses “Person collapsed” manually; marker remains beside the stand-in on the floor/table surface.
- An unobtrusive annotation that says the scene is a Preview simulation.
- User selects category and then explicitly places the marker; the simulation must not automatically select a category or marker based on camera input.

For fire, use a static prop (for example a coloured smoke/flame proxy mesh) to identify the visual demo stand-in. Do not simulate spreading fire, smoke physics, thermal hazard analysis, or an automatically detected escape route.

### Preview behavior constraints

- Use the SPECS 27 simulation selected by the user's local project / installed Lens Studio version.
- The current MCP Preview export says “No Simulation” / “Front” camera and the runtime scene query timed out. The export is not evidence that World Query is working in the current project.
- Depth skill documentation explicitly states that Preview does not stream DepthModule frames; do not make depth-dependent marker placement an acceptance requirement for Preview.
- World Query has documented surface hit-test support and the Learn AR FAQ describes simulated world mesh in Preview, but exact World Query + simulated-hand behavior in this specific Lens Studio project remains to be tested locally.
- If current Preview configuration cannot produce World Query hits, the deterministic fallback is an explicitly scripted Preview-only target placement (for a known stand-in transform), with an on-screen “SIMULATION” label. Do not claim this fallback is a real surface raycast.

---

## 11. Acceptance criteria for the proposed redesign

These are additive design acceptance criteria for approval and later local implementation. They do not replace the four existing MVP acceptance criteria.

| ID | Acceptance criterion | Evidence required |
|---|---|---|
| UX-1 Four-category selection | After emergency home, all four category choices are visible simultaneously and individually targetable. | Fresh Preview recording/screenshot and pinch interactions on all four cards. |
| UX-2 Emergency access | SOS 112 remains reachable on every active screen, including marker placement, full-detail mode, and all guidance states. | LEAF / Preview interaction from each representative state; no false call-success state. |
| UX-3 Explicit marker selection | Marker appears only after explicit user placement; it is positioned on a valid static surface hit or labelled Preview stand-in. | World Query result / transform capture in Preview where supported, plus no-hit fallback test. |
| UX-4 Physical context remains primary | Marker and panels do not cover the incident stand-in. UI remains spatially stable while the user moves around it. | Interactive Preview walk-around recording from front and oblique angles; device inspection for comfort. |
| UX-5 Paired guidance panels | Left overview lists the complete ordered route without sub-floor text; right panel displays one expanded current instruction. | Screenshots at first, middle and final steps of each route; LEAF navigation tests. |
| UX-6 Progressive disclosure | Additional detail is hidden until requested and scoped to the current instruction. | Preview interaction showing collapsed and expanded states, with return to current step. |
| UX-7 Existing routes preserved | Bleeding and adult-collapse wording and order remain identical to the reviewed content register. | Compare actual UI strings against devpost/medical-content-sources.md, then run all existing MVP scenarios. |
| UX-8 Fire safety boundary | Fire route is not implemented until official source register is completed and approved; after approval, it remains evacuation-first and does not claim route safety or firefighting ability. | Source table reviewed; approved content checked verbatim; Preview/LEAF route tests. |
| UX-9 Other fallback | Other emergency and unconfirmed/unsupported situations return only to 112 and operator instructions. | Preview/LEAF path verification. |
| UX-10 Accessibility and comfort | Every active control meets target-size/spacing guidance; text remains readable; no panel sits outside binocular overlap or over the incident. | Target collider inspection, Preview camera test and eventual device user test. |

---

## 12. Risks, limitations and unverified assumptions

| Risk / unknown | Why it matters | Proposed handling |
|---|---|---|
| Existing product brief prohibits patient and scene recognition | Attaching marker to a person/wound could imply visual diagnosis or surveillance | Marker attaches only to a user-selected static surface near incident; no person-locked marker. |
| World Query is approximately 5 Hz | It is not appropriate for tracking a moving casualty or fast-moving hazard | Use only for static surface placement and then freeze marker in world space. |
| World Query Preview integration in this project is unverified | Export's Preview runtime query timed out; config shows No Simulation | Require local Interactive Preview test; keep skip path and scripted Preview stand-in fallback. |
| Depth Module unavailable in Preview | Cannot depend on depth frames for simulation | Do not use DepthModule for marker placement in this iteration. |
| New fire route lacks registered approved copy | Safety-critical and outside current content scope | Fire content gate is a release blocker. |
| “Person collapsed” is not synonymous with adult cardiac arrest | Current guided CPR path is adult-only | Preserve age boundary and emergency operator guidance; no automatic inference. |
| Two panels can create excessive text / obstruction | Judges criticized high-density overlays in the technical-field review | Keep one expanded action; overview labels terse and scrollable; cap simultaneous windows. |
| Corner SOS may be outside comfortable interaction area | Edge controls are harder to reach | Put SOS in a safe upper-right inset within visible usable field, with 112 also accessible in main content. |
| Palette request versus additive display | Deep teal / ivory / coral values may render differently than flat-screen colors | Use sufficiently luminous accents and luminous text; verify actual display values. |
| Existing project target is Spectacles and Preview mentions SPECS 27 | A platform-target migration may be unnecessary or harmful | Preserve project settings until local version / target status is verified. |
| 5.23.2 version compatibility | Snap's 5.23.2 release page describes that release as SPECS 27, not Spectacles (2024) | Preserve target/version; validate current project profile, do not switch device target based on a naming assumption. |
| Scene export and repository may differ | MCP export says editor had a temporary project path different from repository workspace | Treat checked-in scene snapshot as baseline; at implementation, compare the user's actual open project with repository before writing. |
| Source corpus omits codexsources/emergencytext.txt on reviewed master | User requested it as an initial source, but path returns 404 | Do not invent its content. Reconcile only if user supplies it or it appears on another branch. |

---

## 13. Design influence from the supplied judge reviews

### Aftershock

The review praised the project's real-scale environment and physical interaction. Judge feedback emphasized physical interaction and making AR augment the actual surroundings rather than merely simulating a reality. The Lifeline equivalent is a marker placed on a selected real surface and a UI positioned around, not over, the person.

### Next Hold

The review praised the change in information density with distance: broad guidance from a distance, then one marker and one word when close. It also raised questions about clarity, manual calibration burden, and audience / journey. Lifeline should adapt in the same spirit: show the ordered overview and current task at the initial glance; show the current step's expanded detail only when requested. Avoid any calibration questionnaire.

### MWNP — technical-field assistant

The judge's initial feedback was that the overlay contained too much information and too many small buttons. The explicit recommendation was to focus on what the user needs to know at each point, use fewer and larger controls, and apply progressive disclosure. This is the rationale for an overview rail plus one expanded action, a single dominant Next button and clearly separated secondary actions. Lifeline must not repeat the same high-density-panel error.

---

## 14. Proposed hierarchy delta (not implemented)

    Lifeline Experience (existing)
    ├── LifelineController (existing)
    ├── Lifeline Input Adapters (existing)
    │   ├── Manual Activation (existing)
    │   ├── Preview Simulation (existing)
    │   └── Voice Activation (existing, disabled by default)
    ├── Lifeline Instruction Panel (existing)
    │   ├── Emergency UI Controller (existing component)
    │   ├── Emergency Workspace (proposed)
    │   │   ├── SOS Action (proposed, persistent during active session)
    │   │   ├── Category Selector (proposed, four-button grid)
    │   │   ├── Response Overview Panel (proposed)
    │   │   └── Current Instruction Panel (proposed)
    │   └── UIKit Frame / BackPlate and layout children (reuse installed UIKit)
    └── Lifeline Spatial Incident Layer (proposed)
        ├── World Query Placement Controller (proposed)
        ├── Placement Preview Marker (proposed)
        ├── Placed Incident Marker (proposed, transient session scope)
        └── Preview Scenario Stand-ins (proposed / editor-only)

This is a logical proposal, not a commitment to create each item as a separate component. The implementation can keep LifelineEmergencyUI as the screen controller and add one small marker controller if that creates the cleanest separation. The spatial layer should not own emergency states or medical copy.

---

## 15. Implementation sequence after approval

No implementation is included in this PR. Once the user approves the design:

1. Verify that the exact repository project opens in the user's Lens Studio 5.23.2 project with the intended SPECS 27 Preview configuration; inspect current project and scene before changing them.
2. Verify installed UIKit / SIK package public declarations and World Query API against the exact installed package and official specs-world-query skill. Do not rely on unverified snippets.
3. Implement the four-button category screen and persistent SOS while retaining existing controller/state logic.
4. Implement the dual-panel workspace for the existing bleeding/adult/other routes first, preserving every approved medical string.
5. Add the marker controller and Preview stand-ins, using World Query for explicit static surface placement if verified in Preview. Keep a skip path.
6. Complete official India-specific fire-source review and obtain approval before wiring the fire pathway.
7. Add LEAF scenarios for category selection, marker placement/fallback, persistent SOS, overview/current-step synchronization, progressive detail, existing routes and fire only after approval.
8. Run local compile, Preview and LEAF in the user's environment. No claims of test success until evidence is reported.
9. Tune layout only against actual Preview and user observations of readability, binocular overlap, marker stability and physical-scene obstruction.

---

## 16. Source review and references

### User-provided project sources

- codexsources/GAME PLAN do not change arwithspecs.txt — read and preserved; immutable.
- codexsources/Videoadvicetranscript.txt — hackathon / spatial experience framing.
- codexsources/arprojectsreviewed.txt — Aftershock, Next Hold and MWNP technical-field review transcripts.
- codexsources/lensstudiosublinks.txt — project-supplied link inventory.
- codexsources/emergencytext.txt — requested but not present at that path on the reviewed master branch (404).
- devpost/design-brief.md
- devpost/user-journey.md
- devpost/technical-architecture.md
- devpost/safety-boundaries.md
- devpost/acceptance-criteria.md
- devpost/medical-content-sources.md
- devpost/preview-demo-plan.md
- devpost/test-report.md
- README.md
- Assets/Scripts/Lifeline/LifelineEmergencyUI.ts
- Assets/Scripts/Lifeline/LifelineStateMachine.ts
- Assets/Scripts/Lifeline/LifelineTypes.ts
- Assets/Scripts/Lifeline/LifelineGuidanceContent.ts
- Assets/Scripts/Lifeline/LifelineController.ts
- Assets/Scripts/Lifeline/LifelinePreviewSimulationController.ts
- MCP-Export/02-scene/scene-graphql.json
- MCP-Export/03-packages/installed-packages.json
- MCP-Export/04-assets/local-assets-and-package-files.json
- MCP-Export/04-assets/local-script-inventory.json
- MCP-Export/05-preview/preview-state.json
- MCP-Export/05-preview/runtime-capabilities.json
- MCP-Export/MCP-EXPORT-README.md

### Learn AR with SPECS

- https://github.com/challengepost/learn-specs
- https://github.com/challengepost/learn-specs/tree/main/skills/plan-lens
- https://github.com/challengepost/learn-specs/blob/main/skills/plan-lens/references/ar-design-rules.md
- https://github.com/challengepost/learn-specs/blob/main/skills/plan-lens/references/preview-limits.md

### Official CLAD / ls-extensions

- https://developers.specs.com/docs/clad/overview-section/agents-and-skills
- https://github.com/lens-studio-devs/ls-extensions/tree/main/plugins/ls-clad/skills/specs-build-ui
- https://github.com/lens-studio-devs/ls-extensions/blob/main/plugins/ls-clad/skills/specs-build-ui/references/gotchas.md
- https://github.com/lens-studio-devs/ls-extensions/blob/main/plugins/ls-clad/skills/specs-build-ui/references/helpers.md
- https://github.com/lens-studio-devs/ls-extensions/blob/main/plugins/ls-clad/skills/specs-build-ui/references/component-cheatsheet.md
- https://github.com/lens-studio-devs/ls-extensions/blob/main/plugins/ls-clad/skills/specs-build-ui/references/spectacles-spatial-design.md
- https://github.com/lens-studio-devs/ls-extensions/blob/main/plugins/ls-clad/skills/specs-world-query/SKILL.md
- https://github.com/lens-studio-devs/ls-extensions/blob/main/plugins/ls-clad/skills/specs-depth/SKILL.md
- https://github.com/lens-studio-devs/ls-extensions/blob/main/plugins/ls-clad/skills/specs-interaction-recipes/SKILL.md
- https://github.com/lens-studio-devs/ls-extensions/blob/main/plugins/ls-clad/skills/scene-construction/SKILL.md
- https://developers.specs.com/docs/clad/tools/test-your-lens-with-leaf

### Snap, Preview and AR UX

- https://ar.snap.com/download/v5-23-2
- https://developers.snap.com/spectacles/best-practices/design-for-spectacles/design-best-practices
- https://developers.snap.com/spectacles/best-practices/design-for-spectacles/positioning-sizing-content
- https://developers.snap.com/spectacles/best-practices/design-for-spectacles/designing-for-movement
- https://developers.snap.com/spectacles/get-started/start-building/preview-panel
- https://learn-specs.devpost.com/details/faqs
- https://design.google/library/transparent-screens

### Fire-source candidates (not yet approved)

- https://dgfscdhg.gov.in/fire-prevention
- https://dgfscdhg.gov.in/mass-awareness-in-print
- https://sdma.maharashtra.gov.in/en/dos-and-donts/

---

## 17. Verification statement

This is a **design proposal only**. No TypeScript or scene files were changed. The original Game Plan was not edited. The cloud review did not compile the Lens, inspect a live running scene, test World Query in the current Preview panel, run LEAF, or test the interface on physical SPECS hardware.

The MCP export itself reports that the exported editor project path differed from the repository workspace path and that the runtime scene query timed out. Therefore scene/package facts are taken from the checked-in source and exported snapshot, and the implementation phase must reconcile the user's actual open project with the repository before making edits.

**Approval requested:** approve or revise the four-category selector, user-selected surface-marker restrictions, two-panel guidance model, and conditional fire/evacuation pathway before any scripts or scene objects are changed.

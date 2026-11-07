# Lifeline — user journey

**Status: Draft; aligned to the design brief.**

## User

An adult bystander in India with little or no first-aid training. They are alarmed by a nearby collapse or serious external bleed and need to keep their attention and hands on the person.

## Main journey

| Stage | User situation/action | Lifeline response | Design requirement |
|---|---|---|---|
| 1. Emergency noticed | User sees someone collapse or suffer an injury. | Nothing is inferred from camera imagery. | Do not claim automatic emergency or patient detection. |
| 2. Activate | Say “Emergency” on supported hardware, or pinch “Start.” Preview shows a separate `SIMULATION — trigger voice: EMERGENCY` control. | Both paths transition to the same emergency screen. | No mandatory voice-only step. Simulation stays labelled. |
| 3. Get help | User sees the emergency state. | 112 is prominent immediately, with “Call emergency services now” and “Ask someone nearby to call 112.” A separate user action says “I have called 112.” | No questionnaire, no injury choice before 112, no false connected-call status. |
| 4. Choose guidance | Once help has been surfaced, the user pinches “Severe bleeding,” “Adult collapse,” or “Other emergency.” | Selected path starts at its first short step; 112 remains reachable. | Only the fixed three routes. |
| 5A. Severe bleeding | User keeps looking toward the injured person and applies the sourced action. | One instruction at a time: safety, help/barrier, pressure, maintain pressure, sourced follow-up. | No wound packing, tourniquet, advanced intervention, or visual claim to see the wound. |
| 5B. Adult collapse | User checks responsiveness and normal breathing, without a pulse check. | If unresponsive with absent/abnormal breathing including gasping, show emergency activation and adult compression steps. | Operator guidance and 112 stay visible; no pediatric steps. |
| 5C. Other emergency | User selects other or cannot identify a supported pathway. | “Call emergency services now. Follow the operator’s instructions.” 112 remains prominent. | No extra first-aid advice. |
| 6. Continue | User advances by pinch while helping. In adult CPR, an optional cadence aid runs. | Short, clear, stable instruction; 100–120/min cadence where implemented. | Do not imply the Lens can judge quality or that cadence proves correct compressions. |
| 7. Handoff | Emergency responders or the call operator take over. | Keep the emergency number and “follow the operator’s instructions” available. | No unverified treatment-completion claim. |

## Failure and fallback states

- **ASR unavailable, unauthenticated, or offline:** Show a calm message that voice activation is unavailable and leave the manual pinch path accessible; do not block entry to 112.
- **Preview:** Simulation button exercises the same emergency transition, visibly says simulation, and is not represented as actual speech recognition.
- **No phone-call launch:** Display 112 and tell user to use a phone or ask someone nearby. Acknowledgement is only the user's own confirmation.
- **Child/infant collapse:** Exclude guided CPR; show “This guided CPR path is for adults. Call 112 and follow the emergency operator’s instructions.”
- **Uncertain or unsupported condition:** “Call 112 and follow the emergency operator’s instructions.” No diagnosis or branching interview.

## Hands, gaze, and movement

The user looks at the person, not down at a phone or at a full-screen panel. Interaction is pinch-only after activation; voice is an optional shortcut. Keep a stable compact card slightly below the horizon, avoid big head turns, and provide visible hover/focus/selection feedback. There is no gesture requiring a raised arm or holding a device.

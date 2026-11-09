import { GuidanceStep, LifelinePath } from "./LifelineTypes";

/**
 * User-facing first-aid copy transcribed only from devpost/medical-content-sources.md.
 * Keep adult CPR depth measurement out of this visual-only MVP.
 */
export const LIFELINE_GUIDANCE: Record<"bleeding" | "adult_collapse", readonly GuidanceStep[]> = {
  bleeding: [
    { id: "scene_safety", text: "Approach only if it is safe to help." },
    { id: "get_help", text: "Get emergency help. Ask someone nearby to call 112." },
    { id: "barrier", text: "Use gloves or another barrier if available." },
    {
      id: "direct_pressure",
      text: "Press firmly on the wound with clean material or a dressing.",
    },
    { id: "maintain_pressure", text: "Keep firm pressure on the wound." },
    {
      id: "blood_through",
      text: "If blood comes through, add more material on top and keep pressing.",
    },
    {
      id: "embedded_object",
      text: "If an object is embedded, leave it in place. Press around it.",
    },
    {
      id: "secure_dressing",
      text: "When severe bleeding is controlled, a dressing may help keep the material in place.",
    },
  ],
  adult_collapse: [
    { id: "adult_only", text: "This guided CPR path is for adults." },
    { id: "responsiveness", text: "Check if the adult responds." },
    {
      id: "breathing",
      text: "If they are unresponsive and not breathing normally — including gasping — treat this as a possible cardiac arrest.",
    },
    {
      id: "get_help",
      text: "Get emergency help now. Ask someone nearby to call 112.",
    },
    {
      id: "compressions",
      text: "Begin chest compressions. Push hard and fast in the centre of the chest.",
    },
    {
      id: "cadence",
      text: "Follow the rhythm: 100–120 compressions per minute.",
    },
    {
      id: "recoil",
      text: "Let the chest come fully back up between pushes.",
    },
    {
      id: "operator",
      text: "Call 112 and follow the emergency operator's instructions.",
    },
  ],
};

/** Evacuation-only fire/smoke steps sourced in devpost/medical-content-sources.md. */
export const FIRE_SMOKE_GUIDANCE: readonly GuidanceStep[] = [
  {
    id: "raise_alarm",
    title: "Raise the alarm",
    summary: "Alert people nearby",
    text: "Raise the alarm and alert people nearby. Tell them to leave the building.",
  },
  {
    id: "safe_exit",
    title: "Use a safe exit",
    summary: "Take the closest safe route",
    text: "Leave using the closest safe exit.",
  },
  {
    id: "stay_low",
    title: "Stay low in smoke",
    summary: "Keep low while moving out",
    text: "If smoke is in your way out, stay as low as you can while moving towards the exit.",
  },
  {
    id: "no_lifts",
    title: "Use stairs, not lifts",
    summary: "Do not use elevators",
    text: "Use the stairs. Do not use lifts or elevators.",
  },
  {
    id: "assembly_area",
    title: "Reach the assembly area",
    summary: "Stay for the all-clear",
    text: "Move to the designated evacuation assembly area and remain there until the all-clear is given.",
  },
  {
    id: "do_not_reenter",
    title: "Do not go back inside",
    summary: "Wait for official advice",
    text: "Do not re-enter the building until authorities advise it is safe.",
  },
  {
    id: "contact_services",
    title: "Contact emergency services",
    summary: "Call 112 or Fire Services 101",
    text: "Once you are outside and safe, contact emergency services: 112 for integrated response or 101 for Fire Services.",
  },
];

export const OTHER_EMERGENCY_INSTRUCTIONS: readonly string[] = [
  "Call 112 now.",
  "Follow the emergency operator's instructions.",
];

export const LIFELINE_SAFETY_STATEMENT =
  "Lifeline provides basic first-aid guidance. It does not replace emergency services or professional care. Follow the emergency operator's instructions.";

export function getGuidanceSteps(path: LifelinePath): readonly GuidanceStep[] {
  if (path === "bleeding") return LIFELINE_GUIDANCE.bleeding;
  if (path === "adult_collapse") return LIFELINE_GUIDANCE.adult_collapse;
  if (path === "fire_smoke") return FIRE_SMOKE_GUIDANCE;
  return OTHER_EMERGENCY_INSTRUCTIONS.map((text, index) => ({
    id: `other_${index + 1}`,
    text,
  }));
}

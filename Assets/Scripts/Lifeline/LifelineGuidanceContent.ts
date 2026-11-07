import { GuidanceStep, LifelinePath } from "./LifelineTypes";

/**
 * User-facing first-aid copy transcribed only from devpost/medical-content-sources.md.
 * Keep adult CPR depth measurement out of this visual-only MVP.
 */
export const LIFELINE_GUIDANCE: Record<Exclude<LifelinePath, "other">, readonly GuidanceStep[]> = {
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

export const OTHER_EMERGENCY_INSTRUCTIONS: readonly string[] = [
  "Call 112 now.",
  "Follow the emergency operator's instructions.",
];

export const LIFELINE_SAFETY_STATEMENT =
  "Lifeline provides basic first-aid guidance. It does not replace emergency services or professional care. Follow the emergency operator's instructions.";

export function getGuidanceSteps(path: LifelinePath): readonly GuidanceStep[] {
  if (path === "bleeding") return LIFELINE_GUIDANCE.bleeding;
  if (path === "adult_collapse") return LIFELINE_GUIDANCE.adult_collapse;
  return OTHER_EMERGENCY_INSTRUCTIONS.map((text, index) => ({
    id: `other_${index + 1}`,
    text,
  }));
}

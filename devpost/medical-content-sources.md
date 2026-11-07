# Lifeline — medical content sources

**Checked:** 2026-11-06  
**Scope:** India emergency number; adult bystander CPR; severe external bleeding. Content is for planning and must be reviewed again before release. No claim of clinical or regulatory approval.

## India emergency number

| Proposed exact user-facing text | Source / version | Section | Limits |
|---|---|---|---|
| “Call emergency services now. India emergency number: 112.” | Ministry of Home Affairs, Government of India, **Emergency Response Support System (ERSS)**, current web page; checked 2026-11-06. [URL](https://www.mha.gov.in/emergency-response-support-system-erss) | Page describes 112 as the pan-India unified emergency number for police, fire, health and other emergencies. | Use only for India setting (`IN`). This is not universal. Do not include 911. This sentence is concise paraphrase, not a direct quotation. |
| “Ask someone nearby to call 112.” | Same MHA 112 source for number plus bystander instruction in first-aid/cardiac-arrest guidance; checked 2026-11-06. | Emergency activation/help action. | The MHA page validates 112, while the bystander delegation wording is aligned to CPR guidance and is phrased for a bystander. |

The National Portal of India helpline directory was inspected, but its parsed content did not expose a specific 112 entry in the available page view. The MHA ERSS source is the primary verification for 112 in this plan. [National Portal directory](https://www.india.gov.in/directory/helpline)

## Severe external bleeding

Primary source: IFRC, **International First Aid, Resuscitation and Education Guidelines 2025**; version 2025, hosted PDF retrieved from the official IFRC document page; checked 2026-11-06. Relevant section: **Severe bleeding**, printed pages 255–257 (PDF page indices around 257–259 depending on viewer), especially key action and first-aid steps. [Official IFRC source and PDF](https://www.ifrc.org/document/ifrc-international-first-aid-resuscitation-and-education-guidelines-2025)

| Exact proposed UI copy | Source section/page | Limits / implementation note |
|---|---|---|
| “Approach only if it is safe to help.” | IFRC 2025, general first-aid principles and severe bleeding first-aid steps, pp. 255–257. | No need to instruct a bystander to enter an unsafe scene. |
| “Get emergency help. Ask someone nearby to call 112.” | IFRC 2025 severe bleeding: access EMS for severe bleeding; MHA ERSS validates 112. | India-specific number. Do not let an injury questionnaire delay this instruction. |
| “Use gloves or another barrier if available.” | IFRC 2025 severe bleeding, first-aid steps, pp. 256–257: gloves/barrier (e.g., plastic bag) where available. | “If available” avoids delaying help to find PPE; do not imply no risk. |
| “Press firmly on the wound with clean material or a dressing.” | IFRC 2025 severe bleeding, key action/first-aid steps, pp. 255–257: direct manual compression; clean clothes/towel can be improvised. | User-facing paraphrase; no wound packing or pressure-point instruction. Maintain an on-screen 112 route. |
| “Keep firm pressure on the wound.” | IFRC 2025 severe bleeding, key action, pp. 255–256. | Do not ask the bystander to repeatedly lift the dressing to inspect. |
| “If blood comes through, add more material on top and keep pressing.” | IFRC 2025 severe bleeding, first-aid steps, p. 257. | Add on top; do not remove the first dressing. |
| “If an object is embedded, leave it in place. Press around it.” | IFRC 2025 severe bleeding, first-aid steps, p. 257. | Do not attempt removal or wound packing. |
| “When severe bleeding is controlled, a dressing may help keep the material in place.” | IFRC 2025 severe bleeding, p. 256–257; distinguishes direct manual compression from a pressure dressing. | Keep exact bandaging instruction narrow; no tight-wrap measurement or circulation check added. Remove this sentence if the final content reviewer cannot verify exact context. |

**Excluded techniques:** IFRC discusses tourniquets and hemostatic dressings with conditions/training complexity. They are excluded from this untrained-bystander MVP. Wound packing is excluded. No instruction to apply pressure to an embedded object is proposed; pressure goes around it.

## Adult collapse / possible cardiac arrest

Primary source: American Heart Association, **2025 Adult Basic Life Support Guidelines**, checked 2026-11-06. The guideline says it applies to trained and untrained lay rescuers, and specifically distinguishes adult from pediatric BLS. Relevant sections: adult cardiac-arrest recognition / lay rescuer recommendations and adult compression rate, depth, recoil; algorithm “Adult Basic Life Support for Lay Rescuers” (Figure 2). [Official guideline](https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-basic-life-support)

| Exact proposed UI copy | Source/version/section | Limits / implementation note |
|---|---|---|
| “Check if the adult responds.” | AHA 2025 Adult BLS, lay-rescuer recognition/algorithm. | Adult path only; no patient diagnosis. |
| “If they are unresponsive and not breathing normally — including gasping — treat this as a possible cardiac arrest.” | AHA 2025 Adult BLS, recognition recommendation and lay-rescuer algorithm. | “Possible” avoids diagnosis; do not ask for a pulse check. If uncertain, 112/operator guidance remains immediate. |
| “Get emergency help now. Ask someone nearby to call 112.” | AHA 2025 Adult BLS: lone responder activates emergency response first; India-specific number from MHA ERSS. | AHA materials may show US 911; replace with 112 for this India MVP. Never surface 911 in app copy. |
| “Begin chest compressions. Push hard and fast in the centre of the chest.” | AHA 2025 Adult BLS, adult lay-rescuer pathway and compression recommendation; AHA public Hands-Only CPR resource also describes adult compression-only response. | For adult only. No ventilation instructions in this MVP. If the person is a child/infant, direct to 112 and the operator. |
| “Follow the rhythm: 100–120 compressions per minute.” | AHA 2025 Adult BLS, recommendation 4.3, compression rate (100–120/min). | Cadence aid is a pace cue only; no claim that it evaluates quality. Must be verified at run time; omit if timing is unreliable. |
| “Let the chest come fully back up between pushes.” | AHA 2025 Adult BLS, recommendation to allow complete chest wall recoil. | Concise paraphrase; only show in adult CPR path. |
| “This guided CPR path is for adults. Call 112 and follow the emergency operator’s instructions.” | AHA 2025 Adult BLS scopes adults separately from pediatric guidelines; India number from MHA. | No child/infant CPR instructions are included. This boundary is an app policy, not a replacement for operator advice. |

**Not included:** pulse checks; pediatric/infant CPR; ventilation ratios; AED operation instructions; medical causes or diagnosis; compression-depth measurement by the Lens. The AHA 2025 recommendation is at least 5 cm for an average adult while avoiding depths over 6 cm, but visual-only AR cannot verify depth, so do not imply that a visual guide measures it. Operator instructions take precedence.

## Source caveats and review

- Indian Red Cross Society First Aid page links to its 2016 manual and training; that is older than IFRC's 2025 guidelines and the page itself did not provide detailed bleeding instructions. It was not used as the controlling source for the proposed exact lines. [IRCS First Aid](https://www.indianredcross.org/ircs/program/firstaid/)
- The supplied AHA International Hands-Only CPR URL returned 404 during checking. Use the current 2025 Adult BLS guideline as controlling source; AHA’s current CPR explainer is also linked here: [What is CPR](https://cpr.heart.org/resources/what-is-cpr). The explainer contains US-specific 911 references, which must not appear in India UI.
- Re-check sources and wording immediately before implementation and again before any public release. If source section context cannot be confirmed, omit the line and fall back to 112/operator instructions.

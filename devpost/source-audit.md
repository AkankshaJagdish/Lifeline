# Lifeline — source and project audit

**Audit date:** 2026-11-06  
**Scope:** Project folder, parent/reference locations, provided `codexsources`, official linked research, and read-only Lens Studio MCP inspection. The immutable Game Plan was read completely and not modified.

## Supplied project files

| Requested source | Read status | Relevant requirements / lessons | Gaps or conflicts |
|---|---|---|---|
| `codexsources/GAME PLAN do not change arwithspecs.txt` | **Read completely** | Occupied Hands; CLAD/Lens Studio MCP/SIK/UI Kit/Preview/LEAF workflow; spatial moment, Preview stand-in, placement numbers, binary Done Criteria. Treated as authoritative and immutable. | Preserved as supplied. Older guidance must not silently override current official docs. |
| `codexsources/learnarwithspecshackathon.txt` | **Read completely** | Hackathon context, setup and planning steps; use Devpost planning outputs and show end-to-end project. | Local copy includes older or generic scoring/requirements. Current Devpost official rules control where they conflict. |
| `codexsources/Screenshot 2026-11-05 173627.png` | **Viewed** | Preview can show spatial placement, movement and pinch/button stand-ins; recognition needs an explicit “found it” style stand-in. | Screenshot is secondary context; not proof of current tool behavior. |
| `codexsources/Screenshot 2026-11-05 173702.png` | **Viewed** | Interview → design brief → CLAD build/test → Preview and iterate; favor a basic working flow and a one-minute repair loop. | Older workflow phrasing reconciled with current CLAD docs. |
| `codexsources/Videoadvicetranscript.txt` | **Read completely** | Distinctive AR shares the real-world view, draws meaningful content in physical context, and frees the user's hands; avoid a conventional laptop/phone UI floating in view; progressive disclosure and forgiving pinch targets. | No source issue. |
| `codexsources/usethelinksonthispage.txt` | **Missing** | User identified it as pointing to Devpost resources. | Exact file not found in project, parent, or searched reference folders. The resources page was opened directly using the supplied URL instead. |
| `codexsources/lensstudiosublinks.txt` | **Read completely** (2,405 lines, including URL list and full CLAD webinar transcript) | Linked docs and transcript cover LS/CLAD setup, agent/skill workflows, troubleshooting, Preview, spatial design, LEAF, samples, and iterative build discipline. Transcript emphasizes planning, layout issues, basic flow first, and Preview limits. | Contains obsolete/malformed or changed links and older generic hackathon advice; see conflict notes below. |
| `codexsources/arprojectsreviewed.txt` | **Read completely** | Judges value coherent useful spatial ideas, clear audience/journey, appropriate scale, and an end-to-end demo. Feedback warns against website-like score panels, information overload, tiny/unclear controls, excess features, and unclear presentations. One-at-a-time progressive disclosure and two clear large controls received positive feedback. | Past project comments are qualitative examples, not current formal rules. |
| `codexsources/emergencytext.txt` | **Missing** | Would define original audience, product intent and safety boundaries. Those requirements are supplied explicitly in the user's project brief and treated as current direction. | Exact file not found in project, parent, or searched reference folders; it has not been read. |

## Important local-source conflicts

- Some older strategy text gives generic/variable judging percentages or three broad categories. Current official Learn AR with SPECS rules specify **four equally weighted** criteria: Design, Technical Implementation, Innovation/Idea, Presentation. See [official rules](https://learn-specs.devpost.com/rules).
- Older sources can imply object/model recognition or broaden capability beyond Preview. Current concept excludes patient/object recognition; Preview uses only an explicit labelled simulation for voice activation.
- The user-provided medical scope fixes India, 112, adult-only CPR and no advanced techniques. These constraints supersede any US-specific emergency number or unrelated local example.
- Missing `emergencytext.txt` is not silently inferred from prior chat; the explicit current user brief is used as the product and safety source.

## Current hackathon requirements

The current official rules require a newly created SPECS Lens built through the Learn skill pack and CLAD/Lens Studio/MCP, able to run consistently in its intended Preview; a public code repository containing the project; a text description; and a public YouTube demo under three minutes. Planning documents in `devpost/` are welcome but not mandatory in the rules text, while the Learn resources FAQ says the repository should include the `devpost/` folder. This is recorded as a wording difference; this project preserves all requested planning outputs. Rules also specify four equally weighted judging criteria: Design, Technical Implementation, Innovation/Idea and Presentation. [Official rules](https://learn-specs.devpost.com/rules) · [Learn resources](https://learn-specs.devpost.com/resources)

## Devpost resources page and linked technical research

The supplied URL `https://learn-specs.devpost.com/resources` was opened. It links official setup guidance and directs use of Lens Studio 5.22+ with the SPECS Base Template, CLAD installation, the Learn skill pack and `plan-lens`. The current guidance confirms Lens Studio should be open on the project before starting the coding agent. The current rules page was reviewed and supplies four equal judging criteria.

| Area | Current source checked | Audit result |
|---|---|---|
| Lens Studio setup | [Learn AR resources](https://learn-specs.devpost.com/resources), Snap [Spectacles setup](https://developers.snap.com/spectacles/get-started/start-building) | Existing project opens as Lens Studio 5.23.2.26081320 Public, Spectacles target. No updates or migration performed. |
| CLAD setup | [CLAD docs](https://developers.specs.com/docs/clad), current resource page | CLAD-related agent tools/skills are available and Lens Studio MCP authorization is active. No setup changes made. |
| Codex CLI | [Codex setup](https://developers.specs.com/docs/clad/setup/setup-ai/codex-setup) | Current guide says Lens Studio should be open on the project before Codex, install/verify `ls-clad`, and confirm `lens-studio` under `/mcp`. MCP is connected and CLAD tools are available; no install commands run. |
| MCP troubleshooting | [Troubleshoot Lens Studio MCP](https://developers.specs.com/docs/clad/troubleshooting/troubleshoot-lens-studio-mcp) | Checked server state, MCP recognition and required Lens Studio plugins guidance. Current MCP path/auth are confirmed; project compile/Preview issue is separate. |
| Plugin troubleshooting | [Troubleshoot Lens Studio Plugin](https://developers.specs.com/docs/clad/troubleshooting/troubleshoot-lens-studio-plugin), [ls-extensions README](https://github.com/lens-studio-devs/ls-extensions) | Current guidance says to use latest README steps and reload/enable the agent plugin if not recognized. CLAD is available here; no plugin edits made. |
| CLAD agents and skills | [Agents and skills](https://developers.specs.com/docs/clad/overview-section/agents-and-skills) | Installed skills are available; use SPECS experience builder in later implementation. Do not import an entire sample architecture. |
| CLAD development loop | [CLAD overview](https://developers.specs.com/docs/clad), [How CLAD Works](https://developers.specs.com/docs/clad/overview-section/how-clad-works), [agents and skills](https://developers.specs.com/docs/clad/overview-section/agents-and-skills) | Official CLAD docs describe design/build/test loops, Preview verification, LEAF and separate implementation skills. This planning phase has not begun implementation. |
| Preview capability | [Preview Panel](https://developers.snap.com/spectacles/get-started/start-building/preview-panel) | Current official page describes additive rendering simulation for Spectacles (2024), Interactive Preview and device-type override. It does not establish real mic/ASR or call verification. |
| LEAF install/create/test | [Test Your Lens with LEAF](https://developers.specs.com/docs/clad/tools/test-your-lens-with-leaf) | Read current instructions: install `Leaf.lspkg`, match its version to SIK/Lens Studio, register `Scenario` classes, use SIK interactors/assertions and run in Preview. No `Leaf.lspkg` was present in installed project package roots; MCP hooks exist, but panel open failed, so scenarios could not be inspected or run. |
| Snap spatial design | [Design best practices](https://developers.snap.com/spectacles/best-practices/design-for-spectacles/design-best-practices) | Center content in comfortable binocular view, near ~1 m for detail; reduce cognitive load and arm/head movement. |
| Positioning/sizing | [Positioning and sizing](https://developers.snap.com/spectacles/best-practices/design-for-spectacles/positioning-sizing-content) | 6 cm is a good button starting size at 110 cm; keep usable targets/spacings, avoid monocular side placement. Brief proposes 105 cm and verifies in Preview. |
| Movement | [Designing for movement](https://developers.snap.com/spectacles/best-practices/design-for-spectacles/designing-for-movement) | Stable placement and movement-aware content; keep glanceable and avoid excessive head motion. |
| SIK / UI Kit | [SIK](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/get-started), [UI Kit](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-ui-kit/get-started) | Both packages installed at 2.0.0 via MCP. Project implementation should use standard pinch/UI patterns. |
| Official samples | [SPECS samples](https://github.com/specs-devs/samples), [Agent Manager ASR controller](https://github.com/specs-devs/samples/blob/main/Agent%20Manager/Assets/Scripts/Input/VoiceInputController.ts), [voice error UI](https://github.com/specs-devs/samples/blob/main/Agent%20Manager/Assets/Scripts/UI/AgentInputBar.ts), [Essentials](https://github.com/specs-devs/samples/tree/main/Essentials) | Current source for both named Agent Manager files was fetched and read. Voice controller explicitly manages ASR listening and partial/final/error events. UI error handling notes NoInternet and microphone restrictions for camera+internet unless Extended Permissions are enabled. Adapt only these narrow patterns; do not import Agent Manager architecture. |

## Medical source audit

| Source | Result | Use / limitation |
|---|---|---|
| [MHA ERSS / 112](https://www.mha.gov.in/emergency-response-support-system-erss) | Opened and checked 2026-11-06. | Nationwide unified 112 number for police, fire, health and other emergencies; used for India-only `IN` setting. |
| [National Portal helpline directory](https://www.india.gov.in/directory/helpline) | Page opened; parsed view did not expose a specific 112 entry. | Not used as the controlling number source; gap noted. |
| [Indian Red Cross First Aid](https://www.indianredcross.org/ircs/program/firstaid/) | Opened and checked 2026-11-06. | Program page links older 2016 Indian First Aid Manual/training but did not expose detailed bleeding instructions. Not used as controlling text. |
| [IFRC 2025 Guidelines](https://www.ifrc.org/document/ifrc-international-first-aid-resuscitation-and-education-guidelines-2025) | Official page/PDF checked 2026-11-06. | Severe bleeding section pp. 255–257 supports direct pressure, barrier use where possible, emergency help, and limited dressing steps. Advanced techniques excluded. |
| [AHA 2025 Adult BLS](https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-basic-life-support) | Official guideline page checked 2026-11-06. | Adult bystander recognition, emergency activation, compressions, 100–120/min and recoil. Separate pediatric guidance excluded. AHA US-localized examples must be translated to India 112. |
| Supplied [AHA International Hands-Only CPR URL](https://international.heart.org/hands-only-cpr) | Returned 404 at check. | Treat as outdated/unavailable; current AHA 2025 Adult BLS is primary reference. |

Detailed exact text, section references, versions and population limits are in [`medical-content-sources.md`](medical-content-sources.md).

## Lens Studio MCP project inspection

- **Project path:** `C:/Users/akank/NonUploadOneDrive/Coding/LensStudio/Lifeline/Lifeline.esproj`; MCP authorization true.
- **Lens Studio version:** 5.23.2.26081320 Public.
- **Target platform:** Manifest `Spectacles`; Preview label at inspection was `SPECS 27`. Official Preview page reviewed describes Spectacles (2024). The labels do not establish cross-generation compatibility; no migration or target change was made.
- **Scene/assets:** Spectacles Base Template scene. No Lifeline-authored application scripts/assets found; template and installed package contents are present.
- **Packages:** Spectacles Interaction Kit 2.0.0 and Spectacles UI Kit 2.0.0. Additional installed package content includes an AI preview agent inspect package.
- **CLAD:** Agent-side skills and MCP tools are available. No code written in this planning stage.
- **LEAF:** No `Leaf.lspkg` was present in the project's installed `Packages/` roots. MCP LEAF hooks exist, but `open_leaf_panel` failed with internal “Panel can not be null.” No scenario list or LEAF execution could be verified.
- **Repository:** `git status` reports this project directory is not a Git repository. Public repository creation is still required for eventual hackathon submission.
- **Compile:** `RecompileTypeScriptTool` failed in existing `AiPreviewAgentInspect.lspkg` example scripts due module paths `UIKit.lspkg` and `InteractionKit.lspkg` not matching the installed `SpectaclesUIKit.lspkg` and `SpectaclesInteractionKit.lspkg`. No files/packages modified to fix it.
- **Preview:** screenshot capture returned “Preview not ready” while TypeScript errors prevented rendering. Therefore the project does not currently have a verified functioning Preview state.
- **Phone calling:** No supported phone-call launching API was located in the official Spectacles documentation reviewed. Treat it as unavailable/unverified; UI only shows 112 and directs the user to a phone/helper.
- **ASR:** Official ASR docs require Lens Studio 5.9+ and Spectacles OS 5.61+ and say the API is Spectacles-only. Editor minimum is met; current device OS, internet/authentication and actual phrase recognition remain unverified. Preview simulation is not ASR verification.

## Planning outputs

Created as drafts under `devpost/`: design brief, user journey, technical architecture, medical content sources, safety boundaries, acceptance criteria, Preview demo plan, and this source audit. No application code, scene edits, package changes, migration, or Game Plan modifications were made.

## Later implementation and repository snapshot � 2026-11-06

This section supersedes earlier planning-stage observations that Lifeline scripts or LEAF were absent:

- The project now contains Lifeline TypeScript source under `Assets/Scripts/Lifeline/`, including an identical duplicate `LifelineTypes 2.ts`. These files are not attached to the live scene.
- MCP reports SIK 2.0.0, UI Kit 2.0.0, and LEAF 2.0.2. The installed LEAF path is `Packages/Leaf 2.lspkg`, but its sources import `Leaf.lspkg/...`; MCP rename failed. No LEAF scenarios are registered.
- A current compile attempt fails on LEAF package imports and old package aliases in AI Preview Inspect examples. The latest detailed result is in `test-report.md`.
- The live scene remains Specs Base Template with no Lifeline root or LeafIndex. No actual Lifeline Preview interaction is verified.
- A repository hygiene pass found local MCP credentials in ignored per-machine configuration files and a root signing key. `.gitignore` excludes these, as well as Lens Studio generated cache/workspace/support files. They must not be included in a public commit.
- The project was initially not a Git repository; GitHub CLI was not installed. Current repository setup and remote status are recorded in the final checklist and handoff.

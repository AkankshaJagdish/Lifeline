# Lifeline — final public repository checklist

**Snapshot:** 2026-11-07. This checklist distinguishes repository inspection, user-reported Preview evidence, and tests that still require Lens Studio or hardware. A source file or planned test is not runtime evidence.

| Checklist item | Status | Evidence / remaining action |
|---|---|---|
| Public GitHub repository exists | **Pass (repository available)** | `AkankshaJagdish/Lifeline` is accessible on GitHub; default branch is `master`. |
| Merged Lifeline scene integration | **Pass (static repository inspection)** | Merged scene contains Lifeline Experience root, Input Adapters child, Instruction Panel child, and serialized references. |
| Project opens in Lens Studio | **User-reported / not independently checked here** | User reports actual Interactive Preview testing of the core interaction. No current editor screenshot or project-open log supplied to this cloud review. |
| Core Interactive Preview interaction | **User-reported pass** | User reports the core interaction passed actual Lens Studio Interactive Preview. Exact action list, screenshot, and fresh runtime logs are not attached here. |
| Latest branch TypeScript compile | **Not yet** | This verification branch changes optional ASR lifecycle code. Recompile locally before accepting/merging. |
| Fresh runtime diagnostics / firstActivityAtMs | **Not yet** | Collect after successful compile; record errors, prints, and `firstActivityAtMs`. |
| Fresh Preview screenshot | **Not yet** | Capture actual rendered UI and inspect text, physical stand-in, central-view obstruction, and stability. |
| Manual ACTIVATE | **User-reported core flow; exact evidence pending** | Confirm the current branch still behaves as expected after compile. |
| Preview voice simulation | **User-reported core flow; exact evidence pending** | Confirm exact label `SIMULATION — trigger voice: EMERGENCY`; test with voice disabled and no microphone access. |
| 112 / call instructions / user acknowledgement | **Source-reviewed; action-level evidence pending** | Confirm 112 is immediate; call instructions return correctly; acknowledgement remains separate from any claim of a placed call. |
| Severe bleeding every step | **Source-reviewed; full Preview evidence pending** | Compare each displayed instruction with `medical-content-sources.md`. |
| Adult collapse every step | **Source-reviewed; full Preview evidence pending** | Confirm adult-only boundary, recognition wording, emergency help first, adult compression guidance, and no pulse/pediatric content. |
| Other emergency | **Source-reviewed; Preview evidence pending** | Confirm only the 112 / operator fallback is shown. |
| Back / Repeat / Next / End / Cancel / return to idle | **User-reported core flow; exact evidence pending** | Exercise every action on the current branch and record results. |
| Physical-person stand-in remains visible | **Not independently verified** | Requires current Preview screenshot and camera movement test. |
| Panel does not obstruct central view | **Not independently verified** | Requires current Preview screenshot and camera movement test. |
| Camera movement stability / readability | **Not independently verified** | Requires local Preview camera movement. |
| ASR API / official Agent Manager sample review | **Pass (source review)** | Snap ASR docs and official `VoiceInputController.ts` / `AgentInputBar.ts` reviewed. |
| Optional ASR lifecycle changes | **Authored; compile pending** | Stops on active emergency state, ignores late callbacks, awaits stop before restart, and restarts only after active-to-IDLE. |
| Unauthenticated / internet / permission fallbacks | **Authored; runtime pending** | `Unauthenticated`, `NoInternet`, and `InternalError` / start failures show a manual ACTIVATE fallback. |
| Hardware ASR | **Not tested** | Requires compatible Spectacles hardware/OS, internet, authentication, and microphone permissions. No real voice-recognition pass is claimed. |
| Current installed LEAF version | **Not verified in this cloud session** | Confirm the current package version in Lens Studio. Do not rely on older MCP export snapshots or change package versions. |
| Four LEAF scenarios / LeafIndex | **Blocked; not registered** | Official Live Lens Tester requires Lens Studio MCP for scene inspection, package verification, authoring, attachment, compile, and run. MCP is unavailable here; no scenarios are claimed. |
| LEAF Preview results | **Not run** | Run scenarios serially after they are registered; preserve Lens-side scenario-manager pass/fail lines. |
| Medical copy source register | **Pass (documentation / static source review)** | `medical-content-sources.md` documents the source lines and exclusions. This is not clinical validation. |
| No prohibited medical content in UI scripts | **Pass (static source scan)** | No user-facing 911 text, call-success claim, diagnosis/patient recognition, pulse-check instruction, pediatric/infant CPR, wound packing, or tourniquet advice found in Lifeline UI/guidance scripts. |
| Actual emergency call | **Not implemented** | UI displays instructions and a user acknowledgement only. |
| Under-three-minute demo sequence | **Pass (script prepared)** | `demo-video-script.md` targets 2:55. Actual recording and duration check remain outstanding. |
| Submission description | **Draft; update after validation** | Do not describe unverified ASR, LEAF, Preview, or calling behavior as working. |
| Secret / credential scan | **Not yet** | Run a full scan of the exact public release commit before final submission. Do not publish local credentials, signing keys, or personal data. |
| Original Game Plan unchanged | **Pass (repository preservation check)** | `codexsources/GAME PLAN do not change arwithspecs.txt` was not edited in this branch. |

## Local completion order

1. Sync this verification branch / PR into the confirmed Lifeline project and open the exact `Lifeline.esproj` in Lens Studio 5.23.2.26081320 Public.
2. Recompile TypeScript. If compilation fails, stop and capture complete inline diagnostics.
3. After a clean compile, collect runtime logs and inspect errors, prints, and `firstActivityAtMs`.
4. Open Interactive Preview, capture a screenshot, and inspect the actual rendered UI and physical stand-in.
5. Run the complete manual / simulation / emergency / guidance / navigation / end-session matrix in `test-report.md`.
6. Verify camera movement, panel stability, readability, target feedback, and unobstructed central view.
7. Confirm the currently installed LEAF package and LeafPlugin. The official Live Lens Tester requires Lens Studio MCP to author and register the four mapped scenarios; do not treat the planned IDs in README as runnable tests.
8. If LEAF scenarios are registered, run them serially and record each clean outcome plus the Lens-side scenario-manager log line. Do not retry timeouts blindly.
9. Test optional ASR separately on compatible Spectacles hardware. Keep manual pinch available and record permissions, network, authentication, and ASR error status. Do not claim hardware ASR based on Preview simulation.
10. Recheck every rendered medical string against `medical-content-sources.md`; repeat the prohibited-content scan.
11. Run a full secret scan on the exact public release commit. Confirm the Game Plan remains unchanged.
12. Record the actual Preview demo using `demo-video-script.md`, check the complete video is under 180 seconds, and update the Devpost description from verified behavior only.

## Merge / submission gate

Do not merge this verification branch or mark the project submission-ready until the new ASR code compiles and the local regression matrix passes. LEAF, hardware ASR, spatial comfort, and any criterion that remains blocked must stay explicitly labelled as such. The project must not be represented as clinically validated or as placing emergency calls.

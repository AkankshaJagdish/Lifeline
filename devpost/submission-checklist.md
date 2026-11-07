# Submission readiness checklist

Status is based on project and MCP evidence observed on 2026-11-06. “Not yet” means not demonstrated. A file's existence does not count as runtime verification.

| Checklist item | Status | Evidence / remaining action |
|---|---|---|
| Project opens in Lens Studio | **Pass (open observed)** | `Lifeline.esproj` opened through Lens Studio MCP. Its current scene/manifest metadata remains the Specs Base Template. |
| Lens compiles | **Fail** | TypeScript compile reports unresolved LEAF package imports and obsolete AI Preview Inspect aliases. |
| Preview shows the actual Lifeline Lens | **Fail** | Current scene snapshot contains no Lifeline root/UI. No working Lifeline Preview frame was observed. |
| Manual activation works | **Not yet** | No integrated Lifeline UI to interact with. |
| Preview voice simulation works | **Not yet** | The authored simulation path was not exercised in Preview. It must remain labelled simulation. |
| 112 is displayed correctly for India | **Not yet** | India configuration and source register exist; runtime display is unverified. |
| Severe bleeding pathway works | **Not yet** | Source text exists; no runtime journey or scenario was run. |
| Adult collapse pathway works | **Not yet** | Source text exists; no runtime journey or scenario was run. |
| Other-emergency fallback works | **Not yet** | No runtime journey was run. |
| Medical guidance has source references | **Pass (documentation)** | See `medical-content-sources.md`; this is a documented source register, not clinical validation. |
| Safety boundaries are documented | **Pass (documentation)** | See `safety-boundaries.md`. |
| LEAF tests have been run, if available | **Fail / not run** | LEAF 2.0.2 is present, but package import errors block compilation; no Lifeline scenarios are registered. |
| Test report is included | **Pass (documentation)** | `test-report.md` records failures and unrun checks. |
| README is complete | **Pass (documentation)** | README describes intended features and current limitations. |
| `devpost/` planning folder is complete | **Pass (documents present)** | Required planning files are present; runtime success is not implied. |
| Prompt log is included | **Pass (reconstructed)** | `prompt-log.md` clearly states it is a reconstructed summary, not verbatim history. |
| Public repository is available | **Fail / unavailable** | No remote exists; `gh` is not installed. Do not invent a URL. |
| Demo video recording plan is ready | **Pass (script only)** | `demo-video-script.md` is ready; recording must wait for a verified Preview journey. |
| Video duration will be under three minutes | **Planned** | Script target is 2:50; actual duration must be checked after recording. |
| Submission description is ready | **Draft only** | `devpost-description.md` explicitly describes the current implementation caveat. Update after validation before submission. |
| No secrets are present in the public repository | **Pass for staged files; not published** | Staged-file pattern scan found no credential/key matches. Local config and signing-key files are ignored. Repeat a full secret scan before creating/pushing a public remote. |

## Required before recording or submitting

1. Resolve package imports using supported Lens Studio package management, then obtain a successful TypeScript compile.
2. Integrate Lifeline and LEAF scenarios into the actual scene using a supported Lens Studio scene workflow.
3. Run Preview interactions for activation, 112, each emergency path, repeat/back/next, cancel, and reset; update `test-report.md` with evidence.
4. Recheck medical UI strings against `medical-content-sources.md` and maintain the adult-only and no-diagnosis boundaries.
5. Re-scan the staged repository for secrets before publishing. Install/authenticate GitHub CLI or create a public repository manually, then add the actual remote URL.
6. Record the actual Lens Studio Preview demo, confirm duration under 180 seconds, and only then mark the corresponding items passed.


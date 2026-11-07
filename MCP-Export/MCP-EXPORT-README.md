# Lifeline Lens Studio MCP export

## Snapshot

Generated **2026-11-07** from the connected Lens Studio MCP session for the Lifeline workspace. The MCP responses carry their own timestamps where provided. This is a live read snapshot; it is not guaranteed to be synchronized with the checked-in repo because the editor reports a different open project path.

- Workspace/repository directory: `C:\Users\akank\NonUploadOneDrive\Coding\LensStudio\Lifeline`
- Open project reported by Editor API: `C:/Users/akank/AppData/Local/Temp/LensStudio_CmBeZT/Default/Project.esproj`
- Workspace manifest: `Lifeline.esproj`
- Lens Studio version: **5.23.2.26081320 Public** (from workspace manifest; editor API version property was not returned by this invocation)
- Workspace target platform: **Spectacles**
- Authorization: Editor API read returned `isAuthorized: true`; no authorization change or sign-in was attempted.
- Scene ID in workspace manifest: `0a1ccb1a-fe88-4fbb-9883-e3af3c75fd99`

## Contents and provenance

Files named `*-response.json` and the other JSON captures under the numbered folders preserve complete MCP CallToolResult wrappers as returned, including text payloads and errors. The scene query returned 5 scene objects; the asset query returned 969 assets. The package response includes the complete response details returned by the package tool. `logger-tail.json` is the MCP tail-mode response; Lens Studio marked the log response truncated, so it is not a complete historical log file.

The categorized MCP inventory files contain tool names, descriptions, and the input-schema declaration text surfaced to this session. Capability notes and `diagnostics-status.json` are summaries prepared for this export. The project manifest file is a summary of relevant values from the workspace `.esproj`.

## Successfully invoked MCP tools

- `ListAllPanels` — available editor panels.
- `ExecuteEditorCode` — read project file path and authorization state.
- `ListInstalledPackagesTool` — installed package details.
- `scene_graphql` — complete scene-object query with IDs, relationships, transforms, component types and properties.
- `asset_graphql` — asset inventory query including packed contents.
- `PreviewPanelTool(getConfig)` — current preview configuration.
- `QueryRuntimeSceneTool` — attempted runtime capability query; returned an AI Preview Agent Inspect handler timeout.
- `RunAndCollectLogsTool(mode=tail)` — current logger tail without resetting preview.
- `list_leaf_scenarios(onDevice=false)` — LEAF registry query (response preserved).

An initial scene and asset query had GraphQL schema errors; corrected queries were run and their successful complete responses are preserved. The initial errors were not used as project data.

## Unavailable or intentionally not invoked

- **Compilation diagnostics:** no read-only compiler-diagnostics endpoint was exposed. The available `RecompileTypeScriptTool` performs compilation, which was expressly prohibited, so it was not invoked. The existing logger tail says TypeScript is not compiled but supplies no complete compiler error list. Therefore complete current TS diagnostics, including exact AI Preview Agent Inspect and Lifeline script errors, are unavailable in this export.
- **Runtime scene / preview introspection:** QueryRuntimeSceneTool failed with: “AiPreviewAgent handler was installed but didn't respond after the preview reset. The lens may still be reloading. Retry the tool; if it persists, the lens-side AgentInspectScript may not be running.” No retry was made.
- **Screenshot:** the screenshot action was not retained in the final capture set because preview output was not needed to preserve the available configuration and the preview runtime was not responsive.
- **Game Plan:** no filename matching `*Game*Plan*` or `*Plan*` was found in the workspace outside generated Cache/Support folders during the read-only search. No plan document was opened or changed.
- The editor-reported open project path is a temporary Lens Studio project path, not the provided repository directory. The export preserves both facts; scene/asset responses describe the live MCP-connected editor state and may differ from the workspace manifest/files.

## Special problem areas

This export does not repair or infer fixes for the reported LEAF package import/path mismatches, obsolete AI Preview Agent Inspect aliases, immutable-model mutation failure, or missing Lifeline scene integration. The scene response represents the actual author-time state. The LEAF response and package response preserve their current registry/package views. No compilation was run, so there are no complete compiler diagnostics for the cited packages or remaining Lifeline scripts.

## Safety and limitations

No `.mcp.json`, private key, or authentication configuration was copied. The logger tail is raw MCP output and may contain machine-specific log paths and opaque diagnostic identifiers, but no credentials were intentionally exported. No asset, script, package, scene object, project setting, or original Game Plan was modified. No terminal Git operations were run. All export files are intended for review before manual upload.

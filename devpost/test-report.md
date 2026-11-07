# Lifeline validation report

Date: 2026-11-06

## Summary

Validation did not reach runtime. No Preview interaction or LEAF scenario is claimed as passed. Lens Studio MCP confirmed the Lifeline project and Spectacles target, but the live scene has no Lifeline root or LEAF scenario index. TypeScript compilation is currently blocked by installed package resolution errors.

## Checks

| Test | What it checks | Result | Evidence / limitation |
|---|---|---|---|
| Project and target inspection | Correct project and target | Pass (inspection only) | MCP reported `Lifeline.esproj`; project manifest targets Spectacles. |
| Scene integration inspection | Lifeline controller/UI and LEAF index are in scene | Fail | Virtual scene snapshot contained 119 objects and no Lifeline root or LeafIndex. |
| TypeScript compile | Project compiles | Fail | `RecompileTypeScriptTool` reports unresolved `Leaf.lspkg/*` imports from the installed `Leaf 2.lspkg` package, plus stale `UIKit.lspkg` and `InteractionKit.lspkg` imports in AI Preview Agent Inspect examples. |
| Lifeline controller/UI API | UI calls methods exposed by controller | Fixed, compile blocked | UI method names were corrected to call `requestFalseAlarm()` and `requestEndSession()`. No successful compile followed because package errors remain. |
| Manual activation | Pinch enters emergency home | Not run | No integrated Lifeline scene; Preview interaction cannot target Lifeline UI. |
| Preview simulated activation | Simulation enters the same flow | Not run | No integrated Lifeline scene. |
| Voice activation | Actual ASR and lifecycle | Not run | Hardware microphone/permission/network verification not performed. Preview simulation is not ASR evidence. |
| Emergency action / 112 honesty | Number appears; no false call result | Not run | No runtime screen. Existing UI source instructs use of a phone or another bystander; no platform call was observed. |
| Severe bleeding path | Sequence, navigation, repeat, source constraints | Not run | No runtime screen or LEAF test. |
| Adult collapse path | Adult-only sequence, no pulse check, sourced cadence | Not run | No runtime screen or LEAF test. |
| Other emergency path | Call 112 and follow operator | Not run | No runtime screen or LEAF test. |
| Cancel/reset safety | Confirmation and reset | Not run | No runtime screen or LEAF test. |
| Visual/layout inspection | Placement, contrast, target sizing, occlusion | Not run | Preview screenshot/interactions unavailable without compilation and scene integration. |
| Persistent LEAF scenarios | Re-runnable interaction scenarios | Not run | No LeafIndex or scenario files integrated; LEAF package import paths currently fail compilation. |

## Fix applied

Corrected two Lifeline UI callbacks that referenced controller method names that did not exist. The controller exposes `requestFalseAlarm()` and `requestEndSession()`.

## Current blockers

1. LEAF 2.0.2 is installed at `Packages/Leaf 2.lspkg`, but its TypeScript sources import modules from `Leaf.lspkg/...`. Lens Studio MCP `asset_graphql.renameAsset` returned `success:false` for the package descriptor. No alternate package writer was used.
2. AI Preview Agent Inspect example scripts use obsolete package aliases and prevent the current TypeScript compile.
3. The live scene contains no Lifeline objects or LEAF index. Earlier scene apply via VirtualScene failed with an immutable-model error; no alternate scene mutation API was used.

The package and scene integration blockers must be resolved through supported Lens Studio package/scene workflows before these tests can honestly run.

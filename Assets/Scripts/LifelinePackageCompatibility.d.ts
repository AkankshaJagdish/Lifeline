/**
 * Type-only bridges for the optional AI Preview Agent demo scripts.
 * The installed package demos use legacy module prefixes, while the project
 * ships SpectaclesUIKit and SpectaclesInteractionKit. These declarations
 * re-export the matching current types without editing packed package files.
 * The demos are not part of Lifeline's runtime scene.
 */
declare module "UIKit.lspkg/Scripts/Components/Button/Button" {
  export { Button } from "SpectaclesUIKit.lspkg/Scripts/Components/Button/Button";
}

declare module "UIKit.lspkg/Scripts/Components/Button/RectangleButton" {
  export { RectangleButton } from "SpectaclesUIKit.lspkg/Scripts/Components/Button/RectangleButton";
}

declare module "UIKit.lspkg/Scripts/Components/Frame/Frame" {
  export { Frame } from "SpectaclesUIKit.lspkg/Scripts/Components/Frame/Frame";
}

declare module "InteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider" {
  export { default } from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";
}

/// <reference path="../core/component.ts" />
/// <reference path="./renderablecomponent.ts" />

class DebugRenderableComponent extends RenderableComponent {
    constructor(positionComponent: PositionComponent, width: number, height: number, color: string, renderLayer: RenderLayer, gameAnimation: GameAnimation = null, renderPriority: number = 0) {
        super(positionComponent, width, height, color, renderLayer, gameAnimation, renderPriority);
    }
}
/// <reference path="../core/component.ts" />

class PaintPickupComponent extends Component {
    positionComponent: PositionComponent;
    renderableComponent: RenderableComponent;
    paintType: PaintType;

    constructor(positionComponent: PositionComponent, renderableComponent: RenderableComponent, paintType: PaintType) {
        super();

        this.positionComponent = positionComponent;
        this.paintType = paintType;
        this.renderableComponent = renderableComponent;
    }
}
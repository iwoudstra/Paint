/// <reference path="../core/component.ts" />

enum PaintType {
    HighJump
}

class PaintComponent extends Component {
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
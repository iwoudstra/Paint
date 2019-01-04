/// <reference path="../core/component.ts" />

class RenderableComponent extends Component {
    positionComponent: PositionComponent;

    constructor(positionComponent: PositionComponent) {
        super();

        this.positionComponent = positionComponent;
    }
}
/// <reference path="../core/component.ts" />

class SolidPlatformComponent extends Component {
    positionComponent: PositionComponent;

    constructor(positionComponent: PositionComponent) {
        super();

        this.positionComponent = positionComponent;
    }
}
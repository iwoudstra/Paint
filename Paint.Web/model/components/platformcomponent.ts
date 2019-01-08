/// <reference path="../core/component.ts" />

class PlatformComponent extends Component {
    positionComponent: PositionComponent;
    width: number;
    height: number;

    constructor(positionComponent: PositionComponent, width: number, height: number) {
        super();

        this.positionComponent = positionComponent;
        this.width = width;
        this.height = height;
    }
}
/// <reference path="../core/component.ts" />

class SpawnedComponent extends Component {
    positionComponent: PositionComponent;
    moveableComponent: MoveableComponent;
    minPosition: Vector2d;
    maxPosition: Vector2d;

    constructor(positionComponent: PositionComponent, moveableComponent: MoveableComponent, minPosition: Vector2d, maxPosition: Vector2d) {
        super();

        this.positionComponent = positionComponent;
        this.moveableComponent = moveableComponent;
        this.minPosition = minPosition;
        this.maxPosition = maxPosition;
    }
}
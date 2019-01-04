/// <reference path="../core/component.ts" />

enum PlayerState {
    Idle,
    Moving,
    Jumping
}

class PlayerComponent extends Component {
    currentState: PlayerState = PlayerState.Idle;
    positionComponent: PositionComponent;
    moveableComponent: MoveableComponent;

    constructor(positionComponent: PositionComponent, moveableComponent: MoveableComponent) {
        super();

        this.positionComponent = positionComponent;
        this.moveableComponent = moveableComponent;
    }
}
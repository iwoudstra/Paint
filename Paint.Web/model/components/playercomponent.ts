/// <reference path="../core/component.ts" />

enum PlayerState {
    Idle,
    Moving,
    Jumping,
    Falling
}

class PlayerComponent extends Component {
    currentState: PlayerState = PlayerState.Idle;
    positionComponent: PositionComponent;
    moveableComponent: MoveableComponent;
    inputComponent: InputComponent;
    renderableComponent: RenderableComponent;

    constructor(positionComponent: PositionComponent, moveableComponent: MoveableComponent, inputComponent: InputComponent, renderableComponent: RenderableComponent) {
        super();

        this.positionComponent = positionComponent;
        this.moveableComponent = moveableComponent;
        this.inputComponent = inputComponent;
        this.renderableComponent = renderableComponent;
    }
}
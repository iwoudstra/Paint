/// <reference path="../core/component.ts" />

enum PlayerState {
    OnGround,
    Jumping,
    Falling,
    Respawing,
    Interacting,
    Attacking
}

class PlayerComponent extends Component {
    currentState: PlayerState = PlayerState.OnGround;
    newState: PlayerState = PlayerState.OnGround;
    positionComponent: PositionComponent;
    moveableComponent: MoveableComponent;
    inputComponent: InputComponent;
    renderableComponent: RenderableComponent;
    brushEntity: Entity;
    interactingWith: NPCComponent = null;
    hasBluePaint: boolean = false;

    attackEntity: Entity = null;
    attackTimer: number = 0;
    attackDamage: number = 80;

    constructor(positionComponent: PositionComponent, moveableComponent: MoveableComponent, inputComponent: InputComponent, renderableComponent: RenderableComponent) {
        super();

        this.positionComponent = positionComponent;
        this.moveableComponent = moveableComponent;
        this.inputComponent = inputComponent;
        this.renderableComponent = renderableComponent;
    }
}
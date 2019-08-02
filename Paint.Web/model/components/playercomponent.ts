/// <reference path="../core/component.ts" />

enum PlayerState {
    OnGround,
    Jumping,
    Falling,
    Respawing,
    Interacting,
    Attacking
}

enum PlayerStance {
    Blue, //weapon: short sword, paint: high jump, equipment: double jump
}

class PlayerComponent extends Component {
    currentState: PlayerState = PlayerState.OnGround;
    newState: PlayerState = PlayerState.OnGround;
    currentStance: PlayerStance = PlayerStance.Blue;
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


    attackPreTime: number = 0.10;
    attackTime: number = 0.25;
    attackPostTime: number = 0.35;
    attackLength: number = 80;

    constructor(positionComponent: PositionComponent, moveableComponent: MoveableComponent, inputComponent: InputComponent, renderableComponent: RenderableComponent) {
        super();

        this.positionComponent = positionComponent;
        this.moveableComponent = moveableComponent;
        this.inputComponent = inputComponent;
        this.renderableComponent = renderableComponent;
    }
}
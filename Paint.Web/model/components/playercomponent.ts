/// <reference path="../core/component.ts" />

enum PlayerState {
    OnGround,
    Jumping,
    Falling,
    Respawing,
    Interacting
}

class PlayerComponent extends Component {
    currentState: PlayerState = PlayerState.OnGround;
    positionComponent: PositionComponent;
    moveableComponent: MoveableComponent;
    inputComponent: InputComponent;
    renderableComponent: RenderableComponent;
    interactingWith: NPCComponent = null;

    _hasBluePaint: boolean = false;
    @serializeParameter(true)
    get HasBluePaint() { return this._hasBluePaint; }
    set HasBluePaint(value) { this._hasBluePaint = value; }

    constructor(positionComponent: PositionComponent, moveableComponent: MoveableComponent, inputComponent: InputComponent, renderableComponent: RenderableComponent) {
        super();

        this.positionComponent = positionComponent;
        this.moveableComponent = moveableComponent;
        this.inputComponent = inputComponent;
        this.renderableComponent = renderableComponent;
    }
}
/// <reference path="../core/component.ts" />

class NPCComponent extends Component {
    positionComponent: PositionComponent;
    interactionPosition: PositionComponent;
    interactionAction: (self: Entity) => void;
    interactable: boolean = true;
    interacting: boolean = false;

    constructor(positionComponent: PositionComponent, interactionPosition: PositionComponent, interactionAction: (self: Entity) => void) {
        super();

        this.positionComponent = positionComponent;
        this.interactionPosition = interactionPosition;
        this.interactionAction = interactionAction;
    }
}
/// <reference path="../core/component.ts" />

class NPCComponent extends Component {
    positionComponent: PositionComponent;
    interactionPosition: PositionComponent;
    name: string;
    interactionAction: (self: NPCComponent, option: number, initialInteraction: boolean) => boolean;
    interactingState: number = 0;
    interactable: boolean = true;
    interacting: boolean = false;

    constructor(positionComponent: PositionComponent, interactionPosition: PositionComponent, name: string, interactionAction: (self: NPCComponent, option: number, initialInteraction: boolean) => boolean) {
        super();

        this.positionComponent = positionComponent;
        this.interactionPosition = interactionPosition;
        this.name = name;
        this.interactionAction = interactionAction;
    }
}
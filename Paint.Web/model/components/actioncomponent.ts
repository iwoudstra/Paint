/// <reference path="../core/component.ts" />

class ActionComponent extends Component {
    action: (deltaTime: number, self: Entity, actionComponent: ActionComponent) => void;
    timerHelper: number = 0;

    constructor(action: (deltaTime: number, self: Entity, actionComponent: ActionComponent) => void) {
        super();

        this.action = action;
    }
}
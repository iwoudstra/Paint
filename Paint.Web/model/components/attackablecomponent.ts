/// <reference path="../core/component.ts" />

class AttackableComponent extends Component {
    positionComponent: PositionComponent;
    health: number;

    constructor(positionComponent: PositionComponent, health: number) {
        super();

        this.positionComponent = positionComponent;
        this.health = health;
    }
}
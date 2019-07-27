/// <reference path="../core/component.ts" />

class AttackComponent extends Component {
    positionComponent: PositionComponent;
    entity: Entity;
    damage: number;
    isPlayer: boolean;

    attackedComponents: AttackableComponent[] = [];

    constructor(positionComponent: PositionComponent, entity: Entity, damage: number, isPlayer: boolean) {
        super();

        this.positionComponent = positionComponent;
        this.entity = entity;
        this.damage = damage;
        this.isPlayer = isPlayer;
    }
}
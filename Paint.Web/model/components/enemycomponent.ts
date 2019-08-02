/// <reference path="../core/component.ts" />

enum EnemyType {
    Patrol
}

enum EnemyAttackType {
    Auto
}

class EnemyComponent extends Component {
    enemyType: EnemyType;
    enemyAttackType: EnemyAttackType;
    positionComponent: PositionComponent;
    moveableComponent: MoveableComponent;
    renderableComponent: RenderableComponent;

    attackEntity: Entity = null;
    attackTimer: number = 0;
    attackDamage: number = 80;

    isAttacking: boolean = false;
    attackPreTime: number = 0.10;
    attackTime: number = 0.25;
    attackPostTime: number = 0.35;
    attackLength: number = 80;

    autoAttackTime: number = 0;
    autoAttackTimer: number = 0;
    patrolFromX: number = 0;
    patrolToX: number = 0;

    constructor(positionComponent: PositionComponent, moveableComponent: MoveableComponent, renderableComponent: RenderableComponent, enemyType: EnemyType, enemyAttackType: EnemyAttackType) {
        super();

        this.positionComponent = positionComponent;
        this.moveableComponent = moveableComponent;
        this.renderableComponent = renderableComponent;
        this.enemyType = enemyType;
        this.enemyAttackType = enemyAttackType;
    }
}
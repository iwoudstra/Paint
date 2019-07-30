/// <reference path="../core/system.ts" />

class AttackSystem extends System {
    public Update(deltaTime: number): void {
        var attacks = this.engine.GetEntities([AttackComponent.name]);
        var attackables = this.engine.GetEntities([AttackableComponent.name]);

        for (let attack of attacks) {
            for (let attackable of attackables) {
                let attackComponent = <AttackComponent>attack.GetComponent(AttackComponent.name);
                let attackableComponent = <AttackableComponent>attackable.GetComponent(AttackableComponent.name);

                if (attackComponent.attackedComponents.indexOf(attackableComponent) !== -1
                    || attackComponent.entity === attackable) {
                    continue;
                }

                let attackPosition = attackComponent.positionComponent;
                let attackablePosition = attackableComponent.positionComponent;

                if ((attackPosition.position.x <= attackablePosition.position.x + attackablePosition.width && attackPosition.position.x + attackPosition.width > attackablePosition.position.x)
                    && (attackPosition.position.y <= attackablePosition.position.y + attackablePosition.height && attackPosition.position.y + attackPosition.height > attackablePosition.position.y)) {
                    attackableComponent.health -= attackComponent.damage;

                    if (attackComponent.attackOnce) {
                        attackComponent.attackedComponents.push(attackableComponent);
                    }

                    if (attackableComponent.health <= 0) {
                        let playerComponent = <PlayerComponent | undefined>attackable.GetComponent(PlayerComponent.name);

                        if (playerComponent) {
                            playerComponent.newState = PlayerState.Respawing;
                        } else {
                            this.engine.RemoveEntity(attackable, true);
                        }
                    }
                }
            }
        }
    }

    public LevelChanged(): void {
    }
    public EntityAdded(entity: Entity): void {
    }
    public EntityRemoved(entity: Entity): void {
    }
}
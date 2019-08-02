/// <reference path="../core/system.ts" />

class EnemySystem extends System {
    public Update(deltaTime: number): void {
        let enemies = this.engine.GetEntities([EnemyComponent.name])

        for (let enemy of enemies) {
            let enemyComponent = <EnemyComponent>enemy.GetComponent(EnemyComponent.name);

            switch (enemyComponent.enemyType) {
                case EnemyType.Patrol: {

                    if (enemyComponent.positionComponent.position.x <= enemyComponent.patrolFromX) {
                        enemyComponent.moveableComponent.velocity.x = 200;
                        enemyComponent.renderableComponent.orientationLeft = false;
                    } else if (enemyComponent.positionComponent.position.x >= enemyComponent.patrolToX) {
                        enemyComponent.moveableComponent.velocity.x = -200;
                        enemyComponent.renderableComponent.orientationLeft = true;
                    }

                    break;
                }
            }

            switch (enemyComponent.enemyAttackType) {
                case EnemyAttackType.Auto: {

                    if (!enemyComponent.isAttacking) {
                        enemyComponent.renderableComponent.gameAnimation = SpriteHelper.enemyWalking;
                        enemyComponent.renderableComponent.frame = 0;

                        enemyComponent.autoAttackTimer += deltaTime;
                        if (enemyComponent.autoAttackTimer > enemyComponent.autoAttackTime) {
                            enemyComponent.autoAttackTimer = 0;
                            enemyComponent.attackTimer = 0;
                            enemyComponent.isAttacking = true;
                        }
                    } else {
                        enemyComponent.attackTimer += deltaTime;

                        if (enemyComponent.attackTimer >= enemyComponent.attackPostTime) {
                            enemyComponent.isAttacking = false;
                        } else if (enemyComponent.attackTimer >= enemyComponent.attackTime) {
                            this.engine.RemoveEntity(enemyComponent.attackEntity, false);
                            enemyComponent.attackEntity = null;
                        } else if (enemyComponent.attackTimer >= enemyComponent.attackPreTime && enemyComponent.attackEntity === null) {
                            let attackEntity = new Entity();
                            let attackPosition = new PositionComponent(0, 0, enemyComponent.attackLength, enemyComponent.positionComponent.height);
                            Object.defineProperty(attackPosition.position, 'x', {
                                get() { return enemyComponent.renderableComponent.orientationLeft ? (enemyComponent.positionComponent.position.x + (1 / 3 * enemyComponent.positionComponent.width) - enemyComponent.attackLength) : (enemyComponent.positionComponent.position.x + (2 / 3 * enemyComponent.positionComponent.width)); },
                                set(_) { }
                            });
                            Object.defineProperty(attackPosition.position, 'y', {
                                get() { return enemyComponent.positionComponent.position.y; },
                                set(_) { }
                            });

                            attackEntity.AddComponent(attackPosition);
                            attackEntity.AddComponent(new AttackComponent(attackPosition, enemy, enemyComponent.attackDamage, true, true));

                            enemyComponent.attackEntity = attackEntity;
                            this.engine.AddEntity(attackEntity);
                        }

                        let stanceAnimation = SpriteHelper.enemyAttack[0];
                        let stanceAttackAnimation = stanceAnimation[0];
                        let attackFrame = 0;
                        if (enemyComponent.attackTimer <= enemyComponent.attackPreTime) {
                            stanceAttackAnimation = stanceAnimation[0];
                            attackFrame = Math.floor(enemyComponent.attackTimer / (enemyComponent.attackPreTime / stanceAttackAnimation.frames));
                        } else if (enemyComponent.attackTimer <= enemyComponent.attackTime) {
                            stanceAttackAnimation = stanceAnimation[1];
                            attackFrame = Math.floor((enemyComponent.attackTimer - enemyComponent.attackPreTime) / ((enemyComponent.attackTime - enemyComponent.attackPreTime) / stanceAttackAnimation.frames));
                        } else {
                            stanceAttackAnimation = stanceAnimation[2];
                            attackFrame = Math.floor((enemyComponent.attackTimer - enemyComponent.attackTime) / ((enemyComponent.attackPostTime - enemyComponent.attackTime) / stanceAttackAnimation.frames));
                        }

                        if (attackFrame >= stanceAttackAnimation.frames) {
                            attackFrame = stanceAttackAnimation.frames - 1;
                        }
                        enemyComponent.renderableComponent.gameAnimation = stanceAttackAnimation;
                        enemyComponent.renderableComponent.frame = attackFrame;
                    }

                    break;
                }
            }
        }
    }

    public LevelChanged(): void {
    }
    public EntityAdded(entity: Entity): void {
    }
    public EntityRemoved(entity: Entity): void {
        if (entity.HasComponent(EnemyComponent.name)) {
            let enemyComponent = <EnemyComponent>entity.GetComponent(EnemyComponent.name);
            if (enemyComponent.attackEntity) {
                this.engine.RemoveEntity(enemyComponent.attackEntity, false);
            }
        }
    }
}
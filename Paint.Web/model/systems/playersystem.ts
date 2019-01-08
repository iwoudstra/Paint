/// <reference path="../core/system.ts" />

class PlayerSystem extends System {
    private requiredComponents: string[] = [PlayerComponent.name];
    private movementSpeed: number = 400;
    private fallSpeed: number = 800;

    public Update(deltaTime: number): void {
        var entities = this.engine.GetEntities(this.requiredComponents);
        for (var i = 0; i < entities.length; ++i) {
            var playerComponent: PlayerComponent = <PlayerComponent>entities[i].GetComponent(PlayerComponent.name);

            switch (playerComponent.currentState) {
                case PlayerState.Idle: {
                    this.HandleIdleState(entities[i], playerComponent);
                    break;
                }
                case PlayerState.Moving: {
                    this.HandleMovingState(entities[i], playerComponent);
                    break;
                }
                case PlayerState.Jumping: {
                    this.HandleJumpingState(entities[i], playerComponent);
                    break;
                }
                case PlayerState.Falling: {
                    this.HandleFallingState(entities[i], playerComponent);
                    break;
                }
            }
        }
    }

    private HandleIdleState(entity: Entity, playerComponent: PlayerComponent): void {
        if (playerComponent.inputComponent.moveLeftActive && !playerComponent.inputComponent.moveRightActive) {
            playerComponent.moveableComponent.velocity = new Vector2d(-this.movementSpeed, 0);
        } else if (playerComponent.inputComponent.moveRightActive && !playerComponent.inputComponent.moveLeftActive) {
            playerComponent.moveableComponent.velocity = new Vector2d(this.movementSpeed, 0);
        } else {
            playerComponent.moveableComponent.velocity = new Vector2d(0, 0);
        }

        if (!MovingSystem.IsOnGround(this.engine, playerComponent.moveableComponent)) {
            playerComponent.currentState = PlayerState.Falling;
        }
    }

    private HandleMovingState(entity: Entity, playerComponent: PlayerComponent): void {

    }

    private HandleJumpingState(entity: Entity, playerComponent: PlayerComponent): void {

    }

    private HandleFallingState(entity: Entity, playerComponent: PlayerComponent): void {
        if (MovingSystem.IsOnGround(this.engine, playerComponent.moveableComponent)) {
            playerComponent.moveableComponent.velocity.y = 0;
            playerComponent.currentState = PlayerState.Idle;
        } else {
            playerComponent.moveableComponent.velocity.y = ((playerComponent.moveableComponent.velocity.y * 7.0) + this.fallSpeed) / 8.0;
        }
    }
}
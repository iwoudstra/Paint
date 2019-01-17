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
                    this.HandleIdleState(entities[i], playerComponent, deltaTime);
                    break;
                }
                case PlayerState.Moving: {
                    this.HandleMovingState(entities[i], playerComponent);
                    break;
                }
                case PlayerState.Jumping: {
                    this.HandleJumpingState(entities[i], playerComponent, deltaTime);
                    break;
                }
                case PlayerState.Falling: {
                    this.HandleFallingState(entities[i], playerComponent);
                    break;
                }
            }
        }
    }

    private HandleIdleState(entity: Entity, playerComponent: PlayerComponent, deltaTime: number): void {
        var noAction = true;

        if (playerComponent.inputComponent.moveLeftActive && !playerComponent.inputComponent.moveRightActive) {
            noAction = false;
            playerComponent.moveableComponent.velocity = new Vector2d(-this.movementSpeed, 0);
            playerComponent.renderableComponent.orientationLeft = true;
        } else if (playerComponent.inputComponent.moveRightActive && !playerComponent.inputComponent.moveLeftActive) {
            noAction = false;
            playerComponent.moveableComponent.velocity = new Vector2d(this.movementSpeed, 0);
            playerComponent.renderableComponent.orientationLeft = false;
        }

        if (playerComponent.inputComponent.jumpActive) {
            noAction = false;
            playerComponent.moveableComponent.velocity.y = -this.movementSpeed * 2;
            playerComponent.renderableComponent.gameAnimation = Game.Instance.animations.get('playerjumping');
            playerComponent.renderableComponent.frame = 1;
            playerComponent.currentState = PlayerState.Jumping;
        }

        if (noAction) {
            playerComponent.moveableComponent.velocity = new Vector2d(0, 0);
        } else {
            playerComponent.renderableComponent.frameTimer += deltaTime;
            if (playerComponent.renderableComponent.frameTimer >= 0.1) {
                playerComponent.renderableComponent.frameTimer = 0;
                playerComponent.renderableComponent.frame++;
                if (playerComponent.renderableComponent.frame >= playerComponent.renderableComponent.gameAnimation.frames) {
                    playerComponent.renderableComponent.frame = 0;
                }
            }
        }

        if (!MovingSystem.IsOnGround(this.engine, playerComponent.moveableComponent)) {
            playerComponent.currentState = PlayerState.Falling;
            playerComponent.renderableComponent.gameAnimation = Game.Instance.animations.get('playerjumping');
            playerComponent.renderableComponent.frame = 2;
        }
    }

    private HandleMovingState(entity: Entity, playerComponent: PlayerComponent): void {

    }

    private HandleJumpingState(entity: Entity, playerComponent: PlayerComponent, deltaTime: number): void {
        if (playerComponent.inputComponent.moveLeftActive && !playerComponent.inputComponent.moveRightActive) {
            playerComponent.moveableComponent.velocity.x = -this.movementSpeed;
        } else if (playerComponent.inputComponent.moveRightActive && !playerComponent.inputComponent.moveLeftActive) {
            playerComponent.moveableComponent.velocity.x = this.movementSpeed;
        } else {
            playerComponent.moveableComponent.velocity.x = 0;
        }

        playerComponent.moveableComponent.velocity.y += 4 * this.movementSpeed * deltaTime;
        if (playerComponent.moveableComponent.velocity.y >= 0) {
            playerComponent.currentState = PlayerState.Falling;
            playerComponent.renderableComponent.frame = 2;
        }
    }

    private HandleFallingState(entity: Entity, playerComponent: PlayerComponent): void {
        if (playerComponent.inputComponent.moveLeftActive && !playerComponent.inputComponent.moveRightActive) {
            playerComponent.moveableComponent.velocity.x = -this.movementSpeed;
        } else if (playerComponent.inputComponent.moveRightActive && !playerComponent.inputComponent.moveLeftActive) {
            playerComponent.moveableComponent.velocity.x = this.movementSpeed;
        } else {
            playerComponent.moveableComponent.velocity.x = 0;
        }


        if (MovingSystem.IsOnGround(this.engine, playerComponent.moveableComponent)) {
            playerComponent.moveableComponent.velocity.y = 0;
            playerComponent.currentState = PlayerState.Idle;
            playerComponent.renderableComponent.gameAnimation = Game.Instance.animations.get('playerwalking');
            playerComponent.renderableComponent.frame = 0;
            playerComponent.renderableComponent.frameTimer = 0;
        } else {
            playerComponent.moveableComponent.velocity.y = ((playerComponent.moveableComponent.velocity.y * 7.0) + this.fallSpeed) / 8.0;
        }
    }
}
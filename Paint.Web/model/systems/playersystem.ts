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
                case PlayerState.OnGround: {
                    this.HandleOnGroundState(entities[i], playerComponent, deltaTime);
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

    public static CollisionWithPaint(engine: Engine, positionComponent: PositionComponent, paintType: PaintType): boolean {
        var paints = engine.GetEntities([PaintComponent.name]);
        for (var i = 0; i < paints.length; ++i) {
            var paintComponent = <PaintComponent>paints[i].GetComponent(PaintComponent.name);
            if (paintComponent.paintType == paintType
                && (positionComponent.position.x <= paintComponent.positionComponent.position.x + paintComponent.positionComponent.width && positionComponent.position.x + positionComponent.width > paintComponent.positionComponent.position.x)
                && (positionComponent.position.y <= paintComponent.positionComponent.position.y + paintComponent.positionComponent.height && positionComponent.position.y + positionComponent.height > paintComponent.positionComponent.position.y)) {
                return true;
            }
        }

        return false;
    }

    private HandleMovement(playerComponent: PlayerComponent): void {
        if (playerComponent.inputComponent.moveLeftActive && !playerComponent.inputComponent.moveRightActive) {
            playerComponent.moveableComponent.velocity.x = -this.movementSpeed;
            playerComponent.renderableComponent.orientationLeft = true;
        } else if (playerComponent.inputComponent.moveRightActive && !playerComponent.inputComponent.moveLeftActive) {
            playerComponent.moveableComponent.velocity.x = this.movementSpeed;
            playerComponent.renderableComponent.orientationLeft = false;
        } else {
            playerComponent.moveableComponent.velocity.x = 0;
        }

        if (playerComponent.inputComponent.jumpActive && MovingSystem.IsOnGroundOrPlatform(this.engine, playerComponent.moveableComponent)) {
            if (PlayerSystem.CollisionWithPaint(this.engine, playerComponent.positionComponent, PaintType.HighJump)) {
                playerComponent.moveableComponent.velocity.y = -this.movementSpeed * 3;
            } else {
                playerComponent.moveableComponent.velocity.y = -this.movementSpeed * 2;
            }
            playerComponent.renderableComponent.gameAnimation = Game.Instance.animations.get('playerjumping');
            playerComponent.renderableComponent.frame = 1;
            playerComponent.currentState = PlayerState.Jumping;
        } else if (playerComponent.inputComponent.downActive && MovingSystem.IsOnPlatform(this.engine, playerComponent.moveableComponent)) {
            playerComponent.positionComponent.position.y += 1;
        }
    }

    private HandleOnGroundState(entity: Entity, playerComponent: PlayerComponent, deltaTime: number): void {
        this.HandleMovement(playerComponent);
        
        if (playerComponent.moveableComponent.velocity.x !== 0) {
            playerComponent.renderableComponent.frameTimer += deltaTime;
            if (playerComponent.renderableComponent.frameTimer >= 0.1) {
                playerComponent.renderableComponent.frameTimer = 0;
                playerComponent.renderableComponent.frame++;
                if (playerComponent.renderableComponent.frame >= playerComponent.renderableComponent.gameAnimation.frames) {
                    playerComponent.renderableComponent.frame = 0;
                }
            }
        }

        if (!MovingSystem.IsOnGroundOrPlatform(this.engine, playerComponent.moveableComponent)) {
            playerComponent.currentState = PlayerState.Falling;
            playerComponent.renderableComponent.gameAnimation = Game.Instance.animations.get('playerjumping');
            playerComponent.renderableComponent.frame = 2;
        } else if (playerComponent.inputComponent.paintActive && !playerComponent.inputComponent.paintActivePrevious) {
            Game.Instance.AddEntity(EntityHelper.CreateJumpPaint(playerComponent.positionComponent.position.x, playerComponent.positionComponent.position.y + playerComponent.positionComponent.height - 2));
        }
    }

    private HandleJumpingState(entity: Entity, playerComponent: PlayerComponent, deltaTime: number): void {
        this.HandleMovement(playerComponent);

        playerComponent.moveableComponent.velocity.y += 4 * this.movementSpeed * deltaTime;
        if (playerComponent.moveableComponent.velocity.y >= 0) {
            playerComponent.currentState = PlayerState.Falling;
            playerComponent.renderableComponent.frame = 2;
        }
    }

    private HandleFallingState(entity: Entity, playerComponent: PlayerComponent): void {
        this.HandleMovement(playerComponent);

        if (MovingSystem.IsOnGroundOrPlatform(this.engine, playerComponent.moveableComponent)) {
            playerComponent.moveableComponent.velocity.y = 0;
            playerComponent.currentState = PlayerState.OnGround;
            playerComponent.renderableComponent.gameAnimation = Game.Instance.animations.get('playerwalking');
            playerComponent.renderableComponent.frame = 0;
            playerComponent.renderableComponent.frameTimer = 0;
        } else {
            playerComponent.moveableComponent.velocity.y = ((playerComponent.moveableComponent.velocity.y * 7.0) + this.fallSpeed) / 8.0;
        }
    }
}
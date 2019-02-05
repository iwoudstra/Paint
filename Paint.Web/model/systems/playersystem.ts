/// <reference path="../core/system.ts" />

class PlayerSystem extends System {
    private requiredComponents: string[] = [PlayerComponent.name];
    private movementSpeed: number = 400;
    private fallSpeed: number = 800;

    public ChangeState(playerState: PlayerState, playerComponent: PlayerComponent): void {
        switch (playerState) {
            case PlayerState.OnGround: {

                break;
            }
            case PlayerState.Jumping: {

                break;
            }
            case PlayerState.Falling: {

                break;
            }
            case PlayerState.Respawing: {

                break;
            }
            case PlayerState.Interacting: {

                break;
            }
        }

        playerComponent.currentState = playerState;
    }

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
                    this.HandleFallingState(entities[i], playerComponent, deltaTime);
                    break;
                }
                case PlayerState.Respawing: {
                    this.HandleRespawningState(entities[i], playerComponent, deltaTime);
                    break;
                }
                case PlayerState.Interacting: {
                    this.HandleInteractingState(entities[i], playerComponent, deltaTime);
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

    public static CanInteractWithNPC(engine: Engine, playerComponent: PlayerComponent): Entity {
        var npcs = engine.GetEntities([NPCComponent.name]);
        for (var i = 0; i < npcs.length; ++i) {
            var npcComponent = <NPCComponent>npcs[i].GetComponent(NPCComponent.name);
            if ((playerComponent.positionComponent.position.x <= npcComponent.interactionPosition.position.x + npcComponent.interactionPosition.width && playerComponent.positionComponent.position.x + playerComponent.positionComponent.width > npcComponent.interactionPosition.position.x)
                && (playerComponent.positionComponent.position.y <= npcComponent.interactionPosition.position.y + npcComponent.interactionPosition.height && playerComponent.positionComponent.position.y + playerComponent.positionComponent.height > npcComponent.interactionPosition.position.y)) {
                return npcs[i];
            }
        }

        return null;
    }

    private HandleMovement(playerComponent: PlayerComponent, allowJump: boolean): void {
        if (playerComponent.inputComponent.moveLeftActive && !playerComponent.inputComponent.moveRightActive) {
            playerComponent.moveableComponent.velocity.x = -this.movementSpeed;
            playerComponent.renderableComponent.orientationLeft = true;
        } else if (playerComponent.inputComponent.moveRightActive && !playerComponent.inputComponent.moveLeftActive) {
            playerComponent.moveableComponent.velocity.x = this.movementSpeed;
            playerComponent.renderableComponent.orientationLeft = false;
        } else {
            playerComponent.moveableComponent.velocity.x = 0;
        }

        if (allowJump && playerComponent.inputComponent.jumpActive && MovingSystem.IsOnGroundOrPlatform(this.engine, playerComponent.moveableComponent)) {
            if (PlayerSystem.CollisionWithPaint(this.engine, playerComponent.positionComponent, PaintType.HighJump)) {
                playerComponent.moveableComponent.velocity.y = -this.movementSpeed * 3;
            } else {
                playerComponent.moveableComponent.velocity.y = -this.movementSpeed * 2;
            }
            playerComponent.renderableComponent.gameAnimation = SpriteHelper.playerJumping;
            playerComponent.renderableComponent.frame = 0;
            playerComponent.currentState = PlayerState.Jumping;
        } else if (playerComponent.inputComponent.downActive && MovingSystem.IsOnPlatform(this.engine, playerComponent.moveableComponent, false)) {
            playerComponent.positionComponent.position.y += 1;
        }
    }

    private HandleOnGroundState(entity: Entity, playerComponent: PlayerComponent, deltaTime: number): void {
        this.HandleMovement(playerComponent, true);

        var npc = PlayerSystem.CanInteractWithNPC(this.engine, playerComponent);
        if (npc) {
            var npcComponent = <NPCComponent>npc.GetComponent(NPCComponent.name);
            if (npcComponent.interactable) {
                if (playerComponent.inputComponent.interactionActive && !playerComponent.inputComponent.interactionActivePrevious) {
                    playerComponent.interactingWith = npcComponent;
                    playerComponent.currentState = PlayerState.Interacting;
                    npcComponent.interactionAction(npcComponent, 0, true);
                } else if (playerComponent.interactingWith === null) {
                    playerComponent.interactingWith = npcComponent;
                    entity.AddComponent(new TopTextComponent("Press '" + playerComponent.inputComponent.interactionKey + "' to interact."));
                }
            }
        }

        if ((npc === null && playerComponent.interactingWith !== null) || (npc !== null && <NPCComponent>npc.GetComponent(NPCComponent.name) !== playerComponent.interactingWith)) {
            entity.RemoveComponent(TopTextComponent.name);
            playerComponent.interactingWith = null;
        }

        if (playerComponent.moveableComponent.velocity.x !== 0) {
            playerComponent.renderableComponent.frameTimer += deltaTime;
            if (playerComponent.renderableComponent.frameTimer >= 0.085) {
                playerComponent.renderableComponent.frameTimer = 0;
                playerComponent.renderableComponent.frame++;
                if (playerComponent.renderableComponent.frame >= playerComponent.renderableComponent.gameAnimation.frames) {
                    playerComponent.renderableComponent.frame = 0;
                }
            }
        }

        if (!MovingSystem.IsOnGroundOrPlatform(this.engine, playerComponent.moveableComponent)) {
            playerComponent.currentState = PlayerState.Falling;
            playerComponent.renderableComponent.gameAnimation = SpriteHelper.playerJumping;
            playerComponent.renderableComponent.frame = 1;
        } else if (playerComponent.inputComponent.paintActive && !playerComponent.inputComponent.paintActivePrevious && playerComponent.HasBluePaint) {
            Game.Instance.AddEntity(EntityHelper.CreateJumpPaint(playerComponent.positionComponent.position.x, playerComponent.positionComponent.position.y + playerComponent.positionComponent.height - 2));
        }
    }

    private HandleJumpingState(entity: Entity, playerComponent: PlayerComponent, deltaTime: number): void {
        this.HandleMovement(playerComponent, false);

        playerComponent.moveableComponent.velocity.y += 4 * this.movementSpeed * deltaTime;
        if (playerComponent.moveableComponent.velocity.y >= 0) {
            playerComponent.currentState = PlayerState.Falling;
            playerComponent.renderableComponent.frame = 1;
        }
    }

    private HandleFallingState(entity: Entity, playerComponent: PlayerComponent, deltaTime: number): void {
        this.HandleMovement(playerComponent, false);

        if (MovingSystem.IsOnGroundOrPlatform(this.engine, playerComponent.moveableComponent)) {
            playerComponent.moveableComponent.velocity.y = 0;
            playerComponent.currentState = PlayerState.OnGround;
            playerComponent.renderableComponent.gameAnimation = SpriteHelper.playerWalking;
            playerComponent.renderableComponent.frame = 0;
            playerComponent.renderableComponent.frameTimer = 0;
        } else {
            playerComponent.moveableComponent.velocity.y = ((playerComponent.moveableComponent.velocity.y * 7.0) + this.fallSpeed) / 8.0;
        }
    }

    private HandleRespawningState(entity: Entity, playerComponent: PlayerComponent, deltaTime: number): void {
        playerComponent.renderableComponent.frameTimer += deltaTime;
        if (playerComponent.renderableComponent.frameTimer > 1) {
            playerComponent.currentState = PlayerState.OnGround;
            playerComponent.renderableComponent.gameAnimation = SpriteHelper.playerWalking;
            playerComponent.renderableComponent.frame = 0;
            playerComponent.renderableComponent.frameTimer = 0;
        }
    }

    private HandleInteractingState(entity: Entity, playerComponent: PlayerComponent, deltaTime: number): void {
        var topText = <TopTextComponent>entity.GetComponent(TopTextComponent.name);

        if (playerComponent.inputComponent.cancelInteractionActive) {
            playerComponent.currentState = PlayerState.OnGround;
            playerComponent.renderableComponent.gameAnimation = SpriteHelper.playerWalking;
            playerComponent.renderableComponent.frame = 0;
            playerComponent.renderableComponent.frameTimer = 0;
            entity.RemoveComponent(TopTextComponent.name);
        } else if (playerComponent.inputComponent.interactionActive && !playerComponent.inputComponent.interactionActivePrevious) {
            if (playerComponent.interactingWith.interactionAction(playerComponent.interactingWith, topText.chosenOption, false)) {
                playerComponent.currentState = PlayerState.OnGround;
                playerComponent.renderableComponent.gameAnimation = SpriteHelper.playerWalking;
                playerComponent.renderableComponent.frame = 0;
                playerComponent.renderableComponent.frameTimer = 0;
            }
        }

        if (topText.options.length > 0) {
            if (playerComponent.inputComponent.downActive && !playerComponent.inputComponent.downActivePrevious) {
                ++topText.chosenOption;
                if (topText.chosenOption >= topText.options.length) {
                    topText.chosenOption = 0;
                }
            } else if (playerComponent.inputComponent.jumpActive && !playerComponent.inputComponent.jumpActivePrevious) {
                --topText.chosenOption;
                if (topText.chosenOption < 0) {
                    topText.chosenOption = topText.options.length - 1;
                }
            }
        }
    }
}

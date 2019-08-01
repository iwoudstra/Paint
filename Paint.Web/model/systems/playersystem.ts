/// <reference path="../core/system.ts" />

class PlayerSystem extends System {
    private requiredComponents: string[] = [PlayerComponent.name];
    private movementSpeed: number = 400;
    private fallSpeed: number = 800;

    private attackPreTime: number = 0.10;
    private attackTime: number = 0.50;
    private attackPostTime: number = 0.25;

    public ChangeState(entity: Entity, playerComponent: PlayerComponent): void {
        switch (playerComponent.currentState) {
            case PlayerState.OnGround: {
                if (playerComponent.newState !== PlayerState.Interacting) {
                    entity.RemoveComponent(TopTextComponent.name);
                }
                break;
            }
            case PlayerState.Attacking: {
                playerComponent.attackTimer = 0;
                playerComponent.renderableComponent.width = 130;
                break;
            }
            default: {
                //do nothing.
                break;
            }
        }

        switch (playerComponent.newState) {
            case PlayerState.OnGround: {
                playerComponent.moveableComponent.velocity.y = 0;
                playerComponent.renderableComponent.gameAnimation = SpriteHelper.playerWalking;
                playerComponent.renderableComponent.frame = 0;
                playerComponent.renderableComponent.frameTimer = 0;

                entity.RemoveComponent(TopTextComponent.name);
                break;
            }
            case PlayerState.Jumping: {
                playerComponent.renderableComponent.gameAnimation = SpriteHelper.playerJumping;
                playerComponent.renderableComponent.frame = 0;
                break;
            }
            case PlayerState.Falling: {
                playerComponent.renderableComponent.gameAnimation = SpriteHelper.playerJumping;
                playerComponent.renderableComponent.frame = 1;
                break;
            }
            case PlayerState.Respawing: {
                playerComponent.positionComponent.position.x = Game.Instance.respawnPlayerX;
                playerComponent.positionComponent.position.y = Game.Instance.respawnPlayerY;
                playerComponent.moveableComponent.velocity.x = 0;
                playerComponent.moveableComponent.velocity.y = 0;
                playerComponent.renderableComponent.gameAnimation = SpriteHelper.playerWalking;
                playerComponent.renderableComponent.frame = 0;
                playerComponent.renderableComponent.frameTimer = 0;
                break;
            }
            case PlayerState.Interacting: {

                break;
            }
            case PlayerState.Attacking: {
                playerComponent.renderableComponent.gameAnimation = SpriteHelper.playerAttack;
                playerComponent.renderableComponent.width = 130;
                playerComponent.renderableComponent.frame = 0;
                playerComponent.renderableComponent.frameTimer = 0;
                break;
            }
        }

        playerComponent.currentState = playerComponent.newState;
    }

    public Update(deltaTime: number): void {
        var entities = this.engine.GetEntities(this.requiredComponents);
        for (var i = 0; i < entities.length; ++i) {
            var playerComponent: PlayerComponent = <PlayerComponent>entities[i].GetComponent(PlayerComponent.name);

            if (playerComponent.currentState != playerComponent.newState) {
                this.ChangeState(entities[i], playerComponent);
            }

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
                case PlayerState.Attacking: {
                    this.HandleAttackingState(entities[i], playerComponent, deltaTime);
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

    private HandleMovement(playerComponent: PlayerComponent, allowJump: boolean, setJumpState: boolean): void {
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
            this.Jump(playerComponent);
            if (setJumpState) {
                playerComponent.newState = PlayerState.Jumping;
            }
        } else if (playerComponent.inputComponent.downActive && MovingSystem.IsOnPlatform(this.engine, playerComponent.moveableComponent, false)) {
            playerComponent.positionComponent.position.y += 1;
        }
    }

    private Jump(playerComponent: PlayerComponent): void {
        if (PlayerSystem.CollisionWithPaint(this.engine, playerComponent.positionComponent, PaintType.HighJump)) {
            playerComponent.moveableComponent.velocity.y = -this.movementSpeed * 3;
        } else {
            playerComponent.moveableComponent.velocity.y = -this.movementSpeed * 2;
        }
    }

    private CheckAttack(entity: Entity, playerComponent: PlayerComponent): void {
        if (playerComponent.inputComponent.attackActive && playerComponent.currentState != PlayerState.Attacking) {
            playerComponent.newState = PlayerState.Attacking;
        }
    }

    private HandleOnGroundState(entity: Entity, playerComponent: PlayerComponent, deltaTime: number): void {
        this.HandleMovement(playerComponent, true, true);

        var npc = PlayerSystem.CanInteractWithNPC(this.engine, playerComponent);
        if (npc) {
            var npcComponent = <NPCComponent>npc.GetComponent(NPCComponent.name);
            if (npcComponent.interactable) {
                if (playerComponent.inputComponent.interactionActive && !playerComponent.inputComponent.interactionActivePrevious) {
                    playerComponent.interactingWith = npcComponent;
                    playerComponent.newState = PlayerState.Interacting;
                    npcComponent.interactionAction(npcComponent, 0, true);
                } else if (playerComponent.interactingWith === null) {
                    playerComponent.interactingWith = npcComponent;
                    entity.AddComponent(new TopTextComponent("Press '" + playerComponent.inputComponent.interactionKey + "' to interact."));
                } else if (!entity.HasComponent(TopTextComponent.name)) {
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
            playerComponent.renderableComponent.gameAnimation = SpriteHelper.playerWalking;
            if (playerComponent.renderableComponent.frameTimer >= 0.080) {
                playerComponent.renderableComponent.frameTimer = 0;
                playerComponent.renderableComponent.frame++;
                if (playerComponent.renderableComponent.frame >= playerComponent.renderableComponent.gameAnimation.frames) {
                    playerComponent.renderableComponent.frame = 0;
                }
            }
        }

        if ((playerComponent.moveableComponent.velocity.x <= 0) && (playerComponent.moveableComponent.velocity.x >= 0)) {
            playerComponent.renderableComponent.gameAnimation = SpriteHelper.playerIdle;
            playerComponent.renderableComponent.frameTimer += deltaTime;
            if (playerComponent.renderableComponent.frameTimer >= 0.100) {
                playerComponent.renderableComponent.frameTimer = 0;
                playerComponent.renderableComponent.frame++;
                if (playerComponent.renderableComponent.frame >= playerComponent.renderableComponent.gameAnimation.frames) {
                    playerComponent.renderableComponent.frame = 0;
                }
            }


        }

        if (!MovingSystem.IsOnGroundOrPlatform(this.engine, playerComponent.moveableComponent)) {
            playerComponent.newState = PlayerState.Falling;
        } else if (playerComponent.inputComponent.paintActive && !playerComponent.inputComponent.paintActivePrevious && playerComponent.hasBluePaint) {
            Game.Instance.AddEntity(EntityHelper.CreateJumpPaint(playerComponent.positionComponent.position.x, playerComponent.positionComponent.position.y + playerComponent.positionComponent.height - 2));
        }

        this.CheckAttack(entity, playerComponent);
    }

    private HandleJumpingState(entity: Entity, playerComponent: PlayerComponent, deltaTime: number): void {
        this.HandleMovement(playerComponent, false, false);

        playerComponent.moveableComponent.velocity.y += 4 * this.movementSpeed * deltaTime;
        if (playerComponent.moveableComponent.velocity.y >= 0) {
            playerComponent.newState = PlayerState.Falling;
        }

        this.CheckAttack(entity, playerComponent);
    }

    private HandleFallingState(entity: Entity, playerComponent: PlayerComponent, deltaTime: number): void {
        this.HandleMovement(playerComponent, false, false);

        if (MovingSystem.IsOnGroundOrPlatform(this.engine, playerComponent.moveableComponent)) {
            playerComponent.newState = PlayerState.OnGround;
        } else {
            playerComponent.moveableComponent.velocity.y = ((playerComponent.moveableComponent.velocity.y * 7.0) + this.fallSpeed) / 8.0;
        }

        this.CheckAttack(entity, playerComponent);
    }

    private HandleRespawningState(entity: Entity, playerComponent: PlayerComponent, deltaTime: number): void {
        playerComponent.renderableComponent.frameTimer += deltaTime;
        if (playerComponent.renderableComponent.frameTimer > 1) {
            playerComponent.newState = PlayerState.OnGround;
        }
    }

    private HandleInteractingState(entity: Entity, playerComponent: PlayerComponent, deltaTime: number): void {
        var topText = <TopTextComponent>entity.GetComponent(TopTextComponent.name);

        if (playerComponent.inputComponent.cancelInteractionActive) {
            playerComponent.newState = PlayerState.OnGround;
        } else if (playerComponent.inputComponent.interactionActive && !playerComponent.inputComponent.interactionActivePrevious) {
            if (playerComponent.interactingWith.interactionAction(playerComponent.interactingWith, topText.chosenOption, false)) {
                playerComponent.newState = PlayerState.OnGround;
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

    private HandleAttackingState(entity: Entity, playerComponent: PlayerComponent, deltaTime: number): void {
        this.HandleMovement(playerComponent, true, false);

        playerComponent.attackTimer += deltaTime;

        if (playerComponent.attackTimer >= this.attackPostTime) {
            if (MovingSystem.IsOnGroundOrPlatform(this.engine, playerComponent.moveableComponent)) {
                playerComponent.newState = PlayerState.OnGround;
            } else if (playerComponent.moveableComponent.velocity.y >= 0) {
                playerComponent.newState = PlayerState.Falling;
            } else {
                playerComponent.newState = PlayerState.Jumping;
            }
        } else if (playerComponent.attackTimer >= this.attackTime) {
            this.engine.RemoveEntity(playerComponent.attackEntity, false);
            playerComponent.attackEntity = null;
        } else if (playerComponent.attackTimer >= this.attackPreTime && playerComponent.attackEntity === null) {
            let attackEntity = new Entity();
            let attackPosition = new PositionComponent(0, 0, playerComponent.positionComponent.width, playerComponent.positionComponent.height);
            Object.defineProperty(attackPosition.position, 'x', {
                get() { return playerComponent.renderableComponent.orientationLeft ? (playerComponent.positionComponent.position.x - (2 / 3 * playerComponent.positionComponent.width)) : (playerComponent.positionComponent.position.x + (2 / 3 * playerComponent.positionComponent.width)); },
                set(_) { }
            });
            Object.defineProperty(attackPosition.position, 'y', {
                get() { return playerComponent.positionComponent.position.y; },
                set(_) { }
            });

            attackEntity.AddComponent(attackPosition);
            attackEntity.AddComponent(new AttackComponent(attackPosition, entity, playerComponent.attackDamage, true, true));

            playerComponent.attackEntity = attackEntity;
            this.engine.AddEntity(attackEntity);
        }

        let attackFrame = Math.round(playerComponent.attackTimer / (this.attackPostTime / 3));
        playerComponent.renderableComponent.gameAnimation = SpriteHelper.playerAttack;
        playerComponent.renderableComponent.frame = attackFrame;

        if (!MovingSystem.IsOnGroundOrPlatform(this.engine, playerComponent.moveableComponent)) {
            if (playerComponent.moveableComponent.velocity.y >= 0) {
                playerComponent.moveableComponent.velocity.y = ((playerComponent.moveableComponent.velocity.y * 7.0) + this.fallSpeed) / 8.0;
            } else {
                playerComponent.moveableComponent.velocity.y += 4 * this.movementSpeed * deltaTime;
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

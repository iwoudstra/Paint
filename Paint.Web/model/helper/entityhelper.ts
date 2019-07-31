class EntityHelper {
    public static Player: string = 'player';
    public static Camera: string = 'camera';
    public static TopText: string = 'toptext';

    public static CreatePlatform(x: number, y: number, width: number, height: number): Entity {
        let platform = new Entity();
        let positionComponent = new PositionComponent(x, y, width, height);
        platform.AddComponent(positionComponent);
        platform.AddComponent(new PlatformComponent(positionComponent));
        return platform;
    }

    public static CreateSolidPlatform(x: number, y: number, width: number, height: number): Entity {
        let platform = new Entity();
        let positionComponent = new PositionComponent(x, y, width, height);
        platform.AddComponent(positionComponent);
        platform.AddComponent(new SolidPlatformComponent(positionComponent));
        return platform;
    }

    public static CreateDeadlyArea(x: number, y: number, width: number, height: number): Entity {
        let area = new Entity();
        let positionComponent = new PositionComponent(x, y, width, height);
        let attackComponent = new AttackComponent(positionComponent, area, 99999999, false, false);
        area.AddComponent(positionComponent);
        area.AddComponent(attackComponent);
        return area;
    }

    public static CreateGameMap(width: number, height: number, gameAnimation: GameAnimation, renderLayer: RenderLayer): Entity {
        let gamemap = new Entity();
        let positionComponent = new PositionComponent(0, 0, width, height);
        gamemap.AddComponent(positionComponent);
        gamemap.AddComponent(new RenderableComponent(positionComponent, width, height, '', renderLayer, gameAnimation));
        return gamemap;
    }

    public static CreateCamera(): Entity {
        let camera = new Entity();
        let positionComponent = new PositionComponent();
        camera.AddComponent(positionComponent);
        camera.AddComponent(new CameraComponent(positionComponent));
        return camera;
    }

    public static CreateJumpPaint(x: number, y: number): Entity {
        let paint = new Entity();
        let positionComponent = new PositionComponent(x, y, 100, 5);
        let renderableComponent = new RenderableComponent(positionComponent, 100, 5, '#0077ff', RenderLayer.ForegroundPlayer);
        let paintComponent = new PaintComponent(positionComponent, renderableComponent, PaintType.HighJump);
        paint.AddComponent(positionComponent);
        paint.AddComponent(renderableComponent);
        paint.AddComponent(paintComponent);

        return paint;
    }

    private static player: Entity = null;
    public static CreatePlayerEntity(x: number, y: number): Entity {
        if (this.player === null) {
            this.player = new Entity("player");
            let inputComponent = new InputComponent()
            let positionComponent = new PositionComponent(x, y, 130, 260);
            let moveableComponent = new MoveableComponent(positionComponent);
            let attackableComponent = new AttackableComponent(positionComponent, 100);
            let renderableComponent = new RenderableComponent(positionComponent, 130, 260, '', RenderLayer.Player, SpriteHelper.playerWalking, 100);
            this.player.AddComponent(inputComponent);
            this.player.AddComponent(positionComponent);
            this.player.AddComponent(moveableComponent);
            this.player.AddComponent(attackableComponent);
            this.player.AddComponent(renderableComponent);
            this.player.AddComponent(new PlayerComponent(positionComponent, moveableComponent, inputComponent, renderableComponent));
        } else {
            let playerPosition = <PositionComponent>this.player.GetComponent(PositionComponent.name);
            playerPosition.position.x = x;
            playerPosition.position.y = y;
        }

        return this.player;
    }

    public static CreateNpcEntity(x: number, y: number, width: number, height: number, interactionX: number, interactionY: number, interactionWidth: number, interactionHeight: number, name: string
        , interactionAction: (self: NPCComponent, option: number, initialInteraction: boolean) => boolean): Entity {
        let npc = new Entity();
        let positionComponent = new PositionComponent(x, y, width, height);
        let npcComponent = new NPCComponent(positionComponent, new PositionComponent(interactionX, interactionY, interactionWidth, interactionHeight), name, interactionAction);
        let renderableComponent = new RenderableComponent(positionComponent, 130, 195, '', RenderLayer.Player, SpriteHelper.npcwipAnimation);
        npc.AddComponent(positionComponent);
        npc.AddComponent(npcComponent);
        npc.AddComponent(renderableComponent);

        return npc;
    }

    public static CreateAttackableObstacle(x: number, y: number, width: number, height: number, health: number): Entity {
        let obstacle = new Entity();
        let positionComponent = new PositionComponent(x, y, width, height);
        let attackableComponent = new AttackableComponent(positionComponent, health);
        let renderableComponent = new RenderableComponent(positionComponent, width, height, '#33AA77', RenderLayer.ForegroundPlayer);
        let solidPlatformComponent = new SolidPlatformComponent(positionComponent);
        obstacle.AddComponent(positionComponent);
        obstacle.AddComponent(attackableComponent);
        obstacle.AddComponent(renderableComponent);
        obstacle.AddComponent(solidPlatformComponent);

        return obstacle;
    }

    public static CreateSpawnedEntity(x: number, y: number, width: number, height: number, spawnVelocity: Vector2d, spawnMinPosition: Vector2d, spawnMaxPosition: Vector2d, health: number): Entity {
        let spawnedEntity = new Entity();
        let positionComponent = new PositionComponent(x, y, width, height);
        let moveableComponent = new MoveableComponent(positionComponent);
        let spawnedComponent = new SpawnedComponent(positionComponent, moveableComponent, spawnMinPosition, spawnMaxPosition);
        let renderableComponent = new RenderableComponent(positionComponent, width, height, '#ff00ff', RenderLayer.Player);
        let attackableComponent = new AttackableComponent(positionComponent, health);
        spawnedEntity.AddComponent(positionComponent);
        moveableComponent.velocity = spawnVelocity;
        spawnedEntity.AddComponent(moveableComponent);
        spawnedEntity.AddComponent(spawnedComponent);
        spawnedEntity.AddComponent(renderableComponent);
        spawnedEntity.AddComponent(attackableComponent);

        return spawnedEntity;
    }

    public static CreateSpawningEntity(x: number, y: number, width: number, height: number, spawnLocation: Vector2d, spawnVelocity: Vector2d, spawnMinPosition: Vector2d, spawnMaxPosition: Vector2d, spawnHealth: number, spawnTime: number): Entity {
        let spawningEntity = new Entity();
        let positionComponent = new PositionComponent(x, y, width, height);
        let spawnComponent = new SpawnComponent(positionComponent, spawnLocation, spawnVelocity, spawnMinPosition, spawnMaxPosition, spawnHealth, spawnTime);
        let renderableComponent = new RenderableComponent(positionComponent, width, height, '#00ffff', RenderLayer.Player);
        spawningEntity.AddComponent(positionComponent);
        spawningEntity.AddComponent(spawnComponent);
        spawningEntity.AddComponent(renderableComponent);

        return spawningEntity;
    }

    public static CreateLevelTriggerEntity(x: number, y: number, width: number, height: number, newLevel: Level, playerX: number, playerY: number): Entity {
        let levelTrigger = new Entity();
        let positionComponent = new PositionComponent(x, y, width, height);
        let levelTriggerComponent = new LevelTriggerComponent(positionComponent, playerX, playerY, newLevel);
        levelTrigger.AddComponent(positionComponent);
        levelTrigger.AddComponent(levelTriggerComponent);

        return levelTrigger;
    }

    public static CreateEventEntity(x: number, y: number, width: number, height: number, playerX: number, playerY: number): Entity {
        let levelEvent = new Entity();
        let positionComponent = new PositionComponent(x, y, width, height);
        let levelEventComponent = new EventComponent(positionComponent, playerX, playerY);
        levelEvent.AddComponent(positionComponent);
        levelEvent.AddComponent(levelEventComponent);

        return levelEvent;
    }
}
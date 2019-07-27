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
        paint.AddComponent(positionComponent);
        let renderableComponent = new RenderableComponent(positionComponent, 100, 5, '#0077ff', RenderLayer.ForegroundPlayer);
        paint.AddComponent(renderableComponent);
        let paintComponent = new PaintComponent(positionComponent, renderableComponent, PaintType.HighJump);
        paint.AddComponent(paintComponent);

        return paint;
    }

    private static player: Entity = null;
    public static CreatePlayerEntity(x: number, y: number): Entity {
        if (this.player === null) {
            this.player = new Entity("player");
            let inputComponent = new InputComponent()
            this.player.AddComponent(inputComponent);
            let positionComponent = new PositionComponent(x, y, 65, 130);
            this.player.AddComponent(positionComponent);
            let moveableComponent = new MoveableComponent(positionComponent);
            this.player.AddComponent(moveableComponent);
            let renderableComponent = new RenderableComponent(positionComponent, 65, 130, '', RenderLayer.Player, SpriteHelper.playerWalking, 100);
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
        npc.AddComponent(positionComponent);
        let npcComponent = new NPCComponent(positionComponent, new PositionComponent(interactionX, interactionY, interactionWidth, interactionHeight), name, interactionAction);
        npc.AddComponent(npcComponent);
        let renderableComponent = new RenderableComponent(positionComponent, 130, 195, '', RenderLayer.Player, SpriteHelper.npcwipAnimation);
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

    public static CreateSpawnedEntity(x: number, y: number, width: number, height: number, spawnVelocity: Vector2d, spawnMinPosition: Vector2d, spawnMaxPosition: Vector2d): Entity {
        let spawnedEntity = new Entity();
        let positionComponent = new PositionComponent(x, y, width, height);
        spawnedEntity.AddComponent(positionComponent);
        let moveableComponent = new MoveableComponent(positionComponent);
        moveableComponent.velocity = spawnVelocity;
        spawnedEntity.AddComponent(moveableComponent);
        let spawnedComponent = new SpawnedComponent(positionComponent, moveableComponent, spawnMinPosition, spawnMaxPosition);
        spawnedEntity.AddComponent(spawnedComponent);
        let renderableComponent = new RenderableComponent(positionComponent, width, height, '#ff00ff', RenderLayer.Player);
        spawnedEntity.AddComponent(renderableComponent);

        return spawnedEntity;
    }

    public static CreateSpawningEntity(x: number, y: number, width: number, height: number, spawnLocation: Vector2d, spawnVelocity: Vector2d, spawnMinPosition: Vector2d, spawnMaxPosition: Vector2d, spawnTime: number): Entity {
        let spawningEntity = new Entity();
        let positionComponent = new PositionComponent(x, y, width, height);
        spawningEntity.AddComponent(positionComponent);
        let spawnComponent = new SpawnComponent(positionComponent, spawnLocation, spawnVelocity, spawnMinPosition, spawnMaxPosition, spawnTime);
        spawningEntity.AddComponent(spawnComponent);
        let renderableComponent = new RenderableComponent(positionComponent, width, height, '#00ffff', RenderLayer.Player);
        spawningEntity.AddComponent(renderableComponent);

        return spawningEntity;
    }

    public static CreateLevelTriggerEntity(x: number, y: number, width: number, height: number, newLevel: Level, playerX: number, playerY: number): Entity {
        let levelTrigger = new Entity();
        let positionComponent = new PositionComponent(x, y, width, height);
        levelTrigger.AddComponent(positionComponent);
        let levelTriggerComponent = new LevelTriggerComponent(positionComponent, playerX, playerY, newLevel);
        levelTrigger.AddComponent(levelTriggerComponent);

        return levelTrigger;
    }

    public static CreateEventEntity(x: number, y: number, width: number, height: number, playerX: number, playerY: number): Entity {
        let levelEvent = new Entity();
        let positionComponent = new PositionComponent(x, y, width, height);
        levelEvent.AddComponent(positionComponent);
        let levelEventComponent = new EventComponent(positionComponent, playerX, playerY);
        levelEvent.AddComponent(levelEventComponent);

        return levelEvent;
    }
}

class EntityHelper {
    public static CreatePlatform(x: number, y: number, width: number, height: number): Entity {
        var platform = new Entity();
        var positionComponent = new PositionComponent(x, y, width, height);
        platform.AddComponent(positionComponent);
        platform.AddComponent(new PlatformComponent(positionComponent));
        return platform;
    }

    public static CreateSolidPlatform(x: number, y: number, width: number, height: number): Entity {
        var platform = new Entity();
        var positionComponent = new PositionComponent(x, y, width, height);
        platform.AddComponent(positionComponent);
        platform.AddComponent(new SolidPlatformComponent(positionComponent));
        return platform;
    }

    public static CreateGameMap(width: number, height: number, gameAnimation: GameAnimation): Entity {
        var gamemap = new Entity();
        var positionComponent = new PositionComponent(0, 0, width, height);
        gamemap.AddComponent(positionComponent);
        gamemap.AddComponent(new RenderableComponent(positionComponent, width, height, '', gameAnimation));
        return gamemap;
    }

    public static CreateCamera(): Entity {
        var camera = new Entity();
        var positionComponent = new PositionComponent();
        camera.AddComponent(positionComponent);
        camera.AddComponent(new CameraComponent(positionComponent));
        return camera;
    }

    public static CreateJumpPaint(x: number, y: number): Entity {
        var paint = new Entity();
        var positionComponent = new PositionComponent(x, y, 100, 5);
        paint.AddComponent(positionComponent);
        var renderableComponent = new RenderableComponent(positionComponent, 100, 5, '#0077ff');
        paint.AddComponent(renderableComponent);
        var paintComponent = new PaintComponent(positionComponent, renderableComponent, PaintType.HighJump);
        paint.AddComponent(paintComponent);

        return paint;
    }

    public static CreatePaintPickupEntity(x: number, y: number, paintType: PaintType): Entity {
        var paintPickup = new Entity();
        var positionComponent = new PositionComponent(x, y, 50, 50);
        paintPickup.AddComponent(positionComponent);
        var renderableComponent = new RenderableComponent(positionComponent, 50, 50, '#0077ff');
        paintPickup.AddComponent(renderableComponent);
        var paintComponent = new PaintPickupComponent(positionComponent, renderableComponent, PaintType.HighJump);
        paintPickup.AddComponent(paintComponent);

        return paintPickup;
    }

    public static CreatePlayerEntity(x: number, y: number): Entity {
        var player = new Entity("player");
        var inputComponent = new InputComponent()
        player.AddComponent(inputComponent);
        var positionComponent = new PositionComponent(x, y, 130, 120);
        player.AddComponent(positionComponent);
        var moveableComponent = new MoveableComponent(positionComponent);
        player.AddComponent(moveableComponent);
        var renderableComponent = new RenderableComponent(positionComponent, 130, 120, '', Game.Instance.animations.get('playerwalking'));
        player.AddComponent(renderableComponent);
        player.AddComponent(new PlayerComponent(positionComponent, moveableComponent, inputComponent, renderableComponent));

        return player;
    }

    public static CreateNpcEntity(x: number, y: number, width: number, height: number, interactionX: number, interactionY: number, interactionWidth: number, interactionHeight: number, interactionAction: (self: Entity) => void): Entity {
        var npc = new Entity();
        var positionComponent = new PositionComponent(x, y, width, height);
        npc.AddComponent(positionComponent);
        var npcComponent = new NPCComponent(positionComponent, new PositionComponent(interactionX, interactionY, interactionWidth, interactionHeight), interactionAction);
        npc.AddComponent(npcComponent);
        var renderableComponent = new RenderableComponent(positionComponent, width, height, '#3389A3');
        npc.AddComponent(renderableComponent);

        return npc;
    }

    public static CreateSpawnedEntity(x: number, y: number, width: number, height: number, spawnVelocity: Vector2d, spawnMinPosition: Vector2d, spawnMaxPosition: Vector2d): Entity {
        var spawnedEntity = new Entity();
        var positionComponent = new PositionComponent(x, y, width, height);
        spawnedEntity.AddComponent(positionComponent);
        var moveableComponent = new MoveableComponent(positionComponent);
        moveableComponent.velocity = spawnVelocity;
        spawnedEntity.AddComponent(moveableComponent);
        var spawnedComponent = new SpawnedComponent(positionComponent, moveableComponent, spawnMinPosition, spawnMaxPosition);
        spawnedEntity.AddComponent(spawnedComponent);
        var renderableComponent = new RenderableComponent(positionComponent, width, height, '#ff00ff');
        spawnedEntity.AddComponent(renderableComponent);

        return spawnedEntity;
    }

    public static CreateSpawningEntity(x: number, y: number, width: number, height: number, spawnLocation: Vector2d, spawnVelocity: Vector2d, spawnMinPosition: Vector2d, spawnMaxPosition: Vector2d, spawnTime: number): Entity {
        var spawningEntity = new Entity();
        var positionComponent = new PositionComponent(x, y, width, height);
        spawningEntity.AddComponent(positionComponent);
        var spawnComponent = new SpawnComponent(positionComponent, spawnLocation, spawnVelocity, spawnMinPosition, spawnMaxPosition, spawnTime);
        spawningEntity.AddComponent(spawnComponent);
        var renderableComponent = new RenderableComponent(positionComponent, width, height, '#00ffff');
        spawningEntity.AddComponent(renderableComponent);

        return spawningEntity;
    }
}
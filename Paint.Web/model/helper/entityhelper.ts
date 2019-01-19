class EntityHelper {
    public static CreatePlatform(x: number, y: number, width: number, height: number): Entity {
        var platform = new Entity();
        var positionComponent = new PositionComponent(x, y, width, height);
        platform.AddComponent(positionComponent);
        //platform.AddComponent(new RenderableComponent(positionComponent, width, height, ''));
        platform.AddComponent(new PlatformComponent(positionComponent));
        return platform;
    }

    public static CreateSolidPlatform(x: number, y: number, width: number, height: number): Entity {
        var platform = new Entity();
        var positionComponent = new PositionComponent(x, y, width, height);
        platform.AddComponent(positionComponent);
        //platform.AddComponent(new RenderableComponent(positionComponent, width, height, ''));
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

    public static CreatePaintPickupComponent(x: number, y: number, paintType: PaintType): Entity {
        var paintPickup = new Entity();
        var positionComponent = new PositionComponent(x, y, 50, 50);
        paintPickup.AddComponent(positionComponent);
        var renderableComponent = new RenderableComponent(positionComponent, 50, 50, '#0077ff');
        paintPickup.AddComponent(renderableComponent);
        var paintComponent = new PaintPickupComponent(positionComponent, renderableComponent, PaintType.HighJump);
        paintPickup.AddComponent(paintComponent);

        return paintPickup;
    }
}
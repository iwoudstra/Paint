class EntityHelper {
    public static CreatePlatform(x: number, y: number, width: number, height: number, gameAnimation: GameAnimation = null): Entity {
        var platform = new Entity();
        var positionComponent = new PositionComponent();
        positionComponent.position = new Vector2d(x, y);
        positionComponent.width = width;
        positionComponent.height = height;
        platform.AddComponent(positionComponent);
        platform.AddComponent(new RenderableComponent(positionComponent, width, height, '#0000ff', gameAnimation));
        platform.AddComponent(new PlatformComponent(positionComponent));
        return platform;
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
}
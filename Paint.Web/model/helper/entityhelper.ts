class EntityHelper {
    public static CreatePlatform(x: number, y: number, width: number, height: number): Entity {
        var platform = new Entity();
        var positionComponent = new PositionComponent();
        positionComponent.position = new Vector2d(x, y);
        positionComponent.width = width;
        positionComponent.height = height;
        platform.AddComponent(positionComponent);
        platform.AddComponent(new RenderableComponent(positionComponent, width, height, '#0000ff'));
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
}
abstract class Level {
    public Width: number;
    public Height: number;
    public LoadScreen: GameAnimation;
    public MapLayout: GameAnimation;

    private entitiesInitialized: boolean = false;
    protected entities: Entity[] = [];
    protected playerEntity: Entity;

    constructor(width: number, height: number, loadScreen: GameAnimation, mapLayout: GameAnimation) {
        this.Width = width;
        this.Height = height;
        this.LoadScreen = loadScreen;
        this.MapLayout = mapLayout;
    }

    protected abstract initEntities(engine: Engine, playerX: number, playerY: number): void;

    public Init(engine: Engine, playerX: number, playerY: number): void {
        if (!this.entitiesInitialized) {
            this.initEntities(engine, playerX, playerY);
            this.entitiesInitialized = true;
        }

        let playerPosition = <PositionComponent>this.playerEntity.GetComponent(PositionComponent.name);
        playerPosition.position.x = playerX;
        playerPosition.position.y = playerY;

        engine.RemoveAllEntities();
        for (let entity of this.entities) {
            engine.AddEntity(entity);
        }
    }
}
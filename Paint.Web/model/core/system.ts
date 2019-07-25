abstract class System {
    priority: number = 0;
    engine: Engine;

    constructor(engine: Engine) {
        this.engine = engine;
    }

    public abstract Update(deltaTime: number): void;
    public abstract LevelChanged(): void;
    public abstract EntityAdded(entity: Entity): void;
    public abstract EntityRemoved(entity: Entity): void;
}
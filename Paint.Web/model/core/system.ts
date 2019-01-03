abstract class System {
    priority: number = 0;
    engine: Engine;

    constructor(engine: Engine) {
        this.engine = engine;
    }

    public abstract Update(deltaTime: number): void;
}
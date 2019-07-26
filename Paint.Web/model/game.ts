class Game {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    requestAnimFrame = window.requestAnimationFrame;
    currentLevel: Level;
    private static _instance: Game;
    private now: number;
    private lastTime: number;
    private deltaTime: number;
    private engine: Engine;

    private serializationAttributes: Map<string, Set<string>> = new Map<string, Set<string>>();
    private serializationState: Map<string, Map<string, Map<string, any>>> = new Map<string, Map<string, Map<string, any>>>();

    public static ResolutionWidth: number = 1280;
    public static ResolutionHeight: number = 720;

    private constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    public AddSerializationAttribute(className: string, attributeName: string): void {
        if (!this.serializationAttributes.has(className)) {
            this.serializationAttributes.set(className, new Set<string>());
        }

        if (!this.serializationAttributes.get(className).has(attributeName)) {
            this.serializationAttributes.get(className).add(attributeName);
        }
    }

    public GetSerializationAttributes(className: string): Set<string> {
        return this.serializationAttributes.has(className) ? this.serializationAttributes.get(className) : new Set<string>();
    }

    public HasSerializationAttribute(className: string, attributeName: string): boolean {
        return this.serializationAttributes.has(className) && this.serializationAttributes.get(className).has(attributeName);
    }

    public SetSerializationState(entityName: string, className: string, attributeName: string, attributeValue: any): void {
        if (!this.serializationState.has(entityName)) {
            this.serializationState.set(entityName, new Map<string, Map<string, any>>());
        }

        if (!this.serializationState.get(entityName).has(className)) {
            this.serializationState.get(entityName).set(className, new Map<string, any>());
        }

        this.serializationState.get(entityName).get(className).set(attributeName, attributeValue);
    }

    public GetSerializationState(entityName: string, className: string, attributeName: string): any {
        if (!this.serializationState.has(entityName)) {
            return null;
        }

        if (!this.serializationState.get(entityName).has(className)) {
            return null;
        }

        if (!this.serializationState.get(entityName).get(className).has(attributeName)) {
            return null;
        }

        return this.serializationState.get(entityName).get(className).get(attributeName);
    }

    public AddEntity(entity: Entity): void {
        this.engine.AddEntity(entity);
    }

    public Init(): void {
        this.engine = new Engine();

        SpriteHelper.InitSprites();
        this.ChangeLevel(Level1.Instance, 600, 600);

        this.lastTime = performance.now();
        this.Handle(this.lastTime);
    }

    public ChangeLevel(level: Level, playerX: number, playerY: number): void {
        this.engine.RemoveAllEntities();

        this.currentLevel = level;
        this.currentLevel.Init(this.engine, playerX, playerY);
        this.engine.LevelChanged();
    }

    public Handle(timestamp: number): void {
        this.now = timestamp;
        this.deltaTime = (this.now - this.lastTime) / 1000.0;

        this.engine.Update(this.deltaTime);

        this.lastTime = this.now;
        window.requestAnimationFrame(function (newTimestamp: number) {
            Game.Instance.Handle(newTimestamp);
        });
    }
}

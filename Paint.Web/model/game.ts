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

    public static ResolutionWidth: number = 1280;
    public static ResolutionHeight: number = 720;

    public respawnPlayerX: number = 0;
    public respawnPlayerY: number = 0;

    private constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
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

        this.respawnPlayerX = playerX;
        this.respawnPlayerY = playerY;
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

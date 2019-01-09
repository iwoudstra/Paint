class Game {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    requestAnimFrame = window.requestAnimationFrame;
    private static _instance: Game;
    private now: number;
    private lastTime: number;
    private deltaTime: number;
    private engine: Engine;

    private constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    public Init(): void {
        this.engine = new Engine();

        var player = new Entity("player");
        var inputComponent = new InputComponent()
        player.AddComponent(inputComponent);
        var positionComponent = new PositionComponent()
        player.AddComponent(positionComponent);
        var moveableComponent = new MoveableComponent(positionComponent);
        player.AddComponent(moveableComponent);
        player.AddComponent(new RenderableComponent(positionComponent, 50, 100, '#ff00ff'));
        player.AddComponent(new PlayerComponent(positionComponent, moveableComponent, inputComponent));

        this.engine.AddEntity(player);

        var platform1 = new Entity("platform1");
        var positionComponentPlatform = new PositionComponent();
        positionComponentPlatform.position = new Vector2d(0, 200);
        positionComponentPlatform.width = 200;
        positionComponentPlatform.height = 10;
        platform1.AddComponent(positionComponentPlatform);
        platform1.AddComponent(new RenderableComponent(positionComponentPlatform, 200, 10, '#0000ff'));
        platform1.AddComponent(new PlatformComponent(positionComponentPlatform, 200, 10));
        this.engine.AddEntity(platform1);

        var platform2 = new Entity("platform2");
        var positionComponentPlatform = new PositionComponent();
        positionComponentPlatform.position = new Vector2d(200, 400);
        positionComponentPlatform.width = 200;
        positionComponentPlatform.height = 10;
        platform2.AddComponent(positionComponentPlatform);
        platform2.AddComponent(new RenderableComponent(positionComponentPlatform, 200, 10, '#0000ff'));
        platform2.AddComponent(new PlatformComponent(positionComponentPlatform, 200, 10));
        this.engine.AddEntity(platform2);

        this.lastTime = performance.now();
        this.Handle(this.lastTime);
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
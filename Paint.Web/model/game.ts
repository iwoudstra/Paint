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
        player.AddComponent(new InputComponent());
        var moveableComponent = new MoveableComponent();
        player.AddComponent(moveableComponent);
        var positionComponent = new PositionComponent()
        player.AddComponent(positionComponent);
        player.AddComponent(new RenderableComponent());
        player.AddComponent(new PlayerComponent(positionComponent, moveableComponent));

        this.engine.AddEntity(player);

        this.lastTime = Date.now();
        this.Handle();
    }

    public Handle(): void {
        this.now = Date.now();
        this.deltaTime = (this.now - this.lastTime) / 1000.0;

        this.engine.Update(this.deltaTime);

        this.lastTime = this.now;
        window.requestAnimationFrame(function (_: number) {
            Game.Instance.Handle();
        });
    }
}
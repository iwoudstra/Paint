class Game {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    requestAnimFrame = window.requestAnimationFrame;
    private static _instance: Game;
    private now: number;
    private lastTime: number;
    private deltaTime: number;
    private engine: Engine;

    public animations: Map<string, GameAnimation> = new Map<string, GameAnimation>();

    private constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    private InitSprites(): void {
        var characterspritesheet: HTMLImageElement = new Image();
        characterspritesheet.src = 'assets/sprites/characterspritesheet.png';

        this.animations.set('playerwalking', new GameAnimation(characterspritesheet, 0, 361, 391, 361, 6, 'playerwalking'));
        this.animations.set('playerjumping', new GameAnimation(characterspritesheet, 0, 0, 391, 361, 3, 'playerjumping'));

        var rockplatform: HTMLImageElement = new Image();
        rockplatform.src = 'assets/sprites/rockplatform.png';
        this.animations.set('rockplatform', new GameAnimation(rockplatform, 0, 0, 580, 540, 1, 'rockplatform'));
    }

    public Init(): void {
        this.engine = new Engine();

        this.InitSprites();

        var player = new Entity("player");
        var inputComponent = new InputComponent()
        player.AddComponent(inputComponent);
        var positionComponent = new PositionComponent(0, 0, 130, 120);
        player.AddComponent(positionComponent);
        var moveableComponent = new MoveableComponent(positionComponent);
        player.AddComponent(moveableComponent);
        var renderableComponent = new RenderableComponent(positionComponent, 130, 120, '#ff00ff', this.animations.get('playerwalking'));
        player.AddComponent(renderableComponent);
        player.AddComponent(new PlayerComponent(positionComponent, moveableComponent, inputComponent, renderableComponent));


        this.engine.AddEntity(EntityHelper.CreatePlatform(0, 200, 200, 190, this.animations.get('rockplatform')));
        this.engine.AddEntity(EntityHelper.CreatePlatform(200, 400, 200, 10));
        this.engine.AddEntity(EntityHelper.CreatePlatform(300, 400, 50, 10));
        this.engine.AddEntity(EntityHelper.CreatePlatform(550, 450, 200, 10));
        this.engine.AddEntity(EntityHelper.CreatePlatform(600, 250, 150, 10));
        this.engine.AddEntity(EntityHelper.CreatePlatform(700, 500, 100, 10));
        this.engine.AddEntity(EntityHelper.CreateCamera());

        this.engine.AddEntity(player);

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
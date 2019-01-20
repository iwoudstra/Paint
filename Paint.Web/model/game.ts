class Game {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    requestAnimFrame = window.requestAnimationFrame;
    private static _instance: Game;
    private now: number;
    private lastTime: number;
    private deltaTime: number;
    private engine: Engine;

    public static ResolutionWidth: number = 1280;
    public static ResolutionHeight: number = 720;
    public static MapWidth: number = 3000;
    public static MapHeight: number = 1080;

    public animations: Map<string, GameAnimation> = new Map<string, GameAnimation>();

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

    private InitSprites(): void {
        var characterspritesheet: HTMLImageElement = new Image();
        characterspritesheet.src = 'assets/sprites/characterspritesheet.png';

        this.animations.set('playerwalking', new GameAnimation(characterspritesheet, 0, 361, 391, 361, 6, 'playerwalking'));
        this.animations.set('playerjumping', new GameAnimation(characterspritesheet, 0, 0, 391, 361, 3, 'playerjumping'));

        var rockplatform: HTMLImageElement = new Image();
        rockplatform.src = 'assets/sprites/rockplatform.png';
        this.animations.set('rockplatform', new GameAnimation(rockplatform, 0, 0, 580, 540, 1, 'rockplatform'));

        var gamemap: HTMLImageElement = new Image();
        gamemap.src = 'assets/sprites/level.png';
        this.animations.set('gamemap', new GameAnimation(gamemap, 0, 0, 3000, 1080, 1, 'gamemap'));
    }

    public Init(): void {
        this.engine = new Engine();

        this.InitSprites();

        var player = new Entity("player");
        var inputComponent = new InputComponent()
        player.AddComponent(inputComponent);
        var positionComponent = new PositionComponent(0, 600, 130, 120);
        player.AddComponent(positionComponent);
        var moveableComponent = new MoveableComponent(positionComponent);
        player.AddComponent(moveableComponent);
        var renderableComponent = new RenderableComponent(positionComponent, 130, 120, '#ff00ff', this.animations.get('playerwalking'));
        player.AddComponent(renderableComponent);
        player.AddComponent(new PlayerComponent(positionComponent, moveableComponent, inputComponent, renderableComponent));

        this.engine.AddEntity(EntityHelper.CreateGameMap(3000, 1080, this.animations.get('gamemap')));
        this.engine.AddEntity(EntityHelper.CreateSolidPlatform(0, 0, 2029, 42));
        this.engine.AddEntity(EntityHelper.CreateSolidPlatform(0, 233, 514, 332));
        this.engine.AddEntity(EntityHelper.CreateSolidPlatform(629, 921, 232, 143));
        this.engine.AddEntity(EntityHelper.CreateSolidPlatform(930, 784, 1090, 296));
        this.engine.AddEntity(EntityHelper.CreateSolidPlatform(1148, 219, 297, 323));
        this.engine.AddEntity(EntityHelper.CreateSolidPlatform(1445, 219, 610, 170));
        this.engine.AddEntity(EntityHelper.CreateSolidPlatform(2007, 234, 113, 549));
        this.engine.AddEntity(EntityHelper.CreatePlatform(513, 531, 259, 16));
        this.engine.AddEntity(EntityHelper.CreatePlatform(860, 378, 289, 27));
        this.engine.AddEntity(EntityHelper.CreatePaintPickupComponent(1710, 603, PaintType.HighJump));
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
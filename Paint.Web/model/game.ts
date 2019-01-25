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

        this.engine.AddEntity(EntityHelper.CreateGameMap(3000, 1080, this.animations.get('gamemap')));
        this.engine.AddEntity(EntityHelper.CreateSolidPlatform(0, 0, 2029, 42));
        this.engine.AddEntity(EntityHelper.CreateSolidPlatform(0, 233, 514, 332));
        this.engine.AddEntity(EntityHelper.CreateSolidPlatform(629, 921, 232, 143));
        this.engine.AddEntity(EntityHelper.CreateSolidPlatform(930, 784, 1090, 296));
        this.engine.AddEntity(EntityHelper.CreateSolidPlatform(1148, 219, 297, 323));
        this.engine.AddEntity(EntityHelper.CreateSolidPlatform(1445, 219, 610, 170));
        this.engine.AddEntity(EntityHelper.CreateSolidPlatform(2007, 234, 113, 549));
        this.engine.AddEntity(EntityHelper.CreateSolidPlatform(0, 1065, 640, 20)); //platform where character lands
        this.engine.AddEntity(EntityHelper.CreatePlatform(513, 531, 259, 16));
        this.engine.AddEntity(EntityHelper.CreatePlatform(860, 378, 289, 27));
        //this.engine.AddEntity(EntityHelper.CreatePaintPickupEntity(1710, 603, PaintType.HighJump));
        this.engine.AddEntity(EntityHelper.CreateCamera());

        this.engine.AddEntity(EntityHelper.CreateSpawningEntity(0, 83, 38, 77, new Vector2d(39, 115), new Vector2d(400, 0), new Vector2d(39, 115), new Vector2d(1222, 155), 10));

        this.engine.AddEntity(EntityHelper.CreateNpcEntity(1718, 608, 95, 144, 1163, 406, 857, 375, function (self: Entity) {
            var player = Game.Instance.engine.GetEntityByName("player");
            var playerComponent = <PlayerComponent>player.GetComponent(PlayerComponent.name);
            playerComponent.HasBluePaint = true;

            var npcComponent = <NPCComponent>self.GetComponent(NPCComponent.name);
            npcComponent.interactable = false;
            self.RemoveComponent(TextComponent.name);

            var paintKey = playerComponent.inputComponent.paintKey === ' ' ? 'spacebar' : playerComponent.inputComponent.paintKey;
            player.AddComponent(new TopTextComponent("I am granting you your first paint, it is blue paint and you can use it to jump higher.\nPress '" + paintKey + "' to paint the ground."));
        }));

        this.engine.AddEntity(EntityHelper.CreatePlayerEntity(0, 600));

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

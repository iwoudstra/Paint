/// <reference path="../core/system.ts" />

class Level3 extends Level {
    constructor() {
        super(2950, 1855, SpriteHelper.level3Animation, SpriteHelper.level3Animation);
    }

    public Init(engine: Engine, playerX: number, playerY: number): void {
        engine.RemoveAllEntities();

        engine.AddEntity(EntityHelper.CreateGameMap(this.Width, this.Height, this.MapLayout, RenderLayer.Player));
        engine.AddEntity(EntityHelper.CreateGameMap(SpriteHelper.level3bgAnimation.width, SpriteHelper.level3bgAnimation.height, SpriteHelper.level3bgAnimation, RenderLayer.Background));


        //solidplatforms topleft spawnarea
        engine.AddEntity(EntityHelper.CreateSolidPlatform(0, 0, 65, 260));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(0, 250, 390, 1105));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(635, 250, 1495, 455));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(635, 700, 910, 65));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(380, 1340, 715, 65));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(1090, 1099, 195, 520));
        engine.AddEntity(EntityHelper.CreateCamera());
        engine.AddEntity(EntityHelper.CreatePlayerEntity(playerX, playerY));
    }
}

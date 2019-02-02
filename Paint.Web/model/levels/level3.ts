/// <reference path="../core/system.ts" />

class Level3 extends Level {
    constructor() {
        super(2047, 1920, SpriteHelper.level3Animation, SpriteHelper.level3Animation);
    }

    public Init(engine: Engine, playerX: number, playerY: number): void {
        engine.RemoveAllEntities();

        engine.AddEntity(EntityHelper.CreateGameMap(this.Width, this.Height, this.MapLayout, RenderLayer.Player));


        //solidplatforms topleft spawnarea
        engine.AddEntity(EntityHelper.CreateSolidPlatform(0, 450, 320, 255));
        engine.AddEntity(EntityHelper.CreateCamera());


        engine.AddEntity(EntityHelper.CreatePlayerEntity(playerX, playerY));
    }
}

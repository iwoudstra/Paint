/// <reference path="../core/system.ts" />

class Level3 extends Level {
    constructor() {
        super(2950, 1855, SpriteHelper.level3Animation, SpriteHelper.level3Animation);
    }

    public Init(engine: Engine, playerX: number, playerY: number): void {
        engine.RemoveAllEntities();

        engine.AddEntity(EntityHelper.CreateGameMap(this.Width, this.Height, this.MapLayout, RenderLayer.Player));
        engine.AddEntity(EntityHelper.CreateGameMap(SpriteHelper.level3bgAnimation.width, SpriteHelper.level3bgAnimation.height, SpriteHelper.level3bgAnimation, RenderLayer.Background));



        engine.AddEntity(EntityHelper.CreateSolidPlatform(0, 0, 65, 260));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(0, 250, 390, 1105));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(635, 250, 1495, 455));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(635, 700, 910, 65));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(380, 1340, 715, 65));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(1090, 1099, 195, 520));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(2365, 510, 585, 195));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(2880, 0, 65, 520));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(2880, 0, 65, 520));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(1535, 765, 195, 650));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(1920, 700, 65, 325));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(1725, 1020, 780, 325));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(2750, 700, 195, 1105));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(2045, 1790, 715, 65));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(2430, 1665, 130, 130));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(1280, 1600, 780, 195));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(640, 1280, 195, 65));


        engine.AddEntity(EntityHelper.CreatePlatform(2240, 640, 130, 15));
        engine.AddEntity(EntityHelper.CreatePlatform(2115, 865, 130, 15));
        engine.AddEntity(EntityHelper.CreatePlatform(2620, 1215, 130, 15));
        engine.AddEntity(EntityHelper.CreatePlatform(2495, 1405, 130, 15));
        engine.AddEntity(EntityHelper.CreatePlatform(2625, 1585, 130, 15));
        engine.AddEntity(EntityHelper.CreatePlatform(2175, 1660, 130, 15));
        engine.AddEntity(EntityHelper.CreatePlatform(1280, 1405, 130, 15));
        engine.AddEntity(EntityHelper.CreatePlatform(1405, 1215, 130, 15));
        engine.AddEntity(EntityHelper.CreatePlatform(1405, 1215, 130, 15));
        engine.AddEntity(EntityHelper.CreatePlatform(1405, 1215, 130, 15));
        engine.AddEntity(EntityHelper.CreatePlatform(1405, 1215, 130, 15));

        engine.AddEntity(EntityHelper.CreatePlatform(380, 1150, 130, 15));
        engine.AddEntity(EntityHelper.CreatePlatform(380, 955, 130, 15));
        engine.AddEntity(EntityHelper.CreatePlatform(380, 570, 130, 15));
        engine.AddEntity(EntityHelper.CreatePlatform(510, 745, 130, 15));
        engine.AddEntity(EntityHelper.CreatePlatform(510, 380, 130, 15));


        engine.AddEntity(EntityHelper.CreateCamera());
        engine.AddEntity(EntityHelper.CreateLevelTriggerEntity(2625, 2485, 130, 130, new Level2(), 980, 1470));
        engine.AddEntity(EntityHelper.CreatePlayerEntity(playerX, playerY));
    }
}

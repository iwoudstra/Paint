/// <reference path="../core/system.ts" />

class Level2 extends Level {
    constructor() {
        super(3000, 1080, SpriteHelper.level1Animation, SpriteHelper.level1Animation);
    }

    public Init(engine: Engine, playerX: number, playerY: number): void {
        engine.RemoveAllEntities();

        engine.AddEntity(EntityHelper.CreateGameMap(this.Width, this.Height, this.MapLayout));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(0, 0, 2029, 42));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(0, 233, 514, 332));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(629, 921, 232, 143));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(930, 784, 1090, 296));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(1148, 219, 297, 323));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(1445, 219, 610, 170));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(2007, 234, 113, 549));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(0, 1065, 640, 20)); //platform where character lands
        engine.AddEntity(EntityHelper.CreatePlatform(513, 531, 259, 16));
        engine.AddEntity(EntityHelper.CreatePlatform(860, 378, 289, 27));
        engine.AddEntity(EntityHelper.CreateCamera());

        engine.AddEntity(EntityHelper.CreateSpawningEntity(0, 83, 38, 77, new Vector2d(39, 115), new Vector2d(500, 0), new Vector2d(39, 115), new Vector2d(2018, 155), 6));
        engine.AddEntity(EntityHelper.CreateSpawningEntity(0, 569, 38, 77, new Vector2d(39, 601), new Vector2d(500, 0), new Vector2d(39, 601), new Vector2d(1960, 601), 5));

        engine.AddEntity(EntityHelper.CreateLevelTriggerEntity(1, 565, 1, 494, new Level1(), 1700, 43));

        engine.AddEntity(EntityHelper.CreatePlayerEntity(playerX, playerY));
    }
}
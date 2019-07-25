/// <reference path="../core/system.ts" />

class Level2 extends Level {
    private static instance: Level = null;
    public static get Instance(): Level {
        if (this.instance === null) {
            this.instance = new Level2();
        }

        return this.instance;
    }

    private constructor() {
        super(2495, 1920, SpriteHelper.level2Animation, SpriteHelper.level2Animation);
    }

    public Init(engine: Engine, playerX: number, playerY: number): void {
        engine.RemoveAllEntities();

        engine.AddEntity(EntityHelper.CreateGameMap(this.Width, this.Height, this.MapLayout, RenderLayer.Player));


        //solidplatforms topleft spawnarea
        engine.AddEntity(EntityHelper.CreateSolidPlatform(0, 450, 320, 255));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(320, 700, 255, 50));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(575, 575, 385, 700));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(1730, 575, 780, 715));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(1790, 1280, 130, 195));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(1920, 1470, 130, 195));
        //platforms stairs
        engine.AddEntity(EntityHelper.CreatePlatform(960, 705, 130, 15));
        engine.AddEntity(EntityHelper.CreatePlatform(960, 830, 130, 15));
        engine.AddEntity(EntityHelper.CreatePlatform(960, 955, 130, 15));
        engine.AddEntity(EntityHelper.CreatePlatform(960, 1080, 130, 15));
        engine.AddEntity(EntityHelper.CreatePlatform(960, 1205, 130, 15));
        engine.AddEntity(EntityHelper.CreatePlatform(960, 1405, 130, 15));

        //solidplatforms bottom
        engine.AddEntity(EntityHelper.CreateSolidPlatform(960, 1600, 195, 195));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(1280, 1665, 320, 130));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(640, 1470, 260, 130));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(380, 1275, 130, 520));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(1790, 1665, 320, 130));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(510, 1790, 1300, 130));


        engine.AddEntity(EntityHelper.CreateCamera());


        engine.AddEntity(EntityHelper.CreateLevelTriggerEntity(700, 1345, 130, 130, Level3.Instance, 2360, 255));
        engine.AddEntity(EntityHelper.CreateLevelTriggerEntity(2, 225, 2, 195, Level1.Instance, 2400, 500));

        engine.AddEntity(EntityHelper.CreateSpawningEntity(1672, 598, 45, 60, new Vector2d(1672, 628), new Vector2d(-100, 0), new Vector2d(966, 628), new Vector2d(1673, 628), 5));
        engine.AddEntity(EntityHelper.CreateSpawningEntity(1672, 740, 45, 60, new Vector2d(1672, 770), new Vector2d(-200, 0), new Vector2d(966, 770), new Vector2d(1673, 770), 5));
        engine.AddEntity(EntityHelper.CreateSpawningEntity(1672, 882, 45, 60, new Vector2d(1672, 912), new Vector2d(-400, 0), new Vector2d(966, 912), new Vector2d(1673, 912), 5));
        engine.AddEntity(EntityHelper.CreateSpawningEntity(1672, 1024, 45, 60, new Vector2d(1672, 1054), new Vector2d(-800, 0), new Vector2d(966, 1054), new Vector2d(1673, 1054), 5));

        engine.AddEntity(EntityHelper.CreatePlayerEntity(playerX, playerY));
    }
}

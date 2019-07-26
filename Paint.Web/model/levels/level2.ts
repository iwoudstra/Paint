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

    protected initEntities(engine: Engine, playerX: number, playerY: number): void {
        this.entities.push(EntityHelper.CreateGameMap(this.Width, this.Height, this.MapLayout, RenderLayer.Player));


        //solidplatforms topleft spawnarea
        this.entities.push(EntityHelper.CreateSolidPlatform(0, 450, 320, 255));
        this.entities.push(EntityHelper.CreateSolidPlatform(320, 700, 255, 50));
        this.entities.push(EntityHelper.CreateSolidPlatform(575, 575, 385, 700));
        this.entities.push(EntityHelper.CreateSolidPlatform(1730, 575, 780, 715));
        this.entities.push(EntityHelper.CreateSolidPlatform(1790, 1280, 130, 195));
        this.entities.push(EntityHelper.CreateSolidPlatform(1920, 1470, 130, 195));
        //platforms stairs
        this.entities.push(EntityHelper.CreatePlatform(960, 705, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(960, 830, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(960, 955, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(960, 1080, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(960, 1205, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(960, 1405, 130, 15));

        //solidplatforms bottom
        this.entities.push(EntityHelper.CreateSolidPlatform(960, 1600, 195, 195));
        this.entities.push(EntityHelper.CreateSolidPlatform(1280, 1665, 320, 130));
        this.entities.push(EntityHelper.CreateSolidPlatform(640, 1470, 260, 130));
        this.entities.push(EntityHelper.CreateSolidPlatform(380, 1275, 130, 520));
        this.entities.push(EntityHelper.CreateSolidPlatform(1790, 1665, 320, 130));
        this.entities.push(EntityHelper.CreateSolidPlatform(510, 1790, 1300, 130));


        this.entities.push(EntityHelper.CreateCamera());


        this.entities.push(EntityHelper.CreateLevelTriggerEntity(700, 1345, 130, 130, Level3.Instance, 2360, 255));
        this.entities.push(EntityHelper.CreateLevelTriggerEntity(2, 225, 2, 195, Level1.Instance, 2400, 500));

        this.entities.push(EntityHelper.CreateSpawningEntity(1672, 598, 45, 60, new Vector2d(1672, 628), new Vector2d(-100, 0), new Vector2d(966, 628), new Vector2d(1673, 628), 5));
        this.entities.push(EntityHelper.CreateSpawningEntity(1672, 740, 45, 60, new Vector2d(1672, 770), new Vector2d(-200, 0), new Vector2d(966, 770), new Vector2d(1673, 770), 5));
        this.entities.push(EntityHelper.CreateSpawningEntity(1672, 882, 45, 60, new Vector2d(1672, 912), new Vector2d(-400, 0), new Vector2d(966, 912), new Vector2d(1673, 912), 5));
        this.entities.push(EntityHelper.CreateSpawningEntity(1672, 1024, 45, 60, new Vector2d(1672, 1054), new Vector2d(-800, 0), new Vector2d(966, 1054), new Vector2d(1673, 1054), 5));

        this.playerEntity = EntityHelper.CreatePlayerEntity(playerX, playerY)
        this.entities.push(this.playerEntity);
        this.entities.push(EntityHelper.CreatePlayerBrush());
    }
}

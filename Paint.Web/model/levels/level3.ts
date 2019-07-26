/// <reference path="../core/system.ts" />

class Level3 extends Level {
    private static instance: Level = null;
    public static get Instance(): Level {
        if (this.instance === null) {
            this.instance = new Level3();
        }

        return this.instance;
    }

    private constructor() {
        super(2950, 1855, SpriteHelper.level3Animation, SpriteHelper.level3Animation);
    }

    protected initEntities(engine: Engine, playerX: number, playerY: number): void {
        this.entities.push(EntityHelper.CreateGameMap(this.Width, this.Height, this.MapLayout, RenderLayer.Player));
        this.entities.push(EntityHelper.CreateGameMap(SpriteHelper.level3bgAnimation.width, SpriteHelper.level3bgAnimation.height, SpriteHelper.level3bgAnimation, RenderLayer.Background));


        this.entities.push(EntityHelper.CreateSolidPlatform(0, 0, 65, 260));
        this.entities.push(EntityHelper.CreateSolidPlatform(0, 250, 390, 1105));
        this.entities.push(EntityHelper.CreateSolidPlatform(635, 250, 1495, 455));
        this.entities.push(EntityHelper.CreateSolidPlatform(635, 700, 910, 65));
        this.entities.push(EntityHelper.CreateSolidPlatform(380, 1340, 715, 65));
        this.entities.push(EntityHelper.CreateSolidPlatform(1090, 1099, 195, 520));
        this.entities.push(EntityHelper.CreateSolidPlatform(2365, 510, 585, 195));
        this.entities.push(EntityHelper.CreateSolidPlatform(2880, 0, 65, 520));
        this.entities.push(EntityHelper.CreateSolidPlatform(2880, 0, 65, 520));
        this.entities.push(EntityHelper.CreateSolidPlatform(1535, 765, 195, 650));
        this.entities.push(EntityHelper.CreateSolidPlatform(1920, 700, 65, 325));
        this.entities.push(EntityHelper.CreateSolidPlatform(1725, 1020, 780, 325));
        this.entities.push(EntityHelper.CreateSolidPlatform(2750, 700, 195, 1105));
        this.entities.push(EntityHelper.CreateSolidPlatform(2045, 1790, 715, 65));
        this.entities.push(EntityHelper.CreateSolidPlatform(2430, 1665, 130, 130));
        this.entities.push(EntityHelper.CreateSolidPlatform(1280, 1600, 780, 195));
        this.entities.push(EntityHelper.CreateSolidPlatform(640, 1280, 195, 65));

        this.entities.push(EntityHelper.CreatePlatform(2240, 640, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(2115, 865, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(2620, 1215, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(2495, 1405, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(2625, 1585, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(2175, 1660, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(1280, 1405, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(1405, 1215, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(1405, 1215, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(1405, 1215, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(1405, 1215, 130, 15));

        this.entities.push(EntityHelper.CreatePlatform(380, 1150, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(380, 955, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(380, 570, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(510, 745, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(510, 380, 130, 15));


        this.entities.push(EntityHelper.CreateCamera());
        this.entities.push(EntityHelper.CreateLevelTriggerEntity(2625, 380, 130, 130, Level2.Instance, 980, 1470));
        this.playerEntity = EntityHelper.CreatePlayerEntity(playerX, playerY)
        this.entities.push(this.playerEntity);
        this.entities.push(EntityHelper.CreatePlayerBrush());
    }
}
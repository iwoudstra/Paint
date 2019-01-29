/// <reference path="../core/system.ts" />

class Level1 extends Level {
    constructor() {
        super(3071, 2944, SpriteHelper.level1Animation, SpriteHelper.level1Animation);
    }

    public Init(engine: Engine, playerX: number, playerY: number): void {
        engine.RemoveAllEntities();

        engine.AddEntity(EntityHelper.CreateGameMap(this.Width, this.Height, this.MapLayout));

        engine.AddEntity(EntityHelper.CreateSolidPlatform(450, 895, 650, 260));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(1090, 770, 195, 130));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(1280, 640, 650, 130));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(130, 640, 325, 260));

        //engine.AddEntity(EntityHelper.CreatePlatform(860, 378, 289, 27));
        engine.AddEntity(EntityHelper.CreateCamera());

        //engine.AddEntity(EntityHelper.CreateSpawningEntity(0, 83, 38, 77, new Vector2d(39, 115), new Vector2d(500, 0), new Vector2d(39, 115), new Vector2d(2018, 155), 6));
        //engine.AddEntity(EntityHelper.CreateSpawningEntity(0, 569, 38, 77, new Vector2d(39, 601), new Vector2d(500, 0), new Vector2d(39, 601), new Vector2d(1960, 601), 5));

        engine.AddEntity(EntityHelper.CreateNpcEntity(1345, 640, 95, 144, 1163, 406, 857, 375, function (self: Entity) {
            var player = engine.GetEntityByName("player");
            var playerComponent = <PlayerComponent>player.GetComponent(PlayerComponent.name);
            playerComponent.HasBluePaint = true;

            var npcComponent = <NPCComponent>self.GetComponent(NPCComponent.name);
            npcComponent.interactable = false;
            self.RemoveComponent(TextComponent.name);

            var paintKey = playerComponent.inputComponent.paintKey === ' ' ? 'spacebar' : playerComponent.inputComponent.paintKey;
            player.AddComponent(new TopTextComponent("I am granting you your first paint, it is blue paint and you can use it to jump higher.\nPress '" + paintKey + "' to paint the ground."));
        }));

        engine.AddEntity(EntityHelper.CreateLevelTriggerEntity(1730, 570, 1, 175, new Level2(), 0, 300));
        engine.AddEntity(EntityHelper.CreatePlayerEntity(playerX, playerY));
    }
}

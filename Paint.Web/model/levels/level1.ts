/// <reference path="../core/system.ts" />

class Level1 extends Level {
    constructor() {
        super(2635, 845, SpriteHelper.level1Animation, SpriteHelper.level1Animation);
    }

    public Init(engine: Engine, playerX: number, playerY: number): void {
        engine.RemoveAllEntities();

        engine.AddEntity(EntityHelper.CreateGameMap(this.Width, this.Height, this.MapLayout, RenderLayer.Player));
      //  engine.AddEntity(EntityHelper.CreateGameMap(SpriteHelper.level1fAnimation.width, SpriteHelper.level1fAnimation.height, SpriteHelper.level1fAnimation, RenderLayer.Foreground));
        //engine.AddEntity(EntityHelper.CreateGameMap(SpriteHelper.level1bgAnimation.width, SpriteHelper.level1bgAnimation.height, SpriteHelper.level1bgAnimation, RenderLayer.Background));
        //engine.AddEntity(EntityHelper.CreateGameMap(SpriteHelper.level1fgAnimation.width, SpriteHelper.level1fgAnimation.height, SpriteHelper.level1fgAnimation, RenderLayer.ForegroundPlayer));


        engine.AddEntity(EntityHelper.CreateSolidPlatform(130, 810, 2080, 35));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(2205, 715, 70, 130));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(2275, 650, 390, 195));


        engine.AddEntity(EntityHelper.CreateCamera());
        var npc = EntityHelper.CreateNpcEntity(2370, 450, 65, 75, 2200, 450, 857, 375, 'John', function (self: NPCComponent, option: number, initialInteraction: boolean): boolean {
            if (!self.interactable) {
                return;
            }

            var player = engine.GetEntityByName("player");
            if (!initialInteraction) {
                ++self.interactingState;
            }

            switch (self.interactingState) {
                case 0: {
                    player.RemoveComponent(TopTextComponent.name);
                    player.AddComponent(new TopTextComponent("You should follow me, i will lead you to the cookies.", ['I love cookies.', 'I hate cookies but will follow you anyway.']));

                    return false;
                }
                case 1: {
                    player.RemoveComponent(TopTextComponent.name);
                    player.AddComponent(new TopTextComponent("Come on hurry and follow me into the darkness."));

                    var playerComponent = <PlayerComponent>player.GetComponent(PlayerComponent.name);
                    playerComponent.HasBluePaint = true;

                    engine.AddEntity(EntityHelper.CreateLevelTriggerEntity(2560, 520, 1, 200, new Level2(), 250, 300));

                    var npcMoveableComponent = new MoveableComponent(self.positionComponent);
                    npcMoveableComponent.velocity = new Vector2d(200, 0);
                    npc.AddComponent(npcMoveableComponent);





                    self.interactingState = 2;

                    return false;
                }
                case 2:
                case 3: {
                    self.interactingState = 2;

                    player.RemoveComponent(TopTextComponent.name);
                    player.AddComponent(new TopTextComponent("Why haven't you followed me into the darkness, are you scared?"));


                    return true;
                }
            }
        });
        engine.AddEntity(npc);

        engine.AddEntity(EntityHelper.CreatePlayerEntity(playerX, playerY));
    }
}

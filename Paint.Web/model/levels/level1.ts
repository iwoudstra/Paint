/// <reference path="../core/system.ts" />

class Level1 extends Level {
    constructor() {
        super(3071, 2944, SpriteHelper.level1Animation, SpriteHelper.level1Animation);
    }

    public Init(engine: Engine, playerX: number, playerY: number): void {
        engine.RemoveAllEntities();

        engine.AddEntity(EntityHelper.CreateGameMap(this.Width, this.Height, this.MapLayout, RenderLayer.Player));
        engine.AddEntity(EntityHelper.CreateGameMap(SpriteHelper.level1fAnimation.width, SpriteHelper.level1fAnimation.height, SpriteHelper.level1fAnimation, RenderLayer.Foreground));
        engine.AddEntity(EntityHelper.CreateGameMap(SpriteHelper.level1bgAnimation.width, SpriteHelper.level1bgAnimation.height, SpriteHelper.level1bgAnimation, RenderLayer.Background));
            engine.AddEntity(EntityHelper.CreateGameMap(SpriteHelper.level1fgAnimation.width, SpriteHelper.level1fgAnimation.height, SpriteHelper.level1fgAnimation, RenderLayer.ForegroundPlayer));

        engine.AddEntity(EntityHelper.CreateSolidPlatform(450, 895, 650, 260));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(1090, 770, 195, 130));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(1280, 640, 650, 130));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(130, 640, 325, 260));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(130, 0, 325, 455));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(1280, 0, 520, 390));
        engine.AddEntity(EntityHelper.CreateSolidPlatform(1802, 374, 115, 275));

        engine.AddEntity(EntityHelper.CreateCamera());

        engine.AddEntity(EntityHelper.CreateNpcEntity(1400, 445, 95, 144, 1163, 406, 857, 375, 'John', function (self: NPCComponent, option: number, initialInteraction: boolean) {
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

                    engine.AddEntity(EntityHelper.CreateLevelTriggerEntity(1800, 465, 1, 200, new Level2(), 0, 300));
                    break;
                }
                case 1: {
                    player.RemoveComponent(TopTextComponent.name);

                    if (option == 0) {
                        player.AddComponent(new TopTextComponent("We have a winner."));
                    } else {
                        player.AddComponent(new TopTextComponent("Game over."));
                    }

                    break;
                }
                case 2: {
                    player.RemoveComponent(TopTextComponent.name);

                    self.interactable = false;
                    var playerComponent = <PlayerComponent>player.GetComponent(PlayerComponent.name);
                    playerComponent.interactingWith = null;
                    playerComponent.currentState = PlayerState.OnGround;

                    break;
                }
            }
        }));

        engine.AddEntity(EntityHelper.CreatePlayerEntity(playerX, playerY));
    }
}

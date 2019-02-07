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

        var npc = EntityHelper.CreateNpcEntity(1400, 445, 130, 195, 1163, 406, 857, 375, 'John', function (self: NPCComponent, option: number, initialInteraction: boolean): boolean {
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

                    engine.AddEntity(EntityHelper.CreateLevelTriggerEntity(1800, 465, 1, 200, new Level2(), 0, 300));

                    var npcMoveableComponent = new MoveableComponent(self.positionComponent);
                    npcMoveableComponent.velocity = new Vector2d(200, 0);
                    npc.AddComponent(npcMoveableComponent);

                    var npcEyeLeft = new Entity('npcEyeLeft');
                    var npcEyeLeftPosition = new PositionComponent(self.positionComponent.position.x + 60, self.positionComponent.position.y + 58);
                    npcEyeLeft.AddComponent(npcEyeLeftPosition);
                    npcEyeLeft.AddComponent(new RenderableComponent(npcEyeLeftPosition, 5, 6, '', RenderLayer.ForegroundPlayer, SpriteHelper.npcLeftEyeAnimation, 999));
                    var npcEyeRight = new Entity('npcEyeRight');
                    var npcEyeRightPosition = new PositionComponent(self.positionComponent.position.x + 75, self.positionComponent.position.y + 58);
                    npcEyeRight.AddComponent(npcEyeRightPosition);
                    npcEyeRight.AddComponent(new RenderableComponent(npcEyeRightPosition, 5, 8, '', RenderLayer.ForegroundPlayer, SpriteHelper.npcRightEyeAnimation, 999));
                    npc.AddComponent(new ActionComponent(function (deltaTime: number, self: Entity, actionComponent: ActionComponent) {
                        var npcComponent = <NPCComponent>self.GetComponent(NPCComponent.name);
                        npcEyeLeftPosition.position.x = npcComponent.positionComponent.position.x + 60;
                        npcEyeLeftPosition.position.y = npcComponent.positionComponent.position.y + 58;
                        npcEyeRightPosition.position.x = npcComponent.positionComponent.position.x + 75;
                        npcEyeRightPosition.position.y = npcComponent.positionComponent.position.y + 57;

                        actionComponent.timerHelper += deltaTime;
                        if (actionComponent.timerHelper >= 1) {
                            actionComponent.timerHelper = 0;
                            var npcEyeLeftRender = <RenderableComponent>npcEyeLeft.GetComponent(RenderableComponent.name);
                            var npcEyeRightRender = <RenderableComponent>npcEyeRight.GetComponent(RenderableComponent.name);

                            npcEyeLeftRender.visible = !npcEyeLeftRender.visible;
                            npcEyeRightRender.visible = !npcEyeRightRender.visible;
                        }
                    }));

                    engine.AddEntity(npcEyeLeft);
                    engine.AddEntity(npcEyeRight);

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
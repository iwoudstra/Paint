/// <reference path="../core/system.ts" />

class Level1 extends Level {
    private static instance: Level = null;
    public static get Instance(): Level {
        if (this.instance === null) {
            this.instance = new Level1();
        }

        return this.instance;
    }

    private constructor() {
        super(2635, 845, SpriteHelper.level1Animation, SpriteHelper.level1Animation);
    }

    protected initEntities(engine: Engine, playerX: number, playerY: number): void {
        this.entities.push(EntityHelper.CreateGameMap(this.Width, this.Height, this.MapLayout, RenderLayer.Player));


        this.entities.push(EntityHelper.CreateSolidPlatform(130, 810, 2080, 35));
        this.entities.push(EntityHelper.CreateSolidPlatform(2205, 715, 70, 130));
        this.entities.push(EntityHelper.CreateSolidPlatform(2275, 650, 390, 195));
        this.entities.push(EntityHelper.CreateSolidPlatform(0, 550, 155, 350));
        this.entities.push(EntityHelper.CreateSolidPlatform(2636, 0, 1, 800));


        this.entities.push(EntityHelper.CreateCamera());

        let levelEntities = this.entities;
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
                    player.AddComponent(new TopTextComponent("You! Follow. My people. Help need. I see where your broom go.", ['Show me the way strange man', 'My mother told me not to talk to strangers']));

                    return false;
                }
                case 1: {
                    player.RemoveComponent(TopTextComponent.name);
                    player.AddComponent(new TopTextComponent("Let's go. You follow. Me lead."));




                    var playerComponent = <PlayerComponent>player.GetComponent(PlayerComponent.name);
                    playerComponent.hasBluePaint = true;

                    let levelTrigger = EntityHelper.CreateLevelTriggerEntity(2560, 0, 1, 700, Level2.Instance, 250, 300)
                    levelEntities.push(levelTrigger);
                    engine.AddEntity(levelTrigger);

                    var npcMoveableComponent = new MoveableComponent(self.positionComponent);
                    npcMoveableComponent.velocity = new Vector2d(200, 0);
                    npc.AddComponent(npcMoveableComponent);

                    self.interactingState = 2;

                    return false;
                }
                case 2:
                case 3: {
                    self.interactingState = 2;

                    if (!initialInteraction) {
                        return true;
                    }

                    player.RemoveComponent(TopTextComponent.name);
                    player.AddComponent(new TopTextComponent("Hurry up! My people cannot wait much longer!"));


                    return true;
                }
            }
        });
        this.entities.push(npc);
        this.entities.push(EntityHelper.CreateEventEntity(300, 500, 200, 200, 250, 300));

        this.entities.push(EntityHelper.CreateAttackableObstacle(1600, 0, 10, 900, 130));

        this.playerEntity = EntityHelper.CreatePlayerEntity(playerX, playerY);
        this.entities.push(this.playerEntity);
    }
}

/// <reference path="../core/system.ts" />

class Level1 extends Level {
    private static instance: Level = null;
    public static get Instance(): Level {
        if (this.instance === null) {
            this.instance = new Level1();
        }

        return this.instance;
    }

    private entitiesInitialized: boolean = false;
    private playerEntity: Entity;
    private entities: Entity[] = [];

    private constructor() {
        super(2635, 845, SpriteHelper.level1Animation, SpriteHelper.level1Animation);
    }

    private initEntities(engine: Engine, playerX: number, playerY: number): void {
        if (this.entitiesInitialized) {
            return;
        }
        this.entitiesInitialized = true;

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
                    playerComponent.HasBluePaint = true;

                    let levelTrigger = EntityHelper.CreateLevelTriggerEntity(2560, 520, 1, 200, Level2.Instance, 250, 300)
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

                    player.RemoveComponent(TopTextComponent.name);
                    player.AddComponent(new TopTextComponent("Hurry up! My people cannot wait much longer!"));


                    return true;
                }
            }
        });
        this.entities.push(npc);
        this.entities.push(EntityHelper.CreateEventEntity(300, 500, 200, 200, 250, 300));

        this.playerEntity = EntityHelper.CreatePlayerEntity(playerX, playerY)
        this.entities.push(this.playerEntity);
    }

    public Init(engine: Engine, playerX: number, playerY: number): void {
        this.initEntities(engine, playerX, playerY);

        let playerPosition = <PositionComponent>this.playerEntity.GetComponent(PositionComponent.name);
        playerPosition.position.x = playerX;
        playerPosition.position.y = playerY;

        engine.RemoveAllEntities();
        for (let entity of this.entities) {
            engine.AddEntity(entity);
        }
    }
}

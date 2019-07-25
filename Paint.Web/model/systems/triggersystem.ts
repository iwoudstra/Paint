/// <reference path="../core/system.ts" />

class TriggerSystem extends System {
    public static CollisionWithPlayer(engine: Engine, positionComponent: PositionComponent): boolean {
        var playerEntity = engine.GetEntityByName('player');
        var player: PlayerComponent = <PlayerComponent>playerEntity.GetComponent(PlayerComponent.name);
        if ((positionComponent.position.x <= player.positionComponent.position.x + player.positionComponent.width && positionComponent.position.x + positionComponent.width > player.positionComponent.position.x)
            && (positionComponent.position.y <= player.positionComponent.position.y + player.positionComponent.height && positionComponent.position.y + positionComponent.height > player.positionComponent.position.y)) {
            return true;
        }
        return false;
    }
    public eventTriggered: boolean = false;
    public Update(deltaTime: number): void {
        var levelTriggers = this.engine.GetEntities([LevelTriggerComponent.name]);
        var levelEvents = this.engine.GetEntities([EventComponent.name]);

        for (var i = 0; i < levelTriggers.length; ++i) {
            var levelTrigger: LevelTriggerComponent = <LevelTriggerComponent>levelTriggers[i].GetComponent(LevelTriggerComponent.name);
            if (TriggerSystem.CollisionWithPlayer(this.engine, levelTrigger.positionComponent)) {
                Game.Instance.ChangeLevel(levelTrigger.level, levelTrigger.playerX, levelTrigger.playerY);
            }
        }

        for (var i = 0; i < levelEvents.length; ++i) {
            var levelEvent: EventComponent = <EventComponent>levelEvents[i].GetComponent(EventComponent.name);

            if (TriggerSystem.CollisionWithPlayer(this.engine, levelEvent.positionComponent) && this.eventTriggered === false) {
                console.log("Fire event");
                this.eventTriggered = true;
            }
        }
    }

    public LevelChanged(): void {
    }
    public EntityAdded(entity: Entity): void {
    }
    public EntityRemoved(entity: Entity): void {
    }
}
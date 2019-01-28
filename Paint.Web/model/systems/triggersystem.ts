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

    public Update(deltaTime: number): void {
        var levelTriggers = this.engine.GetEntities([LevelTriggerComponent.name]);

        for (var i = 0; i < levelTriggers.length; ++i) {
            var levelTrigger: LevelTriggerComponent = <LevelTriggerComponent>levelTriggers[i].GetComponent(LevelTriggerComponent.name);
            if (TriggerSystem.CollisionWithPlayer(this.engine, levelTrigger.positionComponent)) {
                Game.Instance.ChangeLevel(levelTrigger.level, levelTrigger.playerX, levelTrigger.playerY);
            }
        }
    }
}
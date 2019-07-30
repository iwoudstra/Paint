/// <reference path="../core/system.ts" />

class SpawnedSystem extends System {
    private requiredComponents: string[] = [SpawnedComponent.name];

    private CollisionWithPlayer(playerComponent: PlayerComponent, spawnedComponent: SpawnedComponent): boolean {
        if ((playerComponent.positionComponent.position.x <= spawnedComponent.positionComponent.position.x + spawnedComponent.positionComponent.width && playerComponent.positionComponent.position.x + playerComponent.positionComponent.width > spawnedComponent.positionComponent.position.x)
            && (playerComponent.positionComponent.position.y <= spawnedComponent.positionComponent.position.y + spawnedComponent.positionComponent.height && playerComponent.positionComponent.position.y + playerComponent.positionComponent.height > spawnedComponent.positionComponent.position.y)) {
            return true;
        }
        return false;
    }

    public Update(deltaTime: number): void {
        var entities = this.engine.GetEntities(this.requiredComponents);
        var player = this.engine.GetEntityByName('player');
        var playerComponent = <PlayerComponent>player.GetComponent(PlayerComponent.name);

        for (var i = 0; i < entities.length; ++i) {
            var spawnComponent: SpawnedComponent = <SpawnedComponent>entities[i].GetComponent(SpawnedComponent.name);

            if (spawnComponent.moveableComponent.velocity.x === 0 && spawnComponent.moveableComponent.velocity.y === 0) {
                this.engine.RemoveEntity(entities[i], false);
            } else if (spawnComponent.moveableComponent.positionComponent.position.x > spawnComponent.maxPosition.x || spawnComponent.moveableComponent.positionComponent.position.x < spawnComponent.minPosition.x
                || spawnComponent.moveableComponent.positionComponent.position.y > spawnComponent.maxPosition.y || spawnComponent.moveableComponent.positionComponent.position.y < spawnComponent.minPosition.y) {
                this.engine.RemoveEntity(entities[i], false);
            } else if (this.CollisionWithPlayer(playerComponent, spawnComponent)) {
                playerComponent.newState = PlayerState.Respawing;
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
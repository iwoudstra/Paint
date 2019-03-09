/// <reference path="../core/system.ts" />

class SpawningSystem extends System {
    private requiredComponents: string[] = [SpawnComponent.name];

    public Update(deltaTime: number): void {
        var entities = this.engine.GetEntities(this.requiredComponents);

        for (var i = 0; i < entities.length; ++i) {
            var spawnComponent: SpawnComponent = <SpawnComponent>entities[i].GetComponent(SpawnComponent.name);
            spawnComponent.spawnTimer += deltaTime;
            if (spawnComponent.spawnTimer >= spawnComponent.spawnTime) {
                spawnComponent.spawnTimer = 0;
                var entity = EntityHelper.CreateSpawnedEntity(spawnComponent.spawnLocation.x, spawnComponent.spawnLocation.y, 10, 10, spawnComponent.spawnVelocity.clone(), spawnComponent.spawnMinPosition, spawnComponent.spawnMaxPosition);
                this.engine.AddEntity(entity);
            }
        }
    }
}
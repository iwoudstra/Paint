class Engine {
    private entities: Entity[];
    private entityNames: Map<string, Entity>;
    private systems: System[];
    private updating: boolean = false;

    public AddEntity(entity: Entity): void {
        if (this.entityNames.has(entity.name)) {
            throw new Error("Entity with name " + entity.name + " already exists.");
        }

        this.entityNames.set(entity.name, entity);
        this.entities.push(entity);
    }

    public RemoveEntity(entity: Entity): Entity {
        var index = this.entities.indexOf(entity);
        if (index !== -1) {
            var entity = this.entities[index];

            this.entityNames.delete(entity.name);
            this.entities.splice(index, 1);
            return entity;
        }

        return null;
    }

    public Update(deltaTime: number): void {
        this.updating = true;

        for (var system in this.systems) {
            this.systems[system].Update(deltaTime);
        }

        this.updating = false;
    }
}
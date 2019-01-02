class Engine {
    private entities: Entity[];
    private entityNames: Map<string, Entity>;
    private systems: any[];
    private nodeLists: any[];

    public AddEntity(entity: Entity): void {
        this.entities.push(entity);
    }

    public RemoveEntity(entity: Entity): Entity {
        var index = this.entities.indexOf(entity);
        if (index !== -1) {
            var entity = this.entities[index];
            this.entities.splice(index, 1);
            return entity;
        }

        return null;
    }
}
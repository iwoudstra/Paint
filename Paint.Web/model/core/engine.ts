class Engine {
    private entities: Entity[] = [];
    private entityNames: Map<string, Entity> = new Map<string, Entity>();
    private systems: System[] = [];
    private updating: boolean = false;

    constructor() {
        this.systems.push(new MovingSystem(this));
        this.systems.push(new PlayerSystem(this));
        this.systems.push(new EnemySystem(this));
        this.systems.push(new InputHandlingSystem(this));
        this.systems.push(new ActionSystem(this));
        this.systems.push(new SpawningSystem(this));
        this.systems.push(new SpawnedSystem(this));
        this.systems.push(new TriggerSystem(this));
        this.systems.push(new AttackSystem(this));
        this.systems.push(new CameraSystem(this));
        this.systems.push(new RenderingSystem(this));
    }

    public AddEntity(entity: Entity): void {
        if (this.entityNames.has(entity.name)) {
            throw new Error("Entity with name " + entity.name + " already exists.");
        }

        this.entityNames.set(entity.name, entity);
        this.entities.push(entity);

        for (let system of this.systems) {
            system.EntityAdded(entity);
        }
    }

    public RemoveEntity(entity: Entity, removeFromLevel: boolean): Entity {
        var index = this.entities.indexOf(entity);
        if (index !== -1) {
            var entity = this.entities[index];

            this.entityNames.delete(entity.name);
            this.entities.splice(index, 1);

            for (let system of this.systems) {
                system.EntityRemoved(entity);
            }

            return entity;
        }

        if (removeFromLevel) {
            Game.Instance.currentLevel.RemoveEntity(entity);
        }

        return null;
    }

    public RemoveAllEntities(): void {
        this.entities.splice(0, this.entities.length);
        this.entityNames.clear();
    }

    public GetEntities(componentTypes: string[]): Entity[] {
        var result: Entity[] = [];

        for (var i = 0; i < this.entities.length; ++i) {
            if (this.entities[i].HasComponents(componentTypes)) {
                result.push(this.entities[i]);
            }
        }

        return result;
    }

    public GetEntityByName(name: string): Entity {
        return this.entityNames.get(name);
    }

    public Update(deltaTime: number): void {
        this.updating = true;

        for (let system of this.systems) {
            system.Update(deltaTime);
        }

        this.updating = false;
    }

    public LevelChanged(): void {
        for (let system of this.systems) {
            system.LevelChanged();
        }
    }
}
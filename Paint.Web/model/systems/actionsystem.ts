/// <reference path="../core/system.ts" />

class ActionSystem extends System {
    private requiredComponents: string[] = [ActionComponent.name];

    public Update(deltaTime: number): void {
        var actions = this.engine.GetEntities(this.requiredComponents);

        for (var i = 0; i < actions.length; ++i) {
            var actionComponent = <ActionComponent>actions[i].GetComponent(ActionComponent.name);
            actionComponent.action(deltaTime, actions[i], actionComponent);
        }
    }

    public LevelChanged(): void {
    }
    public EntityAdded(entity: Entity): void {
    }
    public EntityRemoved(entity: Entity): void {
    }
}
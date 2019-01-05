/// <reference path="../core/system.ts" />

class MovingSystem extends System {
    private requiredComponents: string[] = [MoveableComponent.name];

    public Update(deltaTime: number): void {
        var entities = this.engine.GetEntities(this.requiredComponents);
        for (var i = 0; i < entities.length; ++i) {
            var moveableComponent: MoveableComponent = <MoveableComponent>entities[i].GetComponent(MoveableComponent.name);
            moveableComponent.positionComponent.position.add(moveableComponent.velocity.clone().multiplyByScalar(deltaTime));
        }
    }
}
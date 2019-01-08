/// <reference path="../core/system.ts" />

class RenderingSystem extends System {
    private requiredComponents: string[] = [RenderableComponent.name];

    public Update(deltaTime: number): void {
        var context = Game.Instance.context;
        context.clearRect(0, 0, 800, 600);

        var entities = this.engine.GetEntities(this.requiredComponents);
        for (var i = 0; i < entities.length; ++i) {
            var renderableComponent: RenderableComponent = <RenderableComponent>entities[i].GetComponent(RenderableComponent.name);
            context.beginPath();
            context.fillStyle = renderableComponent.color;
            context.strokeStyle = renderableComponent.color;
            context.fillRect(renderableComponent.positionComponent.position.x, renderableComponent.positionComponent.position.y, renderableComponent.width, renderableComponent.height);
        }
    }
}
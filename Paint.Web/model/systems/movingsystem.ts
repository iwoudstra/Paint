/// <reference path="../core/system.ts" />

class MovingSystem extends System {
    private requiredComponents: string[] = [MoveableComponent.name];

    public static IsOnGround(engine: Engine, moveableComponent: MoveableComponent): boolean {
        return moveableComponent.positionComponent.position.y + moveableComponent.positionComponent.height >= Game.ResolutionHeight;
    }

    public static IsOnPlatform(engine: Engine, moveableComponent: MoveableComponent): boolean {
        var platforms = engine.GetEntities([PlatformComponent.name]);
        for (var i = 0; i < platforms.length; ++i) {
            var platformComponent = <PlatformComponent>platforms[i].GetComponent(PlatformComponent.name);
            if ((moveableComponent.positionComponent.position.x <= platformComponent.positionComponent.position.x + platformComponent.positionComponent.width && moveableComponent.positionComponent.position.x + moveableComponent.positionComponent.width > platformComponent.positionComponent.position.x)
                && (Math.floor(moveableComponent.positionComponent.position.y + moveableComponent.positionComponent.height) === Math.floor(platformComponent.positionComponent.position.y + 0.01 * platformComponent.positionComponent.height))) {
                return true;
            }
        }
        return false;
    }

    public static IsOnGroundOrPlatform(engine: Engine, moveableComponent: MoveableComponent): boolean {
        return this.IsOnPlatform(engine, moveableComponent) || this.IsOnGround(engine, moveableComponent);
    }

    public Update(deltaTime: number): void {
        var entities = this.engine.GetEntities(this.requiredComponents);
        for (var i = 0; i < entities.length; ++i) {
            var moveableComponent: MoveableComponent = <MoveableComponent>entities[i].GetComponent(MoveableComponent.name);
            var movement = moveableComponent.velocity.clone().multiplyByScalar(deltaTime);
            moveableComponent.positionComponent.position.x += movement.x;
            if (moveableComponent.positionComponent.position.x < 0) {
                moveableComponent.positionComponent.position.x = 0;
            }

            if (movement.y > 0) {
                var ymovement = movement.y + moveableComponent.leftoverYMovement;

                for (var steps = 0; steps < ymovement; ++steps) {
                    if (MovingSystem.IsOnGroundOrPlatform(this.engine, moveableComponent)) {
                        moveableComponent.leftoverYMovement = 0;
                        moveableComponent.velocity.y = 0;
                    } else {
                        moveableComponent.positionComponent.position.y += 1;
                    }
                }
                moveableComponent.leftoverYMovement = ymovement - Math.floor(ymovement);
            } else if (movement.y < 0) {
                var ymovement = Math.floor(movement.y);
                moveableComponent.positionComponent.position.y += ymovement;
                moveableComponent.leftoverYMovement = movement.y - ymovement;
            }
        }
    }
}
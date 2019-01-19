/// <reference path="../core/system.ts" />

class MovingSystem extends System {
    private requiredComponents: string[] = [MoveableComponent.name];

    public static IsOnGround(engine: Engine, moveableComponent: MoveableComponent): boolean {
        return moveableComponent.positionComponent.position.y + moveableComponent.positionComponent.height >= Game.MapHeight;
    }

    public static HorizontalBounds(engine: Engine, moveableComponent: MoveableComponent, movement: number): boolean {
        return moveableComponent.positionComponent.position.x + movement <= 0;
    }

    public static IsOnPlatform(engine: Engine, moveableComponent: MoveableComponent, includingSolid: boolean): boolean {
        var platforms = engine.GetEntities([PlatformComponent.name]);
        for (var i = 0; i < platforms.length; ++i) {
            var platformComponent = <PlatformComponent>platforms[i].GetComponent(PlatformComponent.name);
            if ((moveableComponent.positionComponent.position.x <= platformComponent.positionComponent.position.x + platformComponent.positionComponent.width && moveableComponent.positionComponent.position.x + moveableComponent.positionComponent.width > platformComponent.positionComponent.position.x)
                && (Math.floor(moveableComponent.positionComponent.position.y + moveableComponent.positionComponent.height) === Math.floor(platformComponent.positionComponent.position.y + 0.01 * platformComponent.positionComponent.height))) {
                return true;
            }
        }

        if (includingSolid) {
            var solidPlatforms = engine.GetEntities([SolidPlatformComponent.name]);
            for (var i = 0; i < solidPlatforms.length; ++i) {
                var solidPlatformComponent = <SolidPlatformComponent>solidPlatforms[i].GetComponent(SolidPlatformComponent.name);
                if ((moveableComponent.positionComponent.position.x <= solidPlatformComponent.positionComponent.position.x + solidPlatformComponent.positionComponent.width && moveableComponent.positionComponent.position.x + moveableComponent.positionComponent.width > solidPlatformComponent.positionComponent.position.x)
                    && (Math.floor(moveableComponent.positionComponent.position.y + moveableComponent.positionComponent.height) === Math.floor(solidPlatformComponent.positionComponent.position.y + 0.01 * solidPlatformComponent.positionComponent.height))) {
                    return true;
                }
            }
        }

        return false;
    }

    public static CanMoveHorizontal(engine: Engine, moveableComponent: MoveableComponent, movement: number): boolean {
        if (this.HorizontalBounds(engine, moveableComponent, movement)) {
            return false;
        }

        var solidPlatforms = engine.GetEntities([SolidPlatformComponent.name]);

        for (var i = 0; i < solidPlatforms.length; ++i) {
            var solidPlatformComponent = <SolidPlatformComponent>solidPlatforms[i].GetComponent(SolidPlatformComponent.name);
            if ((moveableComponent.positionComponent.position.y <= solidPlatformComponent.positionComponent.position.y + solidPlatformComponent.positionComponent.height && moveableComponent.positionComponent.position.y + moveableComponent.positionComponent.height > solidPlatformComponent.positionComponent.position.y)
                && ((movement < 0 && moveableComponent.positionComponent.position.x + movement === solidPlatformComponent.positionComponent.position.x + solidPlatformComponent.positionComponent.width)
                    || (movement > 0 && moveableComponent.positionComponent.position.x + moveableComponent.positionComponent.width + movement === solidPlatformComponent.positionComponent.position.x))) {
                return false;
            }
        }

        return true;
    }

    public static IsOnGroundOrPlatform(engine: Engine, moveableComponent: MoveableComponent): boolean {
        return this.IsOnPlatform(engine, moveableComponent, true) || this.IsOnGround(engine, moveableComponent);
    }

    public Update(deltaTime: number): void {
        var entities = this.engine.GetEntities(this.requiredComponents);
        for (var i = 0; i < entities.length; ++i) {
            var moveableComponent: MoveableComponent = <MoveableComponent>entities[i].GetComponent(MoveableComponent.name);
            var movement = moveableComponent.velocity.clone().multiplyByScalar(deltaTime);

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

            if (movement.x > 0) {
                var xmovement = movement.x + moveableComponent.leftoverXMovement;
                for (var steps = 0; steps < xmovement; ++steps) {
                    if (!MovingSystem.CanMoveHorizontal(this.engine, moveableComponent, 1)) {
                        moveableComponent.leftoverXMovement = 0;
                        moveableComponent.velocity.x = 0;
                    } else {
                        moveableComponent.positionComponent.position.x += 1;
                    }
                }
                moveableComponent.leftoverXMovement = xmovement - Math.floor(xmovement);
            } else if (movement.x < 0) {
                var xmovement = movement.x + moveableComponent.leftoverXMovement;
                for (var steps = 0; steps > xmovement; --steps) {
                    if (!MovingSystem.CanMoveHorizontal(this.engine, moveableComponent, -1)) {

                        moveableComponent.leftoverXMovement = 0;
                        moveableComponent.velocity.x = 0;
                    } else {
                        moveableComponent.positionComponent.position.x -= 1;
                    }
                }
                moveableComponent.leftoverXMovement = xmovement - Math.floor(xmovement);
            }
        }
    }
}
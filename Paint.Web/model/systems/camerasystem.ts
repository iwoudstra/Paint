/// <reference path="../core/system.ts" />

class CameraSystem extends System {
    private requiredComponents: string[] = [MoveableComponent.name];

    public Update(deltaTime: number): void {
        var player = <PlayerComponent>this.engine.GetEntities([PlayerComponent.name])[0].GetComponent(PlayerComponent.name);
        var camera = <CameraComponent>this.engine.GetEntities([CameraComponent.name])[0].GetComponent(CameraComponent.name);

        if (player.moveableComponent.velocity.x < 0) {
            if (camera.horizontalDirection < 0) {
                camera.horizontalTime += deltaTime;
            } else {
                camera.horizontalDirection = player.moveableComponent.velocity.x;
                camera.horizontalTime = deltaTime;
            }
        } else if (player.moveableComponent.velocity.x > 0) {
            if (camera.horizontalDirection > 0) {
                camera.horizontalTime += deltaTime;
            } else {
                camera.horizontalDirection = player.moveableComponent.velocity.x;
                camera.horizontalTime = deltaTime;
            }
        } else {
            if (camera.horizontalTime !== 0) {
                camera.horizontalTime = 0;
            }
            camera.horizontalDirection = 0;
            camera.horizontalTime += deltaTime;
        }

        var preferredXPosition = camera.positionComponent.position.x;
        var speedFactor = 32;
        if (camera.horizontalTime > 0.5) {
            speedFactor = 8;

            if (camera.horizontalDirection < 0) {
                preferredXPosition = player.positionComponent.position.x - 600;
            } else if (camera.horizontalDirection > 0) {
                preferredXPosition = player.positionComponent.position.x - 200;
            } else {
                preferredXPosition = player.positionComponent.position.x - 400;
            }
        } else {
            preferredXPosition = player.positionComponent.position.x - 400;
        }

        if (preferredXPosition < 0) {
            preferredXPosition = 0;
        }

        camera.positionComponent.position.x = (camera.positionComponent.position.x * (speedFactor - 1) + preferredXPosition) / speedFactor;
    }
}
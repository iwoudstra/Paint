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

        if (player.moveableComponent.velocity.y < 0) {
            if (camera.verticalDirection < 0) {
                camera.verticalTime += deltaTime;
            } else {
                camera.verticalDirection = player.moveableComponent.velocity.y;
                camera.verticalTime = deltaTime;
            }
        } else if (player.moveableComponent.velocity.y > 0) {
            if (camera.verticalDirection > 0) {
                camera.verticalTime += deltaTime;
            } else {
                camera.verticalDirection = player.moveableComponent.velocity.y;
                camera.verticalTime = deltaTime;
            }
        } else {
            if (camera.verticalTime !== 0) {
                camera.verticalTime = 0;
            }
            camera.verticalDirection = 0;
            camera.verticalTime += deltaTime;
        }

        var speedFactor = 16;
        var preferredXPosition;
        if (camera.horizontalDirection < 0) {
            if (camera.horizontalTime > 0.5) {
                preferredXPosition = player.positionComponent.position.x - (Game.ResolutionWidth * 0.90);
            } else {
                preferredXPosition = player.positionComponent.position.x - (Game.ResolutionWidth * 0.65);
            }
        } else if (camera.horizontalDirection > 0) {
            if (camera.horizontalTime > 0.5) {
                preferredXPosition = player.positionComponent.position.x - (Game.ResolutionWidth * 0.10);
            } else {
                preferredXPosition = player.positionComponent.position.x - (Game.ResolutionWidth * 0.35);
            }
        } else {
            preferredXPosition = player.positionComponent.position.x - (Game.ResolutionWidth * 0.5);
        }

        if (preferredXPosition < 0) {
            preferredXPosition = 0;
        } else if (preferredXPosition > Game.Instance.currentLevel.Width - Game.ResolutionWidth) {
            preferredXPosition = Game.Instance.currentLevel.Width - Game.ResolutionWidth;
        }

        if (Math.abs(camera.positionComponent.position.x - preferredXPosition) < Math.abs(player.moveableComponent.velocity.x * 2 * deltaTime)) {
            camera.positionComponent.position.x = preferredXPosition;
        } else {
            camera.positionComponent.position.x = (camera.positionComponent.position.x * (speedFactor - 1) + preferredXPosition) / speedFactor;
        }


        var preferredYPosition;
        if (camera.verticalDirection < 0) {
            if (camera.verticalTime > 0.5) {
                preferredYPosition = player.positionComponent.position.y - (Game.ResolutionHeight * 0.90);
            } else {
                preferredYPosition = player.positionComponent.position.y - (Game.ResolutionHeight * 0.65);
            }
        } else if (camera.verticalDirection > 0) {
            if (camera.verticalTime > 0.5) {
                preferredYPosition = player.positionComponent.position.y - (Game.ResolutionHeight * 0.10);
            } else {
                preferredYPosition = player.positionComponent.position.y - (Game.ResolutionHeight * 0.35);
            }
        } else {
            preferredYPosition = player.positionComponent.position.y - (Game.ResolutionHeight * 0.5);
        }

        if (preferredYPosition < 0) {
            preferredYPosition = 0;
        } else if (preferredYPosition > Game.Instance.currentLevel.Height - Game.ResolutionHeight) {
            preferredYPosition = Game.Instance.currentLevel.Height - Game.ResolutionHeight;
        }

        if (Math.abs(camera.positionComponent.position.y - preferredYPosition) < Math.abs(player.moveableComponent.velocity.y * 2 * deltaTime)) {
            camera.positionComponent.position.y = preferredYPosition;
        } else {
            camera.positionComponent.position.y = (camera.positionComponent.position.y * (speedFactor - 1) + preferredYPosition) / speedFactor;
        }
    }

    public LevelChanged(): void {
    }
    public EntityAdded(entity: Entity): void {
    }
    public EntityRemoved(entity: Entity): void {
    }
}
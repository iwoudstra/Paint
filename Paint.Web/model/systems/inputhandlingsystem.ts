/// <reference path="../core/system.ts" />

class InputHandlingSystem extends System {
    private requiredComponents: string[] = [InputComponent.name];

    constructor(engine: Engine) {
        super(engine);

        document.body.addEventListener("keydown", this.HandleKeyDown);
        document.body.addEventListener("keyup", this.HandleKeyUp);
    }

    private HandleKeyDown = (ev: KeyboardEvent) => {
        this.HandleKey(ev, true);
    }

    private HandleKeyUp = (ev: KeyboardEvent) => {
        this.HandleKey(ev, false);
    }

    private AddDebug(): void {
        var platforms = this.engine.GetEntities([PlatformComponent.name]);
        var solidPlatforms = this.engine.GetEntities([SolidPlatformComponent.name]);

        for (var i = 0; i < platforms.length; ++i) {
            console.log('platform');
            var positionComponent = <PositionComponent>platforms[i].GetComponent(PositionComponent.name);
            platforms[i].AddComponent(new RenderableComponent(positionComponent, positionComponent.width, positionComponent.height, '#00ff00'));
        }

        for (var i = 0; i < solidPlatforms.length; ++i) {
            var positionComponent = <PositionComponent>solidPlatforms[i].GetComponent(PositionComponent.name);
            solidPlatforms[i].AddComponent(new RenderableComponent(positionComponent, positionComponent.width, positionComponent.height, '#ff0000'));
        }
    }

    private RemoveDebug(): void {
        var platforms = this.engine.GetEntities([PlatformComponent.name]);
        var solidPlatforms = this.engine.GetEntities([SolidPlatformComponent.name]);

        for (var i = 0; i < platforms.length; ++i) {
            platforms[i].RemoveComponent(RenderableComponent.name);
        }

        for (var i = 0; i < solidPlatforms.length; ++i) {
            solidPlatforms[i].RemoveComponent(RenderableComponent.name);
        }
    }

    private addedDebug: boolean = false;

    private HandleKey(ev: KeyboardEvent, active: boolean) {
        if (ev.repeat) {
            return;
        }

        var entities = this.engine.GetEntities(this.requiredComponents);
        for (var i = 0; i < entities.length; ++i) {
            var inputComponent: InputComponent = <InputComponent>entities[i].GetComponent(InputComponent.name);

            switch (ev.key.toUpperCase()) {
                case inputComponent.moveLeftKey: {
                    inputComponent.moveLeftActive = active;
                    break;
                }
                case inputComponent.moveRightKey: {
                    inputComponent.moveRightActive = active;
                    break;
                }
                case inputComponent.jumpKey: {
                    inputComponent.jumpActive = active;
                    break;
                }
                case inputComponent.downKey: {
                    inputComponent.downActive = active;
                    break;
                }
                case inputComponent.paintKey: {
                    inputComponent.paintActive = active;
                    break;
                }
                case ',': {
                    if (!this.addedDebug) {
                        this.addedDebug = true;
                        this.AddDebug();
                    }
                    break;
                }
                case '.': {
                    if (this.addedDebug) {
                        this.addedDebug = false;
                        this.RemoveDebug();
                    }
                    break;
                }
            }
        }

    }

    public Update(deltaTime: number): void {
        var entities = this.engine.GetEntities(this.requiredComponents);
        for (var i = 0; i < entities.length; ++i) {
            var inputComponent: InputComponent = <InputComponent>entities[i].GetComponent(InputComponent.name);
            inputComponent.paintActivePrevious = inputComponent.paintActive;
        }
    }
}
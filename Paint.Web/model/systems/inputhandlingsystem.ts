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
            }
        }

    }

    public Update(deltaTime: number): void {
        var entities = this.engine.GetEntities(this.requiredComponents);

        for (var i = 0; i < entities.length; ++i) {

        }
    }
}
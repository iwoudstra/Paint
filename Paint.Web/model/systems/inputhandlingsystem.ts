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
        let platforms = this.engine.GetEntities([PlatformComponent.name]);
        let solidPlatforms = this.engine.GetEntities([SolidPlatformComponent.name]);
        let triggers = this.engine.GetEntities([LevelTriggerComponent.name]);
        let events = this.engine.GetEntities([EventComponent.name]);
        let attacks = this.engine.GetEntities([AttackComponent.name]);
        let attackables = this.engine.GetEntities([AttackableComponent.name]);

        for (let i = 0; i < platforms.length; ++i) {
            let positionComponent = <PositionComponent>platforms[i].GetComponent(PositionComponent.name);
            if (!platforms[i].HasComponent(DebugRenderableComponent.name)) {
                platforms[i].AddComponent(new DebugRenderableComponent(positionComponent, positionComponent.width, positionComponent.height, '#00ff00', RenderLayer.ForegroundPlayer));
            }
        }

        for (let i = 0; i < solidPlatforms.length; ++i) {
            let positionComponent = <PositionComponent>solidPlatforms[i].GetComponent(PositionComponent.name);
            if (!solidPlatforms[i].HasComponent(DebugRenderableComponent.name)) {
                solidPlatforms[i].AddComponent(new DebugRenderableComponent(positionComponent, positionComponent.width, positionComponent.height, '#ff0000', RenderLayer.ForegroundPlayer));
            }
        }

        for (let i = 0; i < triggers.length; ++i) {
            let positionComponent = <PositionComponent>triggers[i].GetComponent(PositionComponent.name);
            if (!triggers[i].HasComponent(DebugRenderableComponent.name)) {
                triggers[i].AddComponent(new DebugRenderableComponent(positionComponent, positionComponent.width, positionComponent.height, '#ffff00', RenderLayer.ForegroundPlayer));
            }
        }

        for (let i = 0; i < events.length; ++i) {
            let positionComponent = <PositionComponent>events[i].GetComponent(PositionComponent.name);
            if (!events[i].HasComponent(DebugRenderableComponent.name)) {
                events[i].AddComponent(new DebugRenderableComponent(positionComponent, positionComponent.width, positionComponent.height, '#ee92f4', RenderLayer.ForegroundPlayer));
            }
        }

        for (let attack of attacks) {
            let positionComponent = <PositionComponent>attack.GetComponent(PositionComponent.name);
            if (!attack.HasComponent(DebugRenderableComponent.name)) {
                attack.AddComponent(new DebugRenderableComponent(positionComponent, positionComponent.width, positionComponent.height, '#00ffff', RenderLayer.ForegroundPlayer));
            }
        }

        for (let attackable of attackables) {
            let positionComponent = <PositionComponent>attackable.GetComponent(PositionComponent.name);
            if (!attackable.HasComponent(DebugRenderableComponent.name)) {
                attackable.AddComponent(new DebugRenderableComponent(positionComponent, positionComponent.width, positionComponent.height, '#33AA77', RenderLayer.ForegroundPlayer));
            }
        }
    }

    private RemoveDebug(): void {
        let platforms = this.engine.GetEntities([PlatformComponent.name]);
        let solidPlatforms = this.engine.GetEntities([SolidPlatformComponent.name]);
        let triggers = this.engine.GetEntities([LevelTriggerComponent.name]);
        let events = this.engine.GetEntities([EventComponent.name]);
        let attacks = this.engine.GetEntities([AttackComponent.name]);
        let attackables = this.engine.GetEntities([AttackableComponent.name]);

        for (let i = 0; i < platforms.length; ++i) {
            platforms[i].RemoveComponent(DebugRenderableComponent.name);
        }

        for (let i = 0; i < solidPlatforms.length; ++i) {
            solidPlatforms[i].RemoveComponent(DebugRenderableComponent.name);
        }

        for (let i = 0; i < triggers.length; ++i) {
            triggers[i].RemoveComponent(DebugRenderableComponent.name);
        }

        for (let i = 0; i < events.length; ++i) {
            events[i].RemoveComponent(DebugRenderableComponent.name);
        }

        for (let attack of attacks) {
            attack.RemoveComponent(DebugRenderableComponent.name);
        }

        for (let attackable of attackables) {
            attackable.RemoveComponent(DebugRenderableComponent.name);
        }
    }

    public static addedDebug: boolean = false;

    private HandleKey(ev: KeyboardEvent, active: boolean) {
        if (ev.repeat) {
            return;
        }

        let entities = this.engine.GetEntities(this.requiredComponents);
        for (let i = 0; i < entities.length; ++i) {
            let inputComponent: InputComponent = <InputComponent>entities[i].GetComponent(InputComponent.name);

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
                case inputComponent.interactionKey: {
                    inputComponent.interactionActive = active;
                    break;
                }
                case inputComponent.cancelInteractionKey: {
                    inputComponent.cancelInteractionActive = active;
                    break;
                }
                case inputComponent.attackKey: {
                    inputComponent.attackActive = active;
                    break;
                }
                case ',': {
                    if (!InputHandlingSystem.addedDebug) {
                        InputHandlingSystem.addedDebug = true;
                        this.AddDebug();
                    }
                    break;
                }
                case '.': {
                    if (InputHandlingSystem.addedDebug) {
                        InputHandlingSystem.addedDebug = false;
                        this.RemoveDebug();
                    }
                    break;
                }
            }
        }
    }

    public Update(deltaTime: number): void {
        let entities = this.engine.GetEntities(this.requiredComponents);
        for (let i = 0; i < entities.length; ++i) {
            let inputComponent: InputComponent = <InputComponent>entities[i].GetComponent(InputComponent.name);
            inputComponent.paintActivePrevious = inputComponent.paintActive;
            inputComponent.interactionActivePrevious = inputComponent.interactionActive;
            inputComponent.jumpActivePrevious = inputComponent.jumpActive;
            inputComponent.downActivePrevious = inputComponent.downActive;
            inputComponent.attackActivePrevious = inputComponent.attackActive;
        }
    }

    public LevelChanged(): void {
        if (InputHandlingSystem.addedDebug) {
            this.AddDebug();
        } else {
            this.RemoveDebug();
        }
    }
    public EntityAdded(entity: Entity): void {
        if (InputHandlingSystem.addedDebug) {
            this.AddDebug();
        }
    }
    public EntityRemoved(entity: Entity): void {
    }
}
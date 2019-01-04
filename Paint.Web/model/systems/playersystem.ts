/// <reference path="../core/system.ts" />

class PlayerSystem extends System {
    private requiredComponents: string[] = [PlayerComponent.name];
    private movementSpeed: number = 400;

    public Update(deltaTime: number): void {
        var entities = this.engine.GetEntities(this.requiredComponents);
        for (var i = 0; i < entities.length; ++i) {
            var playerComponent: PlayerComponent = <PlayerComponent>entities[i].GetComponent(PlayerComponent.name);
            var inputComponent: InputComponent = <InputComponent>entities[i].GetComponent(InputComponent.name);
            var moveableComponent: MoveableComponent = <MoveableComponent>entities[i].GetComponent(MoveableComponent.name);

            switch (playerComponent.currentState) {
                case PlayerState.Idle: {
                    this.HandleIdleState(entities[i], playerComponent, inputComponent, moveableComponent);
                    break;
                }
                case PlayerState.Jumping: {
                    this.HandleJumpingState(entities[i], playerComponent, inputComponent, moveableComponent);
                    break;
                }
                case PlayerState.Moving: {
                    this.HandleMovingState(entities[i], playerComponent, inputComponent, moveableComponent);
                    break;
                }
            }
        }
    }

    private HandleIdleState(entity: Entity, playerComponent: PlayerComponent, inputComponent: InputComponent, moveableComponent: MoveableComponent): void {
        if (inputComponent.moveLeftActive && !inputComponent.moveRightActive) {
            moveableComponent.velocity = new Vector2d(-this.movementSpeed, 0);
        } else if (inputComponent.moveRightActive && !inputComponent.moveLeftActive) {
            moveableComponent.velocity = new Vector2d(this.movementSpeed, 0);
        } else {
            moveableComponent.velocity = new Vector2d(0, 0);
        }
    }

    private HandleJumpingState(entity: Entity, playerComponent: PlayerComponent, inputComponent: InputComponent, moveableComponent: MoveableComponent): void {

    }

    private HandleMovingState(entity: Entity, playerComponent: PlayerComponent, inputComponent: InputComponent, moveableComponent: MoveableComponent): void {

    }
}
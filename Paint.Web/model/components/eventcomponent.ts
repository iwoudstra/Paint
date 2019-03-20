/// <reference path="../core/component.ts" />

class EventComponent extends Component {
    positionComponent: PositionComponent;
    playerX: number;
    playerY: number;

    constructor(positionComponent: PositionComponent, playerX: number, playerY: number) {
        super();

        this.positionComponent = positionComponent;
        this.playerX = playerX;
        this.playerY = playerY;
    }
}
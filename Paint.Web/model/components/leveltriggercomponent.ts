/// <reference path="../core/component.ts" />

class LevelTriggerComponent extends Component {
    positionComponent: PositionComponent;
    playerX: number;
    playerY: number;
    level: Level;

    constructor(positionComponent: PositionComponent, playerX: number, playerY: number, level: Level) {
        super();

        this.positionComponent = positionComponent;
        this.playerX = playerX;
        this.playerY = playerY;
        this.level = level;
    }
}
/// <reference path="../core/component.ts" />

class RenderableComponent extends Component {
    positionComponent: PositionComponent;
    width: number;
    height: number;
    color: string;
    gameAnimation: GameAnimation;
    public frame: number = 0;
    public frameTimer: number = 0;
    public orientationLeft: boolean = false;

    constructor(positionComponent: PositionComponent, width: number, height: number, color: string, gameAnimation: GameAnimation = null) {
        super();

        this.positionComponent = positionComponent;
        this.width = width;
        this.height = height;
        this.color = color;
        this.gameAnimation = gameAnimation;
    }
}
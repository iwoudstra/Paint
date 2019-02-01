/// <reference path="../core/component.ts" />

enum RenderLayer {
    Background = 0,
    Player = 1,
    ForegroundPlayer = 2,
    Foreground = 3
}

class RenderableComponent extends Component {
    positionComponent: PositionComponent;
    width: number;
    height: number;
    color: string;
    gameAnimation: GameAnimation;
    renderLayer: RenderLayer;
    renderPriority: number;

    public frame: number = 0;
    public frameTimer: number = 0;
    public orientationLeft: boolean = false;

    constructor(positionComponent: PositionComponent, width: number, height: number, color: string, renderLayer: RenderLayer, gameAnimation: GameAnimation = null, renderPriority: number = 0) {
        super();

        this.positionComponent = positionComponent;
        this.width = width;
        this.height = height;
        this.color = color;
        this.renderLayer = renderLayer;
        this.gameAnimation = gameAnimation;
        this.renderPriority = renderPriority;
    }
}
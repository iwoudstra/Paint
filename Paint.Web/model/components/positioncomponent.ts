/// <reference path="../core/component.ts" />

class PositionComponent extends Component {
    position: Vector2d = new Vector2d(0, 0);
    width: number;
    height: number;

    constructor(x: number = 0, y: number = 0, width: number = 50, height: number = 100) {
        super();

        this.position.x = x;
        this.position.y = y;
        this.width = width;
        this.height = height;
    }
}
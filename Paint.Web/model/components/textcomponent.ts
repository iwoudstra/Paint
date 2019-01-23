/// <reference path="../core/component.ts" />

class TextComponent extends Component {
    positionComponent: PositionComponent;
    text: string;

    constructor(positionComponent: PositionComponent, text: string) {
        super();

        this.positionComponent = positionComponent;
        this.text = text;
    }
}
﻿/// <reference path="../core/component.ts" />

class PlatformComponent extends Component {
    positionComponent: PositionComponent;

    constructor(positionComponent: PositionComponent) {
        super();

        this.positionComponent = positionComponent;
    }
}
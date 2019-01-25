﻿/// <reference path="../core/component.ts" />

class SpawnComponent extends Component {
    positionComponent: PositionComponent;
    spawnLocation: Vector2d;
    spawnVelocity: Vector2d;
    spawnMinPosition: Vector2d;
    spawnMaxPosition: Vector2d;
    spawnTime: number;
    spawnTimer: number = 0;

    constructor(positionComponent: PositionComponent, spawnLocation: Vector2d, spawnVelocity: Vector2d, spawnMinPosition: Vector2d, spawnMaxPosition: Vector2d, spawnTime: number) {
        super();

        this.positionComponent = positionComponent;
        this.spawnLocation = spawnLocation;
        this.spawnVelocity = spawnVelocity;
        this.spawnMaxPosition = spawnMaxPosition;
        this.spawnMinPosition = spawnMinPosition;
        this.spawnTime = spawnTime;
    }
}
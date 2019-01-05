class Game {
    constructor() {
        this.requestAnimFrame = window.requestAnimationFrame;
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
    }
    static get Instance() {
        return this._instance || (this._instance = new this());
    }
    Init() {
        this.engine = new Engine();
        var player = new Entity("player");
        var inputComponent = new InputComponent();
        player.AddComponent(inputComponent);
        var positionComponent = new PositionComponent();
        player.AddComponent(positionComponent);
        var moveableComponent = new MoveableComponent(positionComponent);
        player.AddComponent(moveableComponent);
        player.AddComponent(new RenderableComponent(positionComponent));
        player.AddComponent(new PlayerComponent(positionComponent, moveableComponent, inputComponent));
        this.engine.AddEntity(player);
        this.lastTime = performance.now();
        this.Handle(this.lastTime);
    }
    Handle(timestamp) {
        this.now = timestamp;
        this.deltaTime = (this.now - this.lastTime) / 1000.0;
        this.engine.Update(this.deltaTime);
        this.lastTime = this.now;
        window.requestAnimationFrame(function (newTimestamp) {
            Game.Instance.Handle(newTimestamp);
        });
    }
}
class Player {
}
class Component {
}
class InputComponent extends Component {
    constructor() {
        super(...arguments);
        this.moveLeftKey = "A";
        this.moveRightKey = "D";
        this.jumpKey = "W";
    }
}
class MoveableComponent extends Component {
    constructor(positionComponent) {
        super();
        this.velocity = new Vector2d(0, 0);
        this.positionComponent = positionComponent;
    }
}
var PlayerState;
(function (PlayerState) {
    PlayerState[PlayerState["Idle"] = 0] = "Idle";
    PlayerState[PlayerState["Moving"] = 1] = "Moving";
    PlayerState[PlayerState["Jumping"] = 2] = "Jumping";
    PlayerState[PlayerState["Falling"] = 3] = "Falling";
})(PlayerState || (PlayerState = {}));
class PlayerComponent extends Component {
    constructor(positionComponent, moveableComponent, inputComponent) {
        super();
        this.currentState = PlayerState.Idle;
        this.positionComponent = positionComponent;
        this.moveableComponent = moveableComponent;
        this.inputComponent = inputComponent;
    }
}
class PositionComponent extends Component {
    constructor() {
        super(...arguments);
        this.position = new Vector2d(0, 0);
    }
}
class RenderableComponent extends Component {
    constructor(positionComponent) {
        super();
        this.positionComponent = positionComponent;
    }
}
class Engine {
    constructor() {
        this.entities = [];
        this.entityNames = new Map();
        this.systems = [];
        this.updating = false;
        this.systems.push(new PlayerSystem(this));
        this.systems.push(new InputHandlingSystem(this));
        this.systems.push(new MovingSystem(this));
        this.systems.push(new RenderingSystem(this));
    }
    AddEntity(entity) {
        if (this.entityNames.has(entity.name)) {
            throw new Error("Entity with name " + entity.name + " already exists.");
        }
        this.entityNames.set(entity.name, entity);
        this.entities.push(entity);
    }
    RemoveEntity(entity) {
        var index = this.entities.indexOf(entity);
        if (index !== -1) {
            var entity = this.entities[index];
            this.entityNames.delete(entity.name);
            this.entities.splice(index, 1);
            return entity;
        }
        return null;
    }
    GetEntities(componentTypes) {
        var result = [];
        for (var i = 0; i < this.entities.length; ++i) {
            if (this.entities[i].HasComponents(componentTypes)) {
                result.push(this.entities[i]);
            }
        }
        return result;
    }
    Update(deltaTime) {
        this.updating = true;
        for (var system in this.systems) {
            this.systems[system].Update(deltaTime);
        }
        this.updating = false;
    }
}
class Entity {
    constructor(name) {
        this.components = new Map();
        if (name) {
            this._name = name;
        }
        else {
            this._name = "_entity" + (++Entity.nameCounter);
        }
    }
    get name() {
        return this._name;
    }
    AddComponent(component) {
        this.components.set(component.constructor.name, component);
        return this;
    }
    RemoveComponent(componentType) {
        if (this.components.has(componentType)) {
            var component = this.components.get(componentType);
            this.components.delete(componentType);
            return component;
        }
        return null;
    }
    GetAllComponents() {
        var result = [];
        this.components.forEach(function (c) {
            result.push(c);
        });
        return result;
    }
    GetComponent(componentType) {
        return this.components.get(componentType);
    }
    HasComponent(componentType) {
        return this.components.has(componentType);
    }
    HasComponents(componentTypes) {
        for (var i = 0; i < componentTypes.length; ++i) {
            if (!this.HasComponent(componentTypes[i])) {
                return false;
            }
        }
        return true;
    }
}
Entity.nameCounter = 0;
class System {
    constructor(engine) {
        this.priority = 0;
        this.engine = engine;
    }
}
const precision = [
    1,
    10,
    100,
    1000,
    10000,
    100000,
    1000000,
    10000000,
    100000000,
    1000000000,
    10000000000
];
class Vector2d {
    constructor(x, y) {
        this._x = 0;
        this._y = 0;
        this.x = x;
        this.y = y;
    }
    get x() {
        return this._x;
    }
    set x(newX) {
        this._x = newX;
    }
    get y() {
        return this._y;
    }
    set y(newY) {
        this._y = newY;
    }
    toString(round = false) {
        if (round) {
            return `(${Math.round(this.x)}, ${Math.round(this.y)})`;
        }
        return `(${this.x}, ${this.y})`;
    }
    toArray() {
        return [this.x, this.y];
    }
    toObject() {
        return {
            x: this.x,
            y: this.y
        };
    }
    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }
    subtract(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    }
    equals(vec) {
        return vec.x === this.x && vec.y === this.y;
    }
    multiplyByVector(vec) {
        this.x *= vec.x;
        this.y *= vec.y;
        return this;
    }
    mulV(vec) {
        return this.multiplyByVector(vec);
    }
    divideByVector(vec) {
        this.x /= vec.x;
        this.y /= vec.y;
        return this;
    }
    divV(v) {
        return this.divideByVector(v);
    }
    multiplyByScalar(n) {
        this.x *= n;
        this.y *= n;
        return this;
    }
    mulS(n) {
        return this.multiplyByScalar(n);
    }
    divideByScalar(n) {
        this.x /= n;
        this.y /= n;
        return this;
    }
    divS(n) {
        return this.divideByScalar(n);
    }
    normalise() {
        return this.divideByScalar(this.magnitude());
    }
    normalize() {
        return this.normalise();
    }
    unit() {
        return this.normalise();
    }
    magnitude() {
        const x = this.x;
        const y = this.y;
        return Math.sqrt(x * x + y * y);
    }
    length() {
        return this.magnitude();
    }
    lengthSq() {
        const x = this.x;
        const y = this.y;
        return x * x + y * y;
    }
    dot(vec) {
        return vec.x * this.x + vec.y * this.y;
    }
    cross(vec) {
        return this.x * vec.y - this.y * vec.x;
    }
    reverse() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }
    abs() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        return this;
    }
    zero() {
        this.x = this.y = 0;
        return this;
    }
    distance(v) {
        var x = this.x - v.x;
        var y = this.y - v.y;
        return Math.sqrt(x * x + y * y);
    }
    rotate(rads) {
        const cos = Math.cos(rads);
        const sin = Math.sin(rads);
        const ox = this.x;
        const oy = this.y;
        this.x = ox * cos - oy * sin;
        this.y = ox * sin + oy * cos;
        return this;
    }
    round(n = 2) {
        var p = precision[n];
        this.x = ((0.5 + this.x * p) << 0) / p;
        this.y = ((0.5 + this.y * p) << 0) / p;
        return this;
    }
    clone() {
        return new Vector2d(this.x, this.y);
    }
}
class InputHandlingSystem extends System {
    constructor(engine) {
        super(engine);
        this.requiredComponents = [InputComponent.name];
        this.HandleKeyDown = (ev) => {
            this.HandleKey(ev, true);
        };
        this.HandleKeyUp = (ev) => {
            this.HandleKey(ev, false);
        };
        document.body.addEventListener("keydown", this.HandleKeyDown);
        document.body.addEventListener("keyup", this.HandleKeyUp);
    }
    HandleKey(ev, active) {
        if (ev.repeat) {
            return;
        }
        var entities = this.engine.GetEntities(this.requiredComponents);
        for (var i = 0; i < entities.length; ++i) {
            var inputComponent = entities[i].GetComponent(InputComponent.name);
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
            }
        }
    }
    Update(deltaTime) {
        var entities = this.engine.GetEntities(this.requiredComponents);
        for (var i = 0; i < entities.length; ++i) {
        }
    }
}
class MovingSystem extends System {
    constructor() {
        super(...arguments);
        this.requiredComponents = [MoveableComponent.name];
    }
    Update(deltaTime) {
        var entities = this.engine.GetEntities(this.requiredComponents);
        for (var i = 0; i < entities.length; ++i) {
            var moveableComponent = entities[i].GetComponent(MoveableComponent.name);
            moveableComponent.positionComponent.position.add(moveableComponent.velocity.clone().multiplyByScalar(deltaTime));
        }
    }
}
class PlayerSystem extends System {
    constructor() {
        super(...arguments);
        this.requiredComponents = [PlayerComponent.name];
        this.movementSpeed = 400;
        this.fallSpeed = 800;
    }
    Update(deltaTime) {
        var entities = this.engine.GetEntities(this.requiredComponents);
        for (var i = 0; i < entities.length; ++i) {
            var playerComponent = entities[i].GetComponent(PlayerComponent.name);
            switch (playerComponent.currentState) {
                case PlayerState.Idle: {
                    this.HandleIdleState(entities[i], playerComponent);
                    break;
                }
                case PlayerState.Moving: {
                    this.HandleMovingState(entities[i], playerComponent);
                    break;
                }
                case PlayerState.Jumping: {
                    this.HandleJumpingState(entities[i], playerComponent);
                    break;
                }
                case PlayerState.Falling: {
                    this.HandleFallingState(entities[i], playerComponent);
                    break;
                }
            }
        }
    }
    IsOnGround(playerComponent) {
        return playerComponent.positionComponent.position.y >= 500;
    }
    HandleIdleState(entity, playerComponent) {
        if (playerComponent.inputComponent.moveLeftActive && !playerComponent.inputComponent.moveRightActive) {
            playerComponent.moveableComponent.velocity = new Vector2d(-this.movementSpeed, 0);
        }
        else if (playerComponent.inputComponent.moveRightActive && !playerComponent.inputComponent.moveLeftActive) {
            playerComponent.moveableComponent.velocity = new Vector2d(this.movementSpeed, 0);
        }
        else {
            playerComponent.moveableComponent.velocity = new Vector2d(0, 0);
        }
        if (!this.IsOnGround(playerComponent)) {
            playerComponent.currentState = PlayerState.Falling;
        }
    }
    HandleMovingState(entity, playerComponent) {
    }
    HandleJumpingState(entity, playerComponent) {
    }
    HandleFallingState(entity, playerComponent) {
        if (this.IsOnGround(playerComponent)) {
            playerComponent.moveableComponent.velocity.y = 0;
            playerComponent.currentState = PlayerState.Idle;
        }
        else {
            playerComponent.moveableComponent.velocity.y = ((playerComponent.moveableComponent.velocity.y * 7.0) + this.fallSpeed) / 8.0;
        }
    }
}
class RenderingSystem extends System {
    constructor() {
        super(...arguments);
        this.requiredComponents = [RenderableComponent.name];
    }
    Update(deltaTime) {
        var context = Game.Instance.context;
        context.clearRect(0, 0, 800, 600);
        var entities = this.engine.GetEntities(this.requiredComponents);
        for (var i = 0; i < entities.length; ++i) {
            var renderableComponent = entities[i].GetComponent(RenderableComponent.name);
            context.beginPath();
            context.fillStyle = '#f0f';
            context.strokeStyle = '#f0f';
            context.fillRect(renderableComponent.positionComponent.position.x, renderableComponent.positionComponent.position.y, 50, 100);
        }
    }
}
//# sourceMappingURL=all.js.map
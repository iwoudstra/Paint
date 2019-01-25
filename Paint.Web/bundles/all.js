class Game {
    constructor() {
        this.requestAnimFrame = window.requestAnimationFrame;
        this.animations = new Map();
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
    }
    static get Instance() {
        return this._instance || (this._instance = new this());
    }
    AddEntity(entity) {
        this.engine.AddEntity(entity);
    }
    InitSprites() {
        var characterspritesheet = new Image();
        characterspritesheet.src = 'assets/sprites/characterspritesheet.png';
        this.animations.set('playerwalking', new GameAnimation(characterspritesheet, 0, 361, 391, 361, 6, 'playerwalking'));
        this.animations.set('playerjumping', new GameAnimation(characterspritesheet, 0, 0, 391, 361, 3, 'playerjumping'));
        var rockplatform = new Image();
        rockplatform.src = 'assets/sprites/rockplatform.png';
        this.animations.set('rockplatform', new GameAnimation(rockplatform, 0, 0, 580, 540, 1, 'rockplatform'));
        var gamemap = new Image();
        gamemap.src = 'assets/sprites/level.png';
        this.animations.set('gamemap', new GameAnimation(gamemap, 0, 0, 3000, 1080, 1, 'gamemap'));
    }
    Init() {
        this.engine = new Engine();
        this.InitSprites();
        this.engine.AddEntity(EntityHelper.CreateGameMap(3000, 1080, this.animations.get('gamemap')));
        this.engine.AddEntity(EntityHelper.CreateSolidPlatform(0, 0, 2029, 42));
        this.engine.AddEntity(EntityHelper.CreateSolidPlatform(0, 233, 514, 332));
        this.engine.AddEntity(EntityHelper.CreateSolidPlatform(629, 921, 232, 143));
        this.engine.AddEntity(EntityHelper.CreateSolidPlatform(930, 784, 1090, 296));
        this.engine.AddEntity(EntityHelper.CreateSolidPlatform(1148, 219, 297, 323));
        this.engine.AddEntity(EntityHelper.CreateSolidPlatform(1445, 219, 610, 170));
        this.engine.AddEntity(EntityHelper.CreateSolidPlatform(2007, 234, 113, 549));
        this.engine.AddEntity(EntityHelper.CreateSolidPlatform(0, 1065, 640, 20));
        this.engine.AddEntity(EntityHelper.CreatePlatform(513, 531, 259, 16));
        this.engine.AddEntity(EntityHelper.CreatePlatform(860, 378, 289, 27));
        this.engine.AddEntity(EntityHelper.CreateCamera());
        this.engine.AddEntity(EntityHelper.CreateSpawningEntity(0, 83, 38, 77, new Vector2d(39, 115), new Vector2d(400, 0), new Vector2d(39, 115), new Vector2d(1222, 155), 10));
        this.engine.AddEntity(EntityHelper.CreateNpcEntity(1718, 608, 95, 144, 1163, 406, 857, 375, function (self) {
            var player = Game.Instance.engine.GetEntityByName("player");
            var playerComponent = player.GetComponent(PlayerComponent.name);
            playerComponent.HasBluePaint = true;
            var npcComponent = self.GetComponent(NPCComponent.name);
            npcComponent.interactable = false;
            self.RemoveComponent(TextComponent.name);
            var paintKey = playerComponent.inputComponent.paintKey === ' ' ? 'spacebar' : playerComponent.inputComponent.paintKey;
            player.AddComponent(new TopTextComponent("I am granting you your first paint, it is blue paint and you can use it to jump higher.\nPress '" + paintKey + "' to paint the ground."));
        }));
        this.engine.AddEntity(EntityHelper.CreatePlayerEntity(0, 600));
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
Game.ResolutionWidth = 1280;
Game.ResolutionHeight = 720;
Game.MapWidth = 3000;
Game.MapHeight = 1080;
class Component {
}
class CameraComponent extends Component {
    constructor(positionComponent) {
        super();
        this.horizontalTime = 0;
        this.verticalTime = 0;
        this.horizontalDirection = 0;
        this.verticalDirection = 0;
        this.positionComponent = positionComponent;
    }
}
class InputComponent extends Component {
    constructor() {
        super(...arguments);
        this.moveLeftKey = 'A';
        this.moveRightKey = 'D';
        this.jumpKey = 'W';
        this.downKey = 'S';
        this.paintKey = ' ';
        this.interactionKey = 'E';
    }
}
class MoveableComponent extends Component {
    constructor(positionComponent) {
        super();
        this.velocity = new Vector2d(0, 0);
        this.leftoverXMovement = 0;
        this.leftoverYMovement = 0;
        this.positionComponent = positionComponent;
    }
}
class NPCComponent extends Component {
    constructor(positionComponent, interactionPosition, interactionAction) {
        super();
        this.interactable = true;
        this.interacting = false;
        this.positionComponent = positionComponent;
        this.interactionPosition = interactionPosition;
        this.interactionAction = interactionAction;
    }
}
var PaintType;
(function (PaintType) {
    PaintType[PaintType["HighJump"] = 0] = "HighJump";
})(PaintType || (PaintType = {}));
class PaintComponent extends Component {
    constructor(positionComponent, renderableComponent, paintType) {
        super();
        this.positionComponent = positionComponent;
        this.paintType = paintType;
        this.renderableComponent = renderableComponent;
    }
}
class PaintPickupComponent extends Component {
    constructor(positionComponent, renderableComponent, paintType) {
        super();
        this.positionComponent = positionComponent;
        this.paintType = paintType;
        this.renderableComponent = renderableComponent;
    }
}
class PlatformComponent extends Component {
    constructor(positionComponent) {
        super();
        this.positionComponent = positionComponent;
    }
}
var PlayerState;
(function (PlayerState) {
    PlayerState[PlayerState["OnGround"] = 0] = "OnGround";
    PlayerState[PlayerState["Jumping"] = 1] = "Jumping";
    PlayerState[PlayerState["Falling"] = 2] = "Falling";
    PlayerState[PlayerState["Respawing"] = 3] = "Respawing";
})(PlayerState || (PlayerState = {}));
class PlayerComponent extends Component {
    constructor(positionComponent, moveableComponent, inputComponent, renderableComponent) {
        super();
        this.currentState = PlayerState.OnGround;
        this.positionComponent = positionComponent;
        this.moveableComponent = moveableComponent;
        this.inputComponent = inputComponent;
        this.renderableComponent = renderableComponent;
    }
}
class PositionComponent extends Component {
    constructor(x = 0, y = 0, width = 50, height = 100) {
        super();
        this.position = new Vector2d(0, 0);
        this.position.x = x;
        this.position.y = y;
        this.width = width;
        this.height = height;
    }
}
class RenderableComponent extends Component {
    constructor(positionComponent, width, height, color, gameAnimation = null) {
        super();
        this.frame = 0;
        this.frameTimer = 0;
        this.orientationLeft = false;
        this.positionComponent = positionComponent;
        this.width = width;
        this.height = height;
        this.color = color;
        this.gameAnimation = gameAnimation;
    }
}
class SolidPlatformComponent extends Component {
    constructor(positionComponent) {
        super();
        this.positionComponent = positionComponent;
    }
}
class SpawnComponent extends Component {
    constructor(positionComponent, spawnLocation, spawnVelocity, spawnMinPosition, spawnMaxPosition, spawnTime) {
        super();
        this.spawnTimer = 0;
        this.positionComponent = positionComponent;
        this.spawnLocation = spawnLocation;
        this.spawnVelocity = spawnVelocity;
        this.spawnMaxPosition = spawnMaxPosition;
        this.spawnMinPosition = spawnMinPosition;
        this.spawnTime = spawnTime;
    }
}
class SpawnedComponent extends Component {
    constructor(positionComponent, moveableComponent, minPosition, maxPosition) {
        super();
        this.positionComponent = positionComponent;
        this.moveableComponent = moveableComponent;
        this.minPosition = minPosition;
        this.maxPosition = maxPosition;
    }
}
class TextComponent extends Component {
    constructor(positionComponent, text) {
        super();
        this.positionComponent = positionComponent;
        this.text = text;
    }
}
class TopTextComponent extends Component {
    constructor(text) {
        super();
        this.text = text;
    }
}
class Engine {
    constructor() {
        this.entities = [];
        this.entityNames = new Map();
        this.systems = [];
        this.updating = false;
        this.systems.push(new MovingSystem(this));
        this.systems.push(new PlayerSystem(this));
        this.systems.push(new InputHandlingSystem(this));
        this.systems.push(new SpawningSystem(this));
        this.systems.push(new SpawnedSystem(this));
        this.systems.push(new CameraSystem(this));
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
    GetEntityByName(name) {
        return this.entityNames.get(name);
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
class EntityHelper {
    static CreatePlatform(x, y, width, height) {
        var platform = new Entity();
        var positionComponent = new PositionComponent(x, y, width, height);
        platform.AddComponent(positionComponent);
        platform.AddComponent(new PlatformComponent(positionComponent));
        return platform;
    }
    static CreateSolidPlatform(x, y, width, height) {
        var platform = new Entity();
        var positionComponent = new PositionComponent(x, y, width, height);
        platform.AddComponent(positionComponent);
        platform.AddComponent(new SolidPlatformComponent(positionComponent));
        return platform;
    }
    static CreateGameMap(width, height, gameAnimation) {
        var gamemap = new Entity();
        var positionComponent = new PositionComponent(0, 0, width, height);
        gamemap.AddComponent(positionComponent);
        gamemap.AddComponent(new RenderableComponent(positionComponent, width, height, '', gameAnimation));
        return gamemap;
    }
    static CreateCamera() {
        var camera = new Entity();
        var positionComponent = new PositionComponent();
        camera.AddComponent(positionComponent);
        camera.AddComponent(new CameraComponent(positionComponent));
        return camera;
    }
    static CreateJumpPaint(x, y) {
        var paint = new Entity();
        var positionComponent = new PositionComponent(x, y, 100, 5);
        paint.AddComponent(positionComponent);
        var renderableComponent = new RenderableComponent(positionComponent, 100, 5, '#0077ff');
        paint.AddComponent(renderableComponent);
        var paintComponent = new PaintComponent(positionComponent, renderableComponent, PaintType.HighJump);
        paint.AddComponent(paintComponent);
        return paint;
    }
    static CreatePaintPickupEntity(x, y, paintType) {
        var paintPickup = new Entity();
        var positionComponent = new PositionComponent(x, y, 50, 50);
        paintPickup.AddComponent(positionComponent);
        var renderableComponent = new RenderableComponent(positionComponent, 50, 50, '#0077ff');
        paintPickup.AddComponent(renderableComponent);
        var paintComponent = new PaintPickupComponent(positionComponent, renderableComponent, PaintType.HighJump);
        paintPickup.AddComponent(paintComponent);
        return paintPickup;
    }
    static CreatePlayerEntity(x, y) {
        var player = new Entity("player");
        var inputComponent = new InputComponent();
        player.AddComponent(inputComponent);
        var positionComponent = new PositionComponent(x, y, 130, 120);
        player.AddComponent(positionComponent);
        var moveableComponent = new MoveableComponent(positionComponent);
        player.AddComponent(moveableComponent);
        var renderableComponent = new RenderableComponent(positionComponent, 130, 120, '', Game.Instance.animations.get('playerwalking'));
        player.AddComponent(renderableComponent);
        player.AddComponent(new PlayerComponent(positionComponent, moveableComponent, inputComponent, renderableComponent));
        return player;
    }
    static CreateNpcEntity(x, y, width, height, interactionX, interactionY, interactionWidth, interactionHeight, interactionAction) {
        var npc = new Entity();
        var positionComponent = new PositionComponent(x, y, width, height);
        npc.AddComponent(positionComponent);
        var npcComponent = new NPCComponent(positionComponent, new PositionComponent(interactionX, interactionY, interactionWidth, interactionHeight), interactionAction);
        npc.AddComponent(npcComponent);
        var renderableComponent = new RenderableComponent(positionComponent, width, height, '#3389A3');
        npc.AddComponent(renderableComponent);
        return npc;
    }
    static CreateSpawnedEntity(x, y, width, height, spawnVelocity, spawnMinPosition, spawnMaxPosition) {
        var spawnedEntity = new Entity();
        var positionComponent = new PositionComponent(x, y, width, height);
        spawnedEntity.AddComponent(positionComponent);
        var moveableComponent = new MoveableComponent(positionComponent);
        moveableComponent.velocity = spawnVelocity;
        spawnedEntity.AddComponent(moveableComponent);
        var spawnedComponent = new SpawnedComponent(positionComponent, moveableComponent, spawnMinPosition, spawnMaxPosition);
        spawnedEntity.AddComponent(spawnedComponent);
        var renderableComponent = new RenderableComponent(positionComponent, width, height, '#ff00ff');
        spawnedEntity.AddComponent(renderableComponent);
        return spawnedEntity;
    }
    static CreateSpawningEntity(x, y, width, height, spawnLocation, spawnVelocity, spawnMinPosition, spawnMaxPosition, spawnTime) {
        var spawningEntity = new Entity();
        var positionComponent = new PositionComponent(x, y, width, height);
        spawningEntity.AddComponent(positionComponent);
        var spawnComponent = new SpawnComponent(positionComponent, spawnLocation, spawnVelocity, spawnMinPosition, spawnMaxPosition, spawnTime);
        spawningEntity.AddComponent(spawnComponent);
        var renderableComponent = new RenderableComponent(positionComponent, width, height, '#00ffff');
        spawningEntity.AddComponent(renderableComponent);
        return spawningEntity;
    }
}
class GameAnimation {
    constructor(imageFile, sourceX, sourceY, width, height, frames, name) {
        this.imageFile = imageFile;
        this.sourceX = sourceX;
        this.sourceY = sourceY;
        this.width = width;
        this.height = height;
        this.frames = frames;
        this.name = name;
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
class CameraSystem extends System {
    constructor() {
        super(...arguments);
        this.requiredComponents = [MoveableComponent.name];
    }
    Update(deltaTime) {
        var player = this.engine.GetEntities([PlayerComponent.name])[0].GetComponent(PlayerComponent.name);
        var camera = this.engine.GetEntities([CameraComponent.name])[0].GetComponent(CameraComponent.name);
        if (player.moveableComponent.velocity.x < 0) {
            if (camera.horizontalDirection < 0) {
                camera.horizontalTime += deltaTime;
            }
            else {
                camera.horizontalDirection = player.moveableComponent.velocity.x;
                camera.horizontalTime = deltaTime;
            }
        }
        else if (player.moveableComponent.velocity.x > 0) {
            if (camera.horizontalDirection > 0) {
                camera.horizontalTime += deltaTime;
            }
            else {
                camera.horizontalDirection = player.moveableComponent.velocity.x;
                camera.horizontalTime = deltaTime;
            }
        }
        else {
            if (camera.horizontalTime !== 0) {
                camera.horizontalTime = 0;
            }
            camera.horizontalDirection = 0;
            camera.horizontalTime += deltaTime;
        }
        if (player.moveableComponent.velocity.y < 0) {
            if (camera.verticalDirection < 0) {
                camera.verticalTime += deltaTime;
            }
            else {
                camera.verticalDirection = player.moveableComponent.velocity.y;
                camera.verticalTime = deltaTime;
            }
        }
        else if (player.moveableComponent.velocity.y > 0) {
            if (camera.verticalDirection > 0) {
                camera.verticalTime += deltaTime;
            }
            else {
                camera.verticalDirection = player.moveableComponent.velocity.y;
                camera.verticalTime = deltaTime;
            }
        }
        else {
            if (camera.verticalTime !== 0) {
                camera.verticalTime = 0;
            }
            camera.verticalDirection = 0;
            camera.verticalTime += deltaTime;
        }
        var speedFactor = 16;
        var preferredXPosition;
        if (camera.horizontalDirection < 0) {
            if (camera.horizontalTime > 0.5) {
                preferredXPosition = player.positionComponent.position.x - (Game.ResolutionWidth * 0.90);
            }
            else {
                preferredXPosition = player.positionComponent.position.x - (Game.ResolutionWidth * 0.65);
            }
        }
        else if (camera.horizontalDirection > 0) {
            if (camera.horizontalTime > 0.5) {
                preferredXPosition = player.positionComponent.position.x - (Game.ResolutionWidth * 0.10);
            }
            else {
                preferredXPosition = player.positionComponent.position.x - (Game.ResolutionWidth * 0.35);
            }
        }
        else {
            preferredXPosition = player.positionComponent.position.x - (Game.ResolutionWidth * 0.5);
        }
        if (preferredXPosition < 0) {
            preferredXPosition = 0;
        }
        if (Math.abs(camera.positionComponent.position.x - preferredXPosition) < Math.abs(player.moveableComponent.velocity.x * 2 * deltaTime)) {
            camera.positionComponent.position.x = preferredXPosition;
        }
        else {
            camera.positionComponent.position.x = (camera.positionComponent.position.x * (speedFactor - 1) + preferredXPosition) / speedFactor;
        }
        var preferredYPosition;
        if (camera.verticalDirection < 0) {
            if (camera.verticalTime > 0.5) {
                preferredYPosition = player.positionComponent.position.y - (Game.ResolutionHeight * 0.90);
            }
            else {
                preferredYPosition = player.positionComponent.position.y - (Game.ResolutionHeight * 0.65);
            }
        }
        else if (camera.verticalDirection > 0) {
            if (camera.verticalTime > 0.5) {
                preferredYPosition = player.positionComponent.position.y - (Game.ResolutionHeight * 0.10);
            }
            else {
                preferredYPosition = player.positionComponent.position.y - (Game.ResolutionHeight * 0.35);
            }
        }
        else {
            preferredYPosition = player.positionComponent.position.y - (Game.ResolutionHeight * 0.5);
        }
        if (preferredYPosition < 0) {
            preferredYPosition = 0;
        }
        if (Math.abs(camera.positionComponent.position.y - preferredYPosition) < Math.abs(player.moveableComponent.velocity.y * 2 * deltaTime)) {
            camera.positionComponent.position.y = preferredYPosition;
        }
        else {
            camera.positionComponent.position.y = (camera.positionComponent.position.y * (speedFactor - 1) + preferredYPosition) / speedFactor;
        }
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
        this.addedDebug = false;
        document.body.addEventListener("keydown", this.HandleKeyDown);
        document.body.addEventListener("keyup", this.HandleKeyUp);
    }
    AddDebug() {
        var platforms = this.engine.GetEntities([PlatformComponent.name]);
        var solidPlatforms = this.engine.GetEntities([SolidPlatformComponent.name]);
        for (var i = 0; i < platforms.length; ++i) {
            console.log('platform');
            var positionComponent = platforms[i].GetComponent(PositionComponent.name);
            platforms[i].AddComponent(new RenderableComponent(positionComponent, positionComponent.width, positionComponent.height, '#00ff00'));
        }
        for (var i = 0; i < solidPlatforms.length; ++i) {
            var positionComponent = solidPlatforms[i].GetComponent(PositionComponent.name);
            solidPlatforms[i].AddComponent(new RenderableComponent(positionComponent, positionComponent.width, positionComponent.height, '#ff0000'));
        }
    }
    RemoveDebug() {
        var platforms = this.engine.GetEntities([PlatformComponent.name]);
        var solidPlatforms = this.engine.GetEntities([SolidPlatformComponent.name]);
        for (var i = 0; i < platforms.length; ++i) {
            platforms[i].RemoveComponent(RenderableComponent.name);
        }
        for (var i = 0; i < solidPlatforms.length; ++i) {
            solidPlatforms[i].RemoveComponent(RenderableComponent.name);
        }
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
                case inputComponent.downKey: {
                    inputComponent.downActive = active;
                    break;
                }
                case inputComponent.paintKey: {
                    inputComponent.paintActive = active;
                    break;
                }
                case inputComponent.interactionKey: {
                    inputComponent.interactionActive = active;
                    break;
                }
                case ',': {
                    if (!this.addedDebug) {
                        this.addedDebug = true;
                        this.AddDebug();
                    }
                    break;
                }
                case '.': {
                    if (this.addedDebug) {
                        this.addedDebug = false;
                        this.RemoveDebug();
                    }
                    break;
                }
            }
        }
    }
    Update(deltaTime) {
        var entities = this.engine.GetEntities(this.requiredComponents);
        for (var i = 0; i < entities.length; ++i) {
            var inputComponent = entities[i].GetComponent(InputComponent.name);
            inputComponent.paintActivePrevious = inputComponent.paintActive;
            inputComponent.interactionActivePrevious = inputComponent.interactionActive;
        }
    }
}
class MovingSystem extends System {
    constructor() {
        super(...arguments);
        this.requiredComponents = [MoveableComponent.name];
    }
    static IsOnGround(engine, moveableComponent) {
        return moveableComponent.positionComponent.position.y + moveableComponent.positionComponent.height >= Game.MapHeight;
    }
    static HorizontalBounds(engine, moveableComponent, movement) {
        return moveableComponent.positionComponent.position.x + movement <= 0;
    }
    static IsOnPlatform(engine, moveableComponent, includingSolid) {
        var platforms = engine.GetEntities([PlatformComponent.name]);
        for (var i = 0; i < platforms.length; ++i) {
            var platformComponent = platforms[i].GetComponent(PlatformComponent.name);
            if ((moveableComponent.positionComponent.position.x <= platformComponent.positionComponent.position.x + platformComponent.positionComponent.width && moveableComponent.positionComponent.position.x + moveableComponent.positionComponent.width > platformComponent.positionComponent.position.x)
                && (Math.floor(moveableComponent.positionComponent.position.y + moveableComponent.positionComponent.height) === Math.floor(platformComponent.positionComponent.position.y))) {
                return true;
            }
        }
        if (includingSolid) {
            var solidPlatforms = engine.GetEntities([SolidPlatformComponent.name]);
            for (var i = 0; i < solidPlatforms.length; ++i) {
                var solidPlatformComponent = solidPlatforms[i].GetComponent(SolidPlatformComponent.name);
                if ((moveableComponent.positionComponent.position.x <= solidPlatformComponent.positionComponent.position.x + solidPlatformComponent.positionComponent.width && moveableComponent.positionComponent.position.x + moveableComponent.positionComponent.width > solidPlatformComponent.positionComponent.position.x)
                    && (Math.floor(moveableComponent.positionComponent.position.y + moveableComponent.positionComponent.height) === Math.floor(solidPlatformComponent.positionComponent.position.y))) {
                    return true;
                }
            }
        }
        return false;
    }
    static CanMoveUpwards(engine, moveableComponent) {
        var solidPlatforms = engine.GetEntities([SolidPlatformComponent.name]);
        for (var i = 0; i < solidPlatforms.length; ++i) {
            var solidPlatformComponent = solidPlatforms[i].GetComponent(SolidPlatformComponent.name);
            if ((moveableComponent.positionComponent.position.x <= solidPlatformComponent.positionComponent.position.x + solidPlatformComponent.positionComponent.width && moveableComponent.positionComponent.position.x + moveableComponent.positionComponent.width > solidPlatformComponent.positionComponent.position.x)
                && (Math.floor(moveableComponent.positionComponent.position.y) === Math.floor(solidPlatformComponent.positionComponent.position.y + solidPlatformComponent.positionComponent.height))) {
                return false;
            }
        }
        return true;
    }
    static CanMoveHorizontal(engine, moveableComponent, movement) {
        if (this.HorizontalBounds(engine, moveableComponent, movement)) {
            return false;
        }
        var solidPlatforms = engine.GetEntities([SolidPlatformComponent.name]);
        for (var i = 0; i < solidPlatforms.length; ++i) {
            var solidPlatformComponent = solidPlatforms[i].GetComponent(SolidPlatformComponent.name);
            if ((moveableComponent.positionComponent.position.y <= solidPlatformComponent.positionComponent.position.y + solidPlatformComponent.positionComponent.height && moveableComponent.positionComponent.position.y + moveableComponent.positionComponent.height > solidPlatformComponent.positionComponent.position.y)
                && ((movement < 0 && moveableComponent.positionComponent.position.x + movement === solidPlatformComponent.positionComponent.position.x + solidPlatformComponent.positionComponent.width)
                    || (movement > 0 && moveableComponent.positionComponent.position.x + moveableComponent.positionComponent.width + movement === solidPlatformComponent.positionComponent.position.x))) {
                return false;
            }
        }
        return true;
    }
    static IsOnGroundOrPlatform(engine, moveableComponent) {
        return this.IsOnPlatform(engine, moveableComponent, true) || this.IsOnGround(engine, moveableComponent);
    }
    Update(deltaTime) {
        var entities = this.engine.GetEntities(this.requiredComponents);
        for (var i = 0; i < entities.length; ++i) {
            var moveableComponent = entities[i].GetComponent(MoveableComponent.name);
            var movement = moveableComponent.velocity.clone().multiplyByScalar(deltaTime);
            if (movement.y > 0) {
                var ymovement = movement.y + moveableComponent.leftoverYMovement;
                for (var steps = 0; steps < ymovement; ++steps) {
                    if (MovingSystem.IsOnGroundOrPlatform(this.engine, moveableComponent)) {
                        moveableComponent.leftoverYMovement = 0;
                        moveableComponent.velocity.y = 0;
                    }
                    else {
                        moveableComponent.positionComponent.position.y += 1;
                    }
                }
                moveableComponent.leftoverYMovement = ymovement - Math.floor(ymovement);
            }
            else if (movement.y < 0) {
                var ymovement = movement.y + moveableComponent.leftoverYMovement;
                for (var steps = 0; steps > ymovement; --steps) {
                    if (!MovingSystem.CanMoveUpwards(this.engine, moveableComponent)) {
                        moveableComponent.leftoverYMovement = 0;
                        moveableComponent.velocity.y = 0;
                    }
                    else {
                        moveableComponent.positionComponent.position.y -= 1;
                    }
                }
                moveableComponent.leftoverYMovement = ymovement - Math.ceil(ymovement);
            }
            if (movement.x > 0) {
                var xmovement = movement.x + moveableComponent.leftoverXMovement;
                for (var steps = 0; steps < xmovement; ++steps) {
                    if (!MovingSystem.CanMoveHorizontal(this.engine, moveableComponent, 1)) {
                        moveableComponent.leftoverXMovement = 0;
                        moveableComponent.velocity.x = 0;
                    }
                    else {
                        moveableComponent.positionComponent.position.x += 1;
                    }
                }
                moveableComponent.leftoverXMovement = xmovement - Math.floor(xmovement);
            }
            else if (movement.x < 0) {
                var xmovement = movement.x + moveableComponent.leftoverXMovement;
                for (var steps = 0; steps > xmovement; --steps) {
                    if (!MovingSystem.CanMoveHorizontal(this.engine, moveableComponent, -1)) {
                        moveableComponent.leftoverXMovement = 0;
                        moveableComponent.velocity.x = 0;
                    }
                    else {
                        moveableComponent.positionComponent.position.x -= 1;
                    }
                }
                moveableComponent.leftoverXMovement = xmovement - Math.ceil(xmovement);
            }
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
                case PlayerState.OnGround: {
                    this.HandleOnGroundState(entities[i], playerComponent, deltaTime);
                    break;
                }
                case PlayerState.Jumping: {
                    this.HandleJumpingState(entities[i], playerComponent, deltaTime);
                    break;
                }
                case PlayerState.Falling: {
                    this.HandleFallingState(entities[i], playerComponent, deltaTime);
                    break;
                }
                case PlayerState.Respawing: {
                    this.HandleRespawningState(entities[i], playerComponent, deltaTime);
                    break;
                }
            }
        }
    }
    static CollisionWithPaint(engine, positionComponent, paintType) {
        var paints = engine.GetEntities([PaintComponent.name]);
        for (var i = 0; i < paints.length; ++i) {
            var paintComponent = paints[i].GetComponent(PaintComponent.name);
            if (paintComponent.paintType == paintType
                && (positionComponent.position.x <= paintComponent.positionComponent.position.x + paintComponent.positionComponent.width && positionComponent.position.x + positionComponent.width > paintComponent.positionComponent.position.x)
                && (positionComponent.position.y <= paintComponent.positionComponent.position.y + paintComponent.positionComponent.height && positionComponent.position.y + positionComponent.height > paintComponent.positionComponent.position.y)) {
                return true;
            }
        }
        return false;
    }
    static CollisionWithPickup(engine, positionComponent, playerComponent) {
        var paints = engine.GetEntities([PaintPickupComponent.name]);
        for (var i = 0; i < paints.length; ++i) {
            var paintComponent = paints[i].GetComponent(PaintPickupComponent.name);
            if ((positionComponent.position.x <= paintComponent.positionComponent.position.x + paintComponent.positionComponent.width && positionComponent.position.x + positionComponent.width > paintComponent.positionComponent.position.x)
                && (positionComponent.position.y <= paintComponent.positionComponent.position.y + paintComponent.positionComponent.height && positionComponent.position.y + positionComponent.height > paintComponent.positionComponent.position.y)) {
                playerComponent.HasBluePaint = true;
                engine.RemoveEntity(paints[i]);
                return true;
            }
        }
        return false;
    }
    static CanInteractWithNPC(engine, playerComponent) {
        var npcs = engine.GetEntities([NPCComponent.name]);
        for (var i = 0; i < npcs.length; ++i) {
            var npcComponent = npcs[i].GetComponent(NPCComponent.name);
            if ((playerComponent.positionComponent.position.x <= npcComponent.interactionPosition.position.x + npcComponent.interactionPosition.width && playerComponent.positionComponent.position.x + playerComponent.positionComponent.width > npcComponent.interactionPosition.position.x)
                && (playerComponent.positionComponent.position.y <= npcComponent.interactionPosition.position.y + npcComponent.interactionPosition.height && playerComponent.positionComponent.position.y + playerComponent.positionComponent.height > npcComponent.interactionPosition.position.y)) {
                return npcs[i];
            }
        }
        return null;
    }
    HandleMovement(playerComponent, allowJump) {
        if (playerComponent.inputComponent.moveLeftActive && !playerComponent.inputComponent.moveRightActive) {
            playerComponent.moveableComponent.velocity.x = -this.movementSpeed;
            playerComponent.renderableComponent.orientationLeft = true;
        }
        else if (playerComponent.inputComponent.moveRightActive && !playerComponent.inputComponent.moveLeftActive) {
            playerComponent.moveableComponent.velocity.x = this.movementSpeed;
            playerComponent.renderableComponent.orientationLeft = false;
        }
        else {
            playerComponent.moveableComponent.velocity.x = 0;
        }
        if (allowJump && playerComponent.inputComponent.jumpActive && MovingSystem.IsOnGroundOrPlatform(this.engine, playerComponent.moveableComponent)) {
            if (PlayerSystem.CollisionWithPaint(this.engine, playerComponent.positionComponent, PaintType.HighJump)) {
                playerComponent.moveableComponent.velocity.y = -this.movementSpeed * 3;
            }
            else {
                playerComponent.moveableComponent.velocity.y = -this.movementSpeed * 2;
            }
            playerComponent.renderableComponent.gameAnimation = Game.Instance.animations.get('playerjumping');
            playerComponent.renderableComponent.frame = 1;
            playerComponent.currentState = PlayerState.Jumping;
        }
        else if (playerComponent.inputComponent.downActive && MovingSystem.IsOnPlatform(this.engine, playerComponent.moveableComponent, false)) {
            playerComponent.positionComponent.position.y += 1;
        }
    }
    HandleOnGroundState(entity, playerComponent, deltaTime) {
        this.HandleMovement(playerComponent, true);
        PlayerSystem.CollisionWithPickup(this.engine, playerComponent.positionComponent, playerComponent);
        var npc = PlayerSystem.CanInteractWithNPC(this.engine, playerComponent);
        if (npc) {
            var npcComponent = npc.GetComponent(NPCComponent.name);
            if (npcComponent.interactable) {
                if (playerComponent.inputComponent.interactionActive && !playerComponent.inputComponent.interactionActivePrevious) {
                    npcComponent.interactionAction(npc);
                }
                else if (!npcComponent.interacting) {
                    npcComponent.interacting = true;
                    npc.AddComponent(new TextComponent(npcComponent.positionComponent, "Press '" + playerComponent.inputComponent.interactionKey + "' to interact."));
                }
            }
        }
        if (playerComponent.moveableComponent.velocity.x !== 0) {
            playerComponent.renderableComponent.frameTimer += deltaTime;
            if (playerComponent.renderableComponent.frameTimer >= 0.1) {
                playerComponent.renderableComponent.frameTimer = 0;
                playerComponent.renderableComponent.frame++;
                if (playerComponent.renderableComponent.frame >= playerComponent.renderableComponent.gameAnimation.frames) {
                    playerComponent.renderableComponent.frame = 0;
                }
            }
        }
        if (!MovingSystem.IsOnGroundOrPlatform(this.engine, playerComponent.moveableComponent)) {
            playerComponent.currentState = PlayerState.Falling;
            playerComponent.renderableComponent.gameAnimation = Game.Instance.animations.get('playerjumping');
            playerComponent.renderableComponent.frame = 2;
        }
        else if (playerComponent.inputComponent.paintActive && !playerComponent.inputComponent.paintActivePrevious && playerComponent.HasBluePaint) {
            Game.Instance.AddEntity(EntityHelper.CreateJumpPaint(playerComponent.positionComponent.position.x, playerComponent.positionComponent.position.y + playerComponent.positionComponent.height - 2));
        }
    }
    HandleJumpingState(entity, playerComponent, deltaTime) {
        this.HandleMovement(playerComponent, false);
        PlayerSystem.CollisionWithPickup(this.engine, playerComponent.positionComponent, playerComponent);
        playerComponent.moveableComponent.velocity.y += 4 * this.movementSpeed * deltaTime;
        if (playerComponent.moveableComponent.velocity.y >= 0) {
            playerComponent.currentState = PlayerState.Falling;
            playerComponent.renderableComponent.frame = 2;
        }
    }
    HandleFallingState(entity, playerComponent, deltaTime) {
        this.HandleMovement(playerComponent, false);
        PlayerSystem.CollisionWithPickup(this.engine, playerComponent.positionComponent, playerComponent);
        if (MovingSystem.IsOnGroundOrPlatform(this.engine, playerComponent.moveableComponent)) {
            playerComponent.moveableComponent.velocity.y = 0;
            playerComponent.currentState = PlayerState.OnGround;
            playerComponent.renderableComponent.gameAnimation = Game.Instance.animations.get('playerwalking');
            playerComponent.renderableComponent.frame = 0;
            playerComponent.renderableComponent.frameTimer = 0;
        }
        else {
            playerComponent.moveableComponent.velocity.y = ((playerComponent.moveableComponent.velocity.y * 7.0) + this.fallSpeed) / 8.0;
        }
    }
    HandleRespawningState(entity, playerComponent, deltaTime) {
        playerComponent.renderableComponent.frameTimer += deltaTime;
        if (playerComponent.renderableComponent.frameTimer > 1) {
            playerComponent.currentState = PlayerState.OnGround;
            playerComponent.renderableComponent.gameAnimation = Game.Instance.animations.get('playerwalking');
            playerComponent.renderableComponent.frame = 0;
            playerComponent.renderableComponent.frameTimer = 0;
        }
    }
}
class RenderingSystem extends System {
    constructor() {
        super(...arguments);
        this.requiredComponents = [RenderableComponent.name];
    }
    Update(deltaTime) {
        var camera = this.engine.GetEntities([CameraComponent.name])[0].GetComponent(CameraComponent.name);
        var context = Game.Instance.context;
        context.clearRect(0, 0, Game.ResolutionWidth, Game.ResolutionHeight);
        var entities = this.engine.GetEntities(this.requiredComponents);
        for (var i = 0; i < entities.length; ++i) {
            var renderableComponent = entities[i].GetComponent(RenderableComponent.name);
            if (renderableComponent.gameAnimation) {
                var extra = renderableComponent.orientationLeft ? renderableComponent.width : 0;
                context.translate(renderableComponent.positionComponent.position.x - camera.positionComponent.position.x + extra, renderableComponent.positionComponent.position.y - camera.positionComponent.position.y);
                if (renderableComponent.orientationLeft) {
                    context.scale(-1, 1);
                }
                context.drawImage(renderableComponent.gameAnimation.imageFile, renderableComponent.gameAnimation.sourceX + (renderableComponent.gameAnimation.width * renderableComponent.frame), renderableComponent.gameAnimation.sourceY, renderableComponent.gameAnimation.width, renderableComponent.gameAnimation.height, 0, 0, renderableComponent.width, renderableComponent.height);
                if (renderableComponent.orientationLeft) {
                    context.scale(-1, 1);
                }
                context.translate(-(renderableComponent.positionComponent.position.x - camera.positionComponent.position.x + extra), -(renderableComponent.positionComponent.position.y - camera.positionComponent.position.y));
            }
            else {
                context.beginPath();
                context.fillStyle = renderableComponent.color;
                context.strokeStyle = renderableComponent.color;
                context.fillRect(renderableComponent.positionComponent.position.x - camera.positionComponent.position.x, renderableComponent.positionComponent.position.y - camera.positionComponent.position.y, renderableComponent.width, renderableComponent.height);
            }
        }
        var texts = this.engine.GetEntities([TextComponent.name]);
        for (var i = 0; i < texts.length; ++i) {
            var text = texts[i].GetComponent(TextComponent.name);
            context.fillStyle = '#ffffff';
            context.strokeStyle = '#000000';
            context.textAlign = 'center';
            context.font = '30pt Calibri';
            context.fillText(text.text, text.positionComponent.position.x - camera.positionComponent.position.x, text.positionComponent.position.y - camera.positionComponent.position.y);
            context.strokeText(text.text, text.positionComponent.position.x - camera.positionComponent.position.x, text.positionComponent.position.y - camera.positionComponent.position.y);
            context.fill();
            context.stroke();
        }
        var texts = this.engine.GetEntities([TopTextComponent.name]);
        for (var i = 0; i < texts.length; ++i) {
            var topText = texts[i].GetComponent(TopTextComponent.name);
            context.fillStyle = '#ffffff';
            context.strokeStyle = '#000000';
            context.textAlign = 'center';
            context.textBaseline = 'top';
            context.font = '20pt Calibri';
            var splitText = topText.text.split('\n');
            for (var j = 0; j < splitText.length; ++j) {
                context.fillText(splitText[j].toUpperCase(), Game.ResolutionWidth / 2, 5 + (35 * j));
                context.strokeText(splitText[j].toUpperCase(), Game.ResolutionWidth / 2, 5 + (35 * j));
            }
            context.fill();
            context.stroke();
        }
    }
}
class SpawnedSystem extends System {
    constructor() {
        super(...arguments);
        this.requiredComponents = [SpawnedComponent.name];
    }
    CollisionWithPlayer(playerComponent, spawnedComponent) {
        if ((playerComponent.positionComponent.position.x <= spawnedComponent.positionComponent.position.x + spawnedComponent.positionComponent.width && playerComponent.positionComponent.position.x + playerComponent.positionComponent.width > spawnedComponent.positionComponent.position.x)
            && (playerComponent.positionComponent.position.y <= spawnedComponent.positionComponent.position.y + spawnedComponent.positionComponent.height && playerComponent.positionComponent.position.y + playerComponent.positionComponent.height > spawnedComponent.positionComponent.position.y)) {
            return true;
        }
        return false;
    }
    Update(deltaTime) {
        var entities = this.engine.GetEntities(this.requiredComponents);
        var player = this.engine.GetEntityByName('player');
        var playerComponent = player.GetComponent(PlayerComponent.name);
        for (var i = 0; i < entities.length; ++i) {
            var spawnComponent = entities[i].GetComponent(SpawnedComponent.name);
            if (spawnComponent.moveableComponent.positionComponent.position.x > spawnComponent.maxPosition.x || spawnComponent.moveableComponent.positionComponent.position.x < spawnComponent.minPosition.x
                || spawnComponent.moveableComponent.positionComponent.position.y > spawnComponent.maxPosition.y || spawnComponent.moveableComponent.positionComponent.position.y < spawnComponent.minPosition.y) {
                this.engine.RemoveEntity(entities[i]);
            }
            else if (this.CollisionWithPlayer(playerComponent, spawnComponent)) {
                playerComponent.currentState = PlayerState.Respawing;
                playerComponent.positionComponent.position.x = 0;
                playerComponent.positionComponent.position.y = 600;
                playerComponent.renderableComponent.gameAnimation = Game.Instance.animations.get('playerwalking');
                playerComponent.renderableComponent.frame = 0;
                playerComponent.renderableComponent.frameTimer = 0;
            }
        }
    }
}
class SpawningSystem extends System {
    constructor() {
        super(...arguments);
        this.requiredComponents = [SpawnComponent.name];
    }
    Update(deltaTime) {
        var entities = this.engine.GetEntities(this.requiredComponents);
        for (var i = 0; i < entities.length; ++i) {
            var spawnComponent = entities[i].GetComponent(SpawnComponent.name);
            spawnComponent.spawnTimer += deltaTime;
            if (spawnComponent.spawnTimer >= spawnComponent.spawnTime) {
                spawnComponent.spawnTimer = 0;
                this.engine.AddEntity(EntityHelper.CreateSpawnedEntity(spawnComponent.spawnLocation.x, spawnComponent.spawnLocation.y, 10, 10, spawnComponent.spawnVelocity, spawnComponent.spawnMinPosition, spawnComponent.spawnMaxPosition));
            }
        }
    }
}
//# sourceMappingURL=all.js.map
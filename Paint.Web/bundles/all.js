class Game {
    constructor() {
        this.requestAnimFrame = window.requestAnimationFrame;
        this.respawnPlayerX = 0;
        this.respawnPlayerY = 0;
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
    }
    static get Instance() {
        return this._instance || (this._instance = new this());
    }
    AddEntity(entity) {
        this.engine.AddEntity(entity);
    }
    Init() {
        this.engine = new Engine();
        SpriteHelper.InitSprites();
        this.ChangeLevel(Level1.Instance, 600, 600);
        this.lastTime = performance.now();
        this.Handle(this.lastTime);
    }
    ChangeLevel(level, playerX, playerY) {
        this.engine.RemoveAllEntities();
        this.currentLevel = level;
        this.currentLevel.Init(this.engine, playerX, playerY);
        this.engine.LevelChanged();
        this.respawnPlayerX = playerX;
        this.respawnPlayerY = playerY;
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
class Component {
}
class ActionComponent extends Component {
    constructor(action) {
        super();
        this.timerHelper = 0;
        this.action = action;
    }
}
class AttackableComponent extends Component {
    constructor(positionComponent, health) {
        super();
        this.positionComponent = positionComponent;
        this.health = health;
    }
}
class AttackComponent extends Component {
    constructor(positionComponent, entity, damage, isPlayer) {
        super();
        this.attackedComponents = [];
        this.positionComponent = positionComponent;
        this.entity = entity;
        this.damage = damage;
        this.isPlayer = isPlayer;
    }
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
var RenderLayer;
(function (RenderLayer) {
    RenderLayer[RenderLayer["Background"] = 0] = "Background";
    RenderLayer[RenderLayer["Player"] = 1] = "Player";
    RenderLayer[RenderLayer["ForegroundPlayer"] = 2] = "ForegroundPlayer";
    RenderLayer[RenderLayer["Foreground"] = 3] = "Foreground";
})(RenderLayer || (RenderLayer = {}));
class RenderableComponent extends Component {
    constructor(positionComponent, width, height, color, renderLayer, gameAnimation = null, renderPriority = 0) {
        super();
        this.visible = true;
        this.rotation = 0;
        this.rotationX = 0;
        this.rotationY = 0;
        this.frame = 0;
        this.frameTimer = 0;
        this.orientationLeft = false;
        this.positionComponent = positionComponent;
        this.width = width;
        this.height = height;
        this.color = color;
        this.renderLayer = renderLayer;
        this.gameAnimation = gameAnimation;
        this.renderPriority = renderPriority;
    }
}
class DebugRenderableComponent extends RenderableComponent {
    constructor(positionComponent, width, height, color, renderLayer, gameAnimation = null, renderPriority = 0) {
        super(positionComponent, width, height, color, renderLayer, gameAnimation, renderPriority);
    }
}
class EventComponent extends Component {
    constructor(positionComponent, playerX, playerY) {
        super();
        this.positionComponent = positionComponent;
        this.playerX = playerX;
        this.playerY = playerY;
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
        this.cancelInteractionKey = 'Q';
        this.attackKey = 'F';
    }
}
class LevelTriggerComponent extends Component {
    constructor(positionComponent, playerX, playerY, level) {
        super();
        this.positionComponent = positionComponent;
        this.playerX = playerX;
        this.playerY = playerY;
        this.level = level;
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
    constructor(positionComponent, interactionPosition, name, interactionAction) {
        super();
        this.interactingState = 0;
        this.interactable = true;
        this.interacting = false;
        this.positionComponent = positionComponent;
        this.interactionPosition = interactionPosition;
        this.name = name;
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
    PlayerState[PlayerState["Interacting"] = 4] = "Interacting";
    PlayerState[PlayerState["Attacking"] = 5] = "Attacking";
})(PlayerState || (PlayerState = {}));
class PlayerComponent extends Component {
    constructor(positionComponent, moveableComponent, inputComponent, renderableComponent) {
        super();
        this.currentState = PlayerState.OnGround;
        this.newState = PlayerState.OnGround;
        this.interactingWith = null;
        this.hasBluePaint = false;
        this.attackEntity = null;
        this.attackTimer = 0;
        this.attackDamage = 80;
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
class SolidPlatformComponent extends Component {
    constructor(positionComponent) {
        super();
        this.positionComponent = positionComponent;
    }
}
class SpawnComponent extends Component {
    constructor(positionComponent, spawnLocation, spawnVelocity, spawnMinPosition, spawnMaxPosition, spawnHealth, spawnTime) {
        super();
        this.spawnTimer = 0;
        this.positionComponent = positionComponent;
        this.spawnLocation = spawnLocation;
        this.spawnVelocity = spawnVelocity;
        this.spawnMaxPosition = spawnMaxPosition;
        this.spawnMinPosition = spawnMinPosition;
        this.spawnHealth = spawnHealth;
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
    constructor(text, options = []) {
        super();
        this.chosenOption = 0;
        this.text = text;
        this.options = options;
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
        this.systems.push(new ActionSystem(this));
        this.systems.push(new SpawningSystem(this));
        this.systems.push(new SpawnedSystem(this));
        this.systems.push(new TriggerSystem(this));
        this.systems.push(new AttackSystem(this));
        this.systems.push(new CameraSystem(this));
        this.systems.push(new RenderingSystem(this));
    }
    AddEntity(entity) {
        if (this.entityNames.has(entity.name)) {
            throw new Error("Entity with name " + entity.name + " already exists.");
        }
        this.entityNames.set(entity.name, entity);
        this.entities.push(entity);
        for (let system of this.systems) {
            system.EntityAdded(entity);
        }
    }
    RemoveEntity(entity) {
        var index = this.entities.indexOf(entity);
        if (index !== -1) {
            var entity = this.entities[index];
            this.entityNames.delete(entity.name);
            this.entities.splice(index, 1);
            for (let system of this.systems) {
                system.EntityRemoved(entity);
            }
            return entity;
        }
        return null;
    }
    RemoveAllEntities() {
        this.entities.splice(0, this.entities.length);
        this.entityNames.clear();
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
        for (let system of this.systems) {
            system.Update(deltaTime);
        }
        this.updating = false;
    }
    LevelChanged() {
        for (let system of this.systems) {
            system.LevelChanged();
        }
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
class Level {
    constructor(width, height, loadScreen, mapLayout) {
        this.entitiesInitialized = false;
        this.entities = [];
        this.Width = width;
        this.Height = height;
        this.LoadScreen = loadScreen;
        this.MapLayout = mapLayout;
    }
    Init(engine, playerX, playerY) {
        if (!this.entitiesInitialized) {
            this.initEntities(engine, playerX, playerY);
            this.entitiesInitialized = true;
        }
        let playerPosition = this.playerEntity.GetComponent(PositionComponent.name);
        playerPosition.position.x = playerX;
        playerPosition.position.y = playerY;
        engine.RemoveAllEntities();
        for (let entity of this.entities) {
            engine.AddEntity(entity);
        }
    }
    RemoveEntity(entity) {
        let index = this.entities.indexOf(entity);
        if (index !== -1) {
            this.entities.splice(index, 1);
        }
    }
}
class System {
    constructor(engine) {
        this.priority = 0;
        this.engine = engine;
    }
}
class EntityHelper {
    static CreatePlatform(x, y, width, height) {
        let platform = new Entity();
        let positionComponent = new PositionComponent(x, y, width, height);
        platform.AddComponent(positionComponent);
        platform.AddComponent(new PlatformComponent(positionComponent));
        return platform;
    }
    static CreateSolidPlatform(x, y, width, height) {
        let platform = new Entity();
        let positionComponent = new PositionComponent(x, y, width, height);
        platform.AddComponent(positionComponent);
        platform.AddComponent(new SolidPlatformComponent(positionComponent));
        return platform;
    }
    static CreateGameMap(width, height, gameAnimation, renderLayer) {
        let gamemap = new Entity();
        let positionComponent = new PositionComponent(0, 0, width, height);
        gamemap.AddComponent(positionComponent);
        gamemap.AddComponent(new RenderableComponent(positionComponent, width, height, '', renderLayer, gameAnimation));
        return gamemap;
    }
    static CreateCamera() {
        let camera = new Entity();
        let positionComponent = new PositionComponent();
        camera.AddComponent(positionComponent);
        camera.AddComponent(new CameraComponent(positionComponent));
        return camera;
    }
    static CreateJumpPaint(x, y) {
        let paint = new Entity();
        let positionComponent = new PositionComponent(x, y, 100, 5);
        let renderableComponent = new RenderableComponent(positionComponent, 100, 5, '#0077ff', RenderLayer.ForegroundPlayer);
        let paintComponent = new PaintComponent(positionComponent, renderableComponent, PaintType.HighJump);
        paint.AddComponent(positionComponent);
        paint.AddComponent(renderableComponent);
        paint.AddComponent(paintComponent);
        return paint;
    }
    static CreatePlayerEntity(x, y) {
        if (this.player === null) {
            this.player = new Entity("player");
            let inputComponent = new InputComponent();
            let positionComponent = new PositionComponent(x, y, 65, 130);
            let moveableComponent = new MoveableComponent(positionComponent);
            let renderableComponent = new RenderableComponent(positionComponent, 65, 130, '', RenderLayer.Player, SpriteHelper.playerWalking, 100);
            this.player.AddComponent(inputComponent);
            this.player.AddComponent(positionComponent);
            this.player.AddComponent(moveableComponent);
            this.player.AddComponent(renderableComponent);
            this.player.AddComponent(new PlayerComponent(positionComponent, moveableComponent, inputComponent, renderableComponent));
        }
        else {
            let playerPosition = this.player.GetComponent(PositionComponent.name);
            playerPosition.position.x = x;
            playerPosition.position.y = y;
        }
        return this.player;
    }
    static CreateNpcEntity(x, y, width, height, interactionX, interactionY, interactionWidth, interactionHeight, name, interactionAction) {
        let npc = new Entity();
        let positionComponent = new PositionComponent(x, y, width, height);
        let npcComponent = new NPCComponent(positionComponent, new PositionComponent(interactionX, interactionY, interactionWidth, interactionHeight), name, interactionAction);
        let renderableComponent = new RenderableComponent(positionComponent, 130, 195, '', RenderLayer.Player, SpriteHelper.npcwipAnimation);
        npc.AddComponent(positionComponent);
        npc.AddComponent(npcComponent);
        npc.AddComponent(renderableComponent);
        return npc;
    }
    static CreateAttackableObstacle(x, y, width, height, health) {
        let obstacle = new Entity();
        let positionComponent = new PositionComponent(x, y, width, height);
        let attackableComponent = new AttackableComponent(positionComponent, health);
        let renderableComponent = new RenderableComponent(positionComponent, width, height, '#33AA77', RenderLayer.ForegroundPlayer);
        let solidPlatformComponent = new SolidPlatformComponent(positionComponent);
        obstacle.AddComponent(positionComponent);
        obstacle.AddComponent(attackableComponent);
        obstacle.AddComponent(renderableComponent);
        obstacle.AddComponent(solidPlatformComponent);
        return obstacle;
    }
    static CreateSpawnedEntity(x, y, width, height, spawnVelocity, spawnMinPosition, spawnMaxPosition, health) {
        let spawnedEntity = new Entity();
        let positionComponent = new PositionComponent(x, y, width, height);
        let moveableComponent = new MoveableComponent(positionComponent);
        let spawnedComponent = new SpawnedComponent(positionComponent, moveableComponent, spawnMinPosition, spawnMaxPosition);
        let renderableComponent = new RenderableComponent(positionComponent, width, height, '#ff00ff', RenderLayer.Player);
        let attackableComponent = new AttackableComponent(positionComponent, health);
        spawnedEntity.AddComponent(positionComponent);
        moveableComponent.velocity = spawnVelocity;
        spawnedEntity.AddComponent(moveableComponent);
        spawnedEntity.AddComponent(spawnedComponent);
        spawnedEntity.AddComponent(renderableComponent);
        spawnedEntity.AddComponent(attackableComponent);
        return spawnedEntity;
    }
    static CreateSpawningEntity(x, y, width, height, spawnLocation, spawnVelocity, spawnMinPosition, spawnMaxPosition, spawnHealth, spawnTime) {
        let spawningEntity = new Entity();
        let positionComponent = new PositionComponent(x, y, width, height);
        let spawnComponent = new SpawnComponent(positionComponent, spawnLocation, spawnVelocity, spawnMinPosition, spawnMaxPosition, spawnHealth, spawnTime);
        let renderableComponent = new RenderableComponent(positionComponent, width, height, '#00ffff', RenderLayer.Player);
        spawningEntity.AddComponent(positionComponent);
        spawningEntity.AddComponent(spawnComponent);
        spawningEntity.AddComponent(renderableComponent);
        return spawningEntity;
    }
    static CreateLevelTriggerEntity(x, y, width, height, newLevel, playerX, playerY) {
        let levelTrigger = new Entity();
        let positionComponent = new PositionComponent(x, y, width, height);
        let levelTriggerComponent = new LevelTriggerComponent(positionComponent, playerX, playerY, newLevel);
        levelTrigger.AddComponent(positionComponent);
        levelTrigger.AddComponent(levelTriggerComponent);
        return levelTrigger;
    }
    static CreateEventEntity(x, y, width, height, playerX, playerY) {
        let levelEvent = new Entity();
        let positionComponent = new PositionComponent(x, y, width, height);
        let levelEventComponent = new EventComponent(positionComponent, playerX, playerY);
        levelEvent.AddComponent(positionComponent);
        levelEvent.AddComponent(levelEventComponent);
        return levelEvent;
    }
}
EntityHelper.Player = 'player';
EntityHelper.Camera = 'camera';
EntityHelper.TopText = 'toptext';
EntityHelper.player = null;
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
class SpriteHelper {
    static InitSprites() {
        this.avatar.src = 'assets/sprites/npc/avatar.png';
        this.characterSpriteSheet.src = 'assets/sprites/player/characterspritesheet.png';
        this.playerSpriteSheet.src = 'assets/sprites/player/player.png';
        this.npcwip.src = 'assets/sprites/npc/npc.png';
        this.level1.src = 'assets/sprites/level-1/level.png';
        this.level1fg.src = 'assets/sprites/level-1/level-1-fg.png';
        this.level1f.src = 'assets/sprites/level-1/level-1-f.png';
        this.level1bg.src = 'assets/sprites/level-1/level-1-bg.png';
        this.level2.src = 'assets/sprites/level-2/level-2.png';
        this.level3.src = 'assets/sprites/level-3/level-3.png';
        this.level3bg.src = 'assets/sprites/level-3/level-3-bg.png';
        this.playerWalking = new GameAnimation(this.playerSpriteSheet, 0, 0, 130, 260, 19, 'playerwalking');
        this.playerJumping = new GameAnimation(this.playerSpriteSheet, 0, 520, 130, 260, 2, 'playerjumping');
        this.playerIdle = new GameAnimation(this.playerSpriteSheet, 0, 260, 130, 260, 20, 'playeridle');
        this.playerAttack = new GameAnimation(this.playerSpriteSheet, 0, 780, 216, 260, 15, 'playerattacking');
        this.npcwipAnimation = new GameAnimation(this.npcwip, 0, 0, 130, 160, 1, 'npcwip');
        this.npcavatar = new GameAnimation(this.avatar, 0, 0, 150, 150, 1, 'npcavatar');
        this.level1Animation = new GameAnimation(this.level1, 0, 0, 2635, 845, 1, 'gamemap');
        this.level1fAnimation = new GameAnimation(this.level1f, 0, 0, 1917, 1147, 1, 'gamemap');
        this.level1fgAnimation = new GameAnimation(this.level1fg, 0, 0, 1917, 1147, 1, 'gamemap');
        this.level1bgAnimation = new GameAnimation(this.level1bg, 0, 0, 1917, 1147, 1, 'gamemap');
        this.level2Animation = new GameAnimation(this.level2, 0, 0, 2495, 1920, 1, 'gamemap');
        this.level3Animation = new GameAnimation(this.level3, 0, 0, 2950, 1855, 1, 'gamemap');
        this.level3bgAnimation = new GameAnimation(this.level3bg, 0, 0, 2950, 1855, 1, 'gamemap');
    }
}
SpriteHelper.characterSpriteSheet = new Image();
SpriteHelper.playerSpriteSheet = new Image();
SpriteHelper.rockPlatform = new Image();
SpriteHelper.level1 = new Image();
SpriteHelper.level1fg = new Image();
SpriteHelper.level1f = new Image();
SpriteHelper.level1bg = new Image();
SpriteHelper.level2 = new Image();
SpriteHelper.level3 = new Image();
SpriteHelper.level3bg = new Image();
SpriteHelper.npcwip = new Image();
SpriteHelper.avatar = new Image();
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
class Level1 extends Level {
    constructor() {
        super(2635, 845, SpriteHelper.level1Animation, SpriteHelper.level1Animation);
    }
    static get Instance() {
        if (this.instance === null) {
            this.instance = new Level1();
        }
        return this.instance;
    }
    initEntities(engine, playerX, playerY) {
        this.entities.push(EntityHelper.CreateGameMap(this.Width, this.Height, this.MapLayout, RenderLayer.Player));
        this.entities.push(EntityHelper.CreateSolidPlatform(130, 810, 2080, 35));
        this.entities.push(EntityHelper.CreateSolidPlatform(2205, 715, 70, 130));
        this.entities.push(EntityHelper.CreateSolidPlatform(2275, 650, 390, 195));
        this.entities.push(EntityHelper.CreateSolidPlatform(0, 550, 155, 350));
        this.entities.push(EntityHelper.CreateSolidPlatform(2636, 0, 1, 800));
        this.entities.push(EntityHelper.CreateCamera());
        let levelEntities = this.entities;
        var npc = EntityHelper.CreateNpcEntity(2370, 450, 65, 75, 2200, 450, 857, 375, 'John', function (self, option, initialInteraction) {
            if (!self.interactable) {
                return;
            }
            var player = engine.GetEntityByName("player");
            if (!initialInteraction) {
                ++self.interactingState;
            }
            switch (self.interactingState) {
                case 0: {
                    player.RemoveComponent(TopTextComponent.name);
                    player.AddComponent(new TopTextComponent("You! Follow. My people. Help need. I see where your broom go.", ['Show me the way strange man', 'My mother told me not to talk to strangers']));
                    return false;
                }
                case 1: {
                    player.RemoveComponent(TopTextComponent.name);
                    player.AddComponent(new TopTextComponent("Let's go. You follow. Me lead."));
                    var playerComponent = player.GetComponent(PlayerComponent.name);
                    playerComponent.hasBluePaint = true;
                    let levelTrigger = EntityHelper.CreateLevelTriggerEntity(2560, 0, 1, 700, Level2.Instance, 250, 300);
                    levelEntities.push(levelTrigger);
                    engine.AddEntity(levelTrigger);
                    var npcMoveableComponent = new MoveableComponent(self.positionComponent);
                    npcMoveableComponent.velocity = new Vector2d(200, 0);
                    npc.AddComponent(npcMoveableComponent);
                    self.interactingState = 2;
                    return false;
                }
                case 2:
                case 3: {
                    self.interactingState = 2;
                    if (!initialInteraction) {
                        return true;
                    }
                    player.RemoveComponent(TopTextComponent.name);
                    player.AddComponent(new TopTextComponent("Hurry up! My people cannot wait much longer!"));
                    return true;
                }
            }
        });
        this.entities.push(npc);
        this.entities.push(EntityHelper.CreateEventEntity(300, 500, 200, 200, 250, 300));
        this.entities.push(EntityHelper.CreateAttackableObstacle(1600, 0, 10, 900, 130));
        this.playerEntity = EntityHelper.CreatePlayerEntity(playerX, playerY);
        this.entities.push(this.playerEntity);
    }
}
Level1.instance = null;
class Level2 extends Level {
    constructor() {
        super(2495, 1920, SpriteHelper.level2Animation, SpriteHelper.level2Animation);
    }
    static get Instance() {
        if (this.instance === null) {
            this.instance = new Level2();
        }
        return this.instance;
    }
    initEntities(engine, playerX, playerY) {
        this.entities.push(EntityHelper.CreateGameMap(this.Width, this.Height, this.MapLayout, RenderLayer.Player));
        this.entities.push(EntityHelper.CreateSolidPlatform(0, 450, 320, 255));
        this.entities.push(EntityHelper.CreateSolidPlatform(320, 700, 255, 50));
        this.entities.push(EntityHelper.CreateSolidPlatform(575, 575, 385, 700));
        this.entities.push(EntityHelper.CreateSolidPlatform(1730, 575, 780, 715));
        this.entities.push(EntityHelper.CreateSolidPlatform(1790, 1280, 130, 195));
        this.entities.push(EntityHelper.CreateSolidPlatform(1920, 1470, 130, 195));
        this.entities.push(EntityHelper.CreatePlatform(960, 705, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(960, 830, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(960, 955, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(960, 1080, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(960, 1205, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(960, 1405, 130, 15));
        this.entities.push(EntityHelper.CreateSolidPlatform(960, 1600, 195, 195));
        this.entities.push(EntityHelper.CreateSolidPlatform(1280, 1665, 320, 130));
        this.entities.push(EntityHelper.CreateSolidPlatform(640, 1470, 260, 130));
        this.entities.push(EntityHelper.CreateSolidPlatform(380, 1275, 130, 520));
        this.entities.push(EntityHelper.CreateSolidPlatform(1790, 1665, 320, 130));
        this.entities.push(EntityHelper.CreateSolidPlatform(510, 1790, 1300, 130));
        this.entities.push(EntityHelper.CreateCamera());
        this.entities.push(EntityHelper.CreateLevelTriggerEntity(700, 1345, 130, 130, Level3.Instance, 2360, 255));
        this.entities.push(EntityHelper.CreateLevelTriggerEntity(2, 225, 2, 195, Level1.Instance, 2400, 500));
        this.entities.push(EntityHelper.CreateSpawningEntity(1672, 598, 45, 60, new Vector2d(1672, 628), new Vector2d(-100, 0), new Vector2d(966, 628), new Vector2d(1673, 628), 50, 5));
        this.entities.push(EntityHelper.CreateSpawningEntity(1672, 740, 45, 60, new Vector2d(1672, 770), new Vector2d(-200, 0), new Vector2d(966, 770), new Vector2d(1673, 770), 50, 5));
        this.entities.push(EntityHelper.CreateSpawningEntity(1672, 882, 45, 60, new Vector2d(1672, 912), new Vector2d(-400, 0), new Vector2d(966, 912), new Vector2d(1673, 912), 50, 5));
        this.entities.push(EntityHelper.CreateSpawningEntity(1672, 1024, 45, 60, new Vector2d(1672, 1054), new Vector2d(-800, 0), new Vector2d(966, 1054), new Vector2d(1673, 1054), 50, 5));
        this.playerEntity = EntityHelper.CreatePlayerEntity(playerX, playerY);
        this.entities.push(this.playerEntity);
    }
}
Level2.instance = null;
class Level3 extends Level {
    constructor() {
        super(2950, 1855, SpriteHelper.level3Animation, SpriteHelper.level3Animation);
    }
    static get Instance() {
        if (this.instance === null) {
            this.instance = new Level3();
        }
        return this.instance;
    }
    initEntities(engine, playerX, playerY) {
        this.entities.push(EntityHelper.CreateGameMap(this.Width, this.Height, this.MapLayout, RenderLayer.Player));
        this.entities.push(EntityHelper.CreateGameMap(SpriteHelper.level3bgAnimation.width, SpriteHelper.level3bgAnimation.height, SpriteHelper.level3bgAnimation, RenderLayer.Background));
        this.entities.push(EntityHelper.CreateSolidPlatform(0, 0, 65, 260));
        this.entities.push(EntityHelper.CreateSolidPlatform(0, 250, 390, 1105));
        this.entities.push(EntityHelper.CreateSolidPlatform(635, 250, 1495, 455));
        this.entities.push(EntityHelper.CreateSolidPlatform(635, 700, 910, 65));
        this.entities.push(EntityHelper.CreateSolidPlatform(380, 1340, 715, 65));
        this.entities.push(EntityHelper.CreateSolidPlatform(1090, 1099, 195, 520));
        this.entities.push(EntityHelper.CreateSolidPlatform(2365, 510, 585, 195));
        this.entities.push(EntityHelper.CreateSolidPlatform(2880, 0, 65, 520));
        this.entities.push(EntityHelper.CreateSolidPlatform(2880, 0, 65, 520));
        this.entities.push(EntityHelper.CreateSolidPlatform(1535, 765, 195, 650));
        this.entities.push(EntityHelper.CreateSolidPlatform(1920, 700, 65, 325));
        this.entities.push(EntityHelper.CreateSolidPlatform(1725, 1020, 780, 325));
        this.entities.push(EntityHelper.CreateSolidPlatform(2750, 700, 195, 1105));
        this.entities.push(EntityHelper.CreateSolidPlatform(2045, 1790, 715, 65));
        this.entities.push(EntityHelper.CreateSolidPlatform(2430, 1665, 130, 130));
        this.entities.push(EntityHelper.CreateSolidPlatform(1280, 1600, 780, 195));
        this.entities.push(EntityHelper.CreateSolidPlatform(640, 1280, 195, 65));
        this.entities.push(EntityHelper.CreatePlatform(2240, 640, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(2115, 865, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(2620, 1215, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(2495, 1405, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(2625, 1585, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(2175, 1660, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(1280, 1405, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(1405, 1215, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(1405, 1215, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(1405, 1215, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(1405, 1215, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(380, 1150, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(380, 955, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(380, 570, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(510, 745, 130, 15));
        this.entities.push(EntityHelper.CreatePlatform(510, 380, 130, 15));
        this.entities.push(EntityHelper.CreateCamera());
        this.entities.push(EntityHelper.CreateLevelTriggerEntity(2625, 380, 130, 130, Level2.Instance, 980, 1470));
        this.playerEntity = EntityHelper.CreatePlayerEntity(playerX, playerY);
        this.entities.push(this.playerEntity);
    }
}
Level3.instance = null;
class ActionSystem extends System {
    constructor() {
        super(...arguments);
        this.requiredComponents = [ActionComponent.name];
    }
    Update(deltaTime) {
        var actions = this.engine.GetEntities(this.requiredComponents);
        for (var i = 0; i < actions.length; ++i) {
            var actionComponent = actions[i].GetComponent(ActionComponent.name);
            actionComponent.action(deltaTime, actions[i], actionComponent);
        }
    }
    LevelChanged() {
    }
    EntityAdded(entity) {
    }
    EntityRemoved(entity) {
    }
}
class AttackSystem extends System {
    Update(deltaTime) {
        var attacks = this.engine.GetEntities([AttackComponent.name]);
        var attackables = this.engine.GetEntities([AttackableComponent.name]);
        for (let attack of attacks) {
            for (let attackable of attackables) {
                let attackComponent = attack.GetComponent(AttackComponent.name);
                let attackableComponent = attackable.GetComponent(AttackableComponent.name);
                if (attackComponent.attackedComponents.indexOf(attackableComponent) !== -1) {
                    continue;
                }
                let attackPosition = attackComponent.positionComponent;
                let attackablePosition = attackableComponent.positionComponent;
                if ((attackPosition.position.x <= attackablePosition.position.x + attackablePosition.width && attackPosition.position.x + attackPosition.width > attackablePosition.position.x)
                    && (attackPosition.position.y <= attackablePosition.position.y + attackablePosition.height && attackPosition.position.y + attackPosition.height > attackablePosition.position.y)) {
                    attackableComponent.health -= attackComponent.damage;
                    attackComponent.attackedComponents.push(attackableComponent);
                    if (attackableComponent.health <= 0) {
                        Game.Instance.currentLevel.RemoveEntity(attackable);
                        this.engine.RemoveEntity(attackable);
                    }
                }
            }
        }
    }
    LevelChanged() {
    }
    EntityAdded(entity) {
    }
    EntityRemoved(entity) {
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
        else if (preferredXPosition > Game.Instance.currentLevel.Width - Game.ResolutionWidth) {
            preferredXPosition = Game.Instance.currentLevel.Width - Game.ResolutionWidth;
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
        else if (preferredYPosition > Game.Instance.currentLevel.Height - Game.ResolutionHeight) {
            preferredYPosition = Game.Instance.currentLevel.Height - Game.ResolutionHeight;
        }
        if (Math.abs(camera.positionComponent.position.y - preferredYPosition) < Math.abs(player.moveableComponent.velocity.y * 2 * deltaTime)) {
            camera.positionComponent.position.y = preferredYPosition;
        }
        else {
            camera.positionComponent.position.y = (camera.positionComponent.position.y * (speedFactor - 1) + preferredYPosition) / speedFactor;
        }
    }
    LevelChanged() {
    }
    EntityAdded(entity) {
    }
    EntityRemoved(entity) {
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
    AddDebug() {
        let platforms = this.engine.GetEntities([PlatformComponent.name]);
        let solidPlatforms = this.engine.GetEntities([SolidPlatformComponent.name]);
        let triggers = this.engine.GetEntities([LevelTriggerComponent.name]);
        let events = this.engine.GetEntities([EventComponent.name]);
        let attacks = this.engine.GetEntities([AttackComponent.name]);
        let attackables = this.engine.GetEntities([AttackableComponent.name]);
        for (let i = 0; i < platforms.length; ++i) {
            let positionComponent = platforms[i].GetComponent(PositionComponent.name);
            if (!platforms[i].HasComponent(DebugRenderableComponent.name)) {
                platforms[i].AddComponent(new DebugRenderableComponent(positionComponent, positionComponent.width, positionComponent.height, '#00ff00', RenderLayer.ForegroundPlayer));
            }
        }
        for (let i = 0; i < solidPlatforms.length; ++i) {
            let positionComponent = solidPlatforms[i].GetComponent(PositionComponent.name);
            if (!solidPlatforms[i].HasComponent(DebugRenderableComponent.name)) {
                solidPlatforms[i].AddComponent(new DebugRenderableComponent(positionComponent, positionComponent.width, positionComponent.height, '#ff0000', RenderLayer.ForegroundPlayer));
            }
        }
        for (let i = 0; i < triggers.length; ++i) {
            let positionComponent = triggers[i].GetComponent(PositionComponent.name);
            if (!triggers[i].HasComponent(DebugRenderableComponent.name)) {
                triggers[i].AddComponent(new DebugRenderableComponent(positionComponent, positionComponent.width, positionComponent.height, '#ffff00', RenderLayer.ForegroundPlayer));
            }
        }
        for (let i = 0; i < events.length; ++i) {
            let positionComponent = events[i].GetComponent(PositionComponent.name);
            if (!events[i].HasComponent(DebugRenderableComponent.name)) {
                events[i].AddComponent(new DebugRenderableComponent(positionComponent, positionComponent.width, positionComponent.height, '#ee92f4', RenderLayer.ForegroundPlayer));
            }
        }
        for (let attack of attacks) {
            let positionComponent = attack.GetComponent(PositionComponent.name);
            if (!attack.HasComponent(DebugRenderableComponent.name)) {
                attack.AddComponent(new DebugRenderableComponent(positionComponent, positionComponent.width, positionComponent.height, '#00ffff', RenderLayer.ForegroundPlayer));
            }
        }
        for (let attackable of attackables) {
            let positionComponent = attackable.GetComponent(PositionComponent.name);
            if (!attackable.HasComponent(DebugRenderableComponent.name)) {
                attackable.AddComponent(new DebugRenderableComponent(positionComponent, positionComponent.width, positionComponent.height, '#33AA77', RenderLayer.ForegroundPlayer));
            }
        }
    }
    RemoveDebug() {
        let platforms = this.engine.GetEntities([PlatformComponent.name]);
        let solidPlatforms = this.engine.GetEntities([SolidPlatformComponent.name]);
        let triggers = this.engine.GetEntities([LevelTriggerComponent.name]);
        let events = this.engine.GetEntities([EventComponent.name]);
        let attacks = this.engine.GetEntities([AttackComponent.name]);
        let attackables = this.engine.GetEntities([AttackableComponent.name]);
        for (let i = 0; i < platforms.length; ++i) {
            platforms[i].RemoveComponent(DebugRenderableComponent.name);
        }
        for (let i = 0; i < solidPlatforms.length; ++i) {
            solidPlatforms[i].RemoveComponent(DebugRenderableComponent.name);
        }
        for (let i = 0; i < triggers.length; ++i) {
            triggers[i].RemoveComponent(DebugRenderableComponent.name);
        }
        for (let i = 0; i < events.length; ++i) {
            events[i].RemoveComponent(DebugRenderableComponent.name);
        }
        for (let attack of attacks) {
            attack.RemoveComponent(DebugRenderableComponent.name);
        }
        for (let attackable of attackables) {
            attackable.RemoveComponent(DebugRenderableComponent.name);
        }
    }
    HandleKey(ev, active) {
        if (ev.repeat) {
            return;
        }
        let entities = this.engine.GetEntities(this.requiredComponents);
        for (let i = 0; i < entities.length; ++i) {
            let inputComponent = entities[i].GetComponent(InputComponent.name);
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
                case inputComponent.cancelInteractionKey: {
                    inputComponent.cancelInteractionActive = active;
                    break;
                }
                case inputComponent.attackKey: {
                    inputComponent.attackActive = active;
                    break;
                }
                case ',': {
                    if (!InputHandlingSystem.addedDebug) {
                        InputHandlingSystem.addedDebug = true;
                        this.AddDebug();
                    }
                    break;
                }
                case '.': {
                    if (InputHandlingSystem.addedDebug) {
                        InputHandlingSystem.addedDebug = false;
                        this.RemoveDebug();
                    }
                    break;
                }
            }
        }
    }
    Update(deltaTime) {
        let entities = this.engine.GetEntities(this.requiredComponents);
        for (let i = 0; i < entities.length; ++i) {
            let inputComponent = entities[i].GetComponent(InputComponent.name);
            inputComponent.paintActivePrevious = inputComponent.paintActive;
            inputComponent.interactionActivePrevious = inputComponent.interactionActive;
            inputComponent.jumpActivePrevious = inputComponent.jumpActive;
            inputComponent.downActivePrevious = inputComponent.downActive;
            inputComponent.attackActivePrevious = inputComponent.attackActive;
        }
    }
    LevelChanged() {
        if (InputHandlingSystem.addedDebug) {
            this.AddDebug();
        }
        else {
            this.RemoveDebug();
        }
    }
    EntityAdded(entity) {
        if (InputHandlingSystem.addedDebug) {
            this.AddDebug();
        }
    }
    EntityRemoved(entity) {
    }
}
InputHandlingSystem.addedDebug = false;
class MovingSystem extends System {
    constructor() {
        super(...arguments);
        this.requiredComponents = [MoveableComponent.name];
    }
    static IsOnGround(engine, moveableComponent) {
        return moveableComponent.positionComponent.position.y + moveableComponent.positionComponent.height >= Game.Instance.currentLevel.Height;
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
    LevelChanged() {
    }
    EntityAdded(entity) {
    }
    EntityRemoved(entity) {
    }
}
class PlayerSystem extends System {
    constructor() {
        super(...arguments);
        this.requiredComponents = [PlayerComponent.name];
        this.movementSpeed = 400;
        this.fallSpeed = 800;
        this.attackPreTime = 0.25;
        this.attackTime = 0.65;
        this.attackPostTime = 0.75;
    }
    ChangeState(entity, playerComponent) {
        switch (playerComponent.currentState) {
            case PlayerState.OnGround: {
                if (playerComponent.newState !== PlayerState.Interacting) {
                    entity.RemoveComponent(TopTextComponent.name);
                }
                break;
            }
            case PlayerState.Attacking: {
                playerComponent.attackTimer = 0;
                playerComponent.renderableComponent.width = 65;
                break;
            }
            default: {
                break;
            }
        }
        switch (playerComponent.newState) {
            case PlayerState.OnGround: {
                playerComponent.moveableComponent.velocity.y = 0;
                playerComponent.renderableComponent.gameAnimation = SpriteHelper.playerWalking;
                playerComponent.renderableComponent.frame = 0;
                playerComponent.renderableComponent.frameTimer = 0;
                entity.RemoveComponent(TopTextComponent.name);
                break;
            }
            case PlayerState.Jumping: {
                playerComponent.renderableComponent.gameAnimation = SpriteHelper.playerJumping;
                playerComponent.renderableComponent.frame = 0;
                break;
            }
            case PlayerState.Falling: {
                playerComponent.renderableComponent.gameAnimation = SpriteHelper.playerJumping;
                playerComponent.renderableComponent.frame = 1;
                break;
            }
            case PlayerState.Respawing: {
                playerComponent.positionComponent.position.x = Game.Instance.respawnPlayerX;
                playerComponent.positionComponent.position.y = Game.Instance.respawnPlayerY;
                playerComponent.moveableComponent.velocity.x = 0;
                playerComponent.moveableComponent.velocity.y = 0;
                playerComponent.renderableComponent.gameAnimation = SpriteHelper.playerWalking;
                playerComponent.renderableComponent.frame = 0;
                playerComponent.renderableComponent.frameTimer = 0;
                break;
            }
            case PlayerState.Interacting: {
                break;
            }
            case PlayerState.Attacking: {
                playerComponent.renderableComponent.gameAnimation = SpriteHelper.playerAttack;
                playerComponent.renderableComponent.width = 108;
                playerComponent.renderableComponent.frame = 0;
                playerComponent.renderableComponent.frameTimer = 0;
                break;
            }
        }
        playerComponent.currentState = playerComponent.newState;
    }
    Update(deltaTime) {
        var entities = this.engine.GetEntities(this.requiredComponents);
        for (var i = 0; i < entities.length; ++i) {
            var playerComponent = entities[i].GetComponent(PlayerComponent.name);
            if (playerComponent.currentState != playerComponent.newState) {
                this.ChangeState(entities[i], playerComponent);
            }
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
                case PlayerState.Interacting: {
                    this.HandleInteractingState(entities[i], playerComponent, deltaTime);
                    break;
                }
                case PlayerState.Attacking: {
                    this.HandleAttackingState(entities[i], playerComponent, deltaTime);
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
    HandleMovement(playerComponent, allowJump, setJumpState) {
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
            this.Jump(playerComponent);
            if (setJumpState) {
                playerComponent.newState = PlayerState.Jumping;
            }
        }
        else if (playerComponent.inputComponent.downActive && MovingSystem.IsOnPlatform(this.engine, playerComponent.moveableComponent, false)) {
            playerComponent.positionComponent.position.y += 1;
        }
    }
    Jump(playerComponent) {
        if (PlayerSystem.CollisionWithPaint(this.engine, playerComponent.positionComponent, PaintType.HighJump)) {
            playerComponent.moveableComponent.velocity.y = -this.movementSpeed * 3;
        }
        else {
            playerComponent.moveableComponent.velocity.y = -this.movementSpeed * 2;
        }
    }
    CheckAttack(entity, playerComponent) {
        if (playerComponent.inputComponent.attackActive && playerComponent.currentState != PlayerState.Attacking) {
            playerComponent.newState = PlayerState.Attacking;
        }
    }
    HandleOnGroundState(entity, playerComponent, deltaTime) {
        this.HandleMovement(playerComponent, true, true);
        var npc = PlayerSystem.CanInteractWithNPC(this.engine, playerComponent);
        if (npc) {
            var npcComponent = npc.GetComponent(NPCComponent.name);
            if (npcComponent.interactable) {
                if (playerComponent.inputComponent.interactionActive && !playerComponent.inputComponent.interactionActivePrevious) {
                    playerComponent.interactingWith = npcComponent;
                    playerComponent.newState = PlayerState.Interacting;
                    npcComponent.interactionAction(npcComponent, 0, true);
                }
                else if (playerComponent.interactingWith === null) {
                    playerComponent.interactingWith = npcComponent;
                    entity.AddComponent(new TopTextComponent("Press '" + playerComponent.inputComponent.interactionKey + "' to interact."));
                }
                else if (!entity.HasComponent(TopTextComponent.name)) {
                    entity.AddComponent(new TopTextComponent("Press '" + playerComponent.inputComponent.interactionKey + "' to interact."));
                }
            }
        }
        if ((npc === null && playerComponent.interactingWith !== null) || (npc !== null && npc.GetComponent(NPCComponent.name) !== playerComponent.interactingWith)) {
            entity.RemoveComponent(TopTextComponent.name);
            playerComponent.interactingWith = null;
        }
        if (playerComponent.moveableComponent.velocity.x !== 0) {
            playerComponent.renderableComponent.frameTimer += deltaTime;
            playerComponent.renderableComponent.gameAnimation = SpriteHelper.playerWalking;
            if (playerComponent.renderableComponent.frameTimer >= 0.024) {
                playerComponent.renderableComponent.frameTimer = 0;
                playerComponent.renderableComponent.frame++;
                if (playerComponent.renderableComponent.frame >= playerComponent.renderableComponent.gameAnimation.frames) {
                    playerComponent.renderableComponent.frame = 0;
                }
            }
        }
        if ((playerComponent.moveableComponent.velocity.x <= 0) && (playerComponent.moveableComponent.velocity.x >= 0)) {
            playerComponent.renderableComponent.gameAnimation = SpriteHelper.playerIdle;
            playerComponent.renderableComponent.frameTimer += deltaTime;
            if (playerComponent.renderableComponent.frameTimer >= 0.060) {
                playerComponent.renderableComponent.frameTimer = 0;
                playerComponent.renderableComponent.frame++;
                if (playerComponent.renderableComponent.frame >= playerComponent.renderableComponent.gameAnimation.frames) {
                    playerComponent.renderableComponent.frame = 0;
                }
            }
        }
        if (!MovingSystem.IsOnGroundOrPlatform(this.engine, playerComponent.moveableComponent)) {
            playerComponent.newState = PlayerState.Falling;
        }
        else if (playerComponent.inputComponent.paintActive && !playerComponent.inputComponent.paintActivePrevious && playerComponent.hasBluePaint) {
            Game.Instance.AddEntity(EntityHelper.CreateJumpPaint(playerComponent.positionComponent.position.x, playerComponent.positionComponent.position.y + playerComponent.positionComponent.height - 2));
        }
        this.CheckAttack(entity, playerComponent);
    }
    HandleJumpingState(entity, playerComponent, deltaTime) {
        this.HandleMovement(playerComponent, false, false);
        playerComponent.moveableComponent.velocity.y += 4 * this.movementSpeed * deltaTime;
        if (playerComponent.moveableComponent.velocity.y >= 0) {
            playerComponent.newState = PlayerState.Falling;
        }
        this.CheckAttack(entity, playerComponent);
    }
    HandleFallingState(entity, playerComponent, deltaTime) {
        this.HandleMovement(playerComponent, false, false);
        if (MovingSystem.IsOnGroundOrPlatform(this.engine, playerComponent.moveableComponent)) {
            playerComponent.newState = PlayerState.OnGround;
        }
        else {
            playerComponent.moveableComponent.velocity.y = ((playerComponent.moveableComponent.velocity.y * 7.0) + this.fallSpeed) / 8.0;
        }
        this.CheckAttack(entity, playerComponent);
    }
    HandleRespawningState(entity, playerComponent, deltaTime) {
        playerComponent.renderableComponent.frameTimer += deltaTime;
        if (playerComponent.renderableComponent.frameTimer > 1) {
            playerComponent.newState = PlayerState.OnGround;
        }
    }
    HandleInteractingState(entity, playerComponent, deltaTime) {
        var topText = entity.GetComponent(TopTextComponent.name);
        if (playerComponent.inputComponent.cancelInteractionActive) {
            playerComponent.newState = PlayerState.OnGround;
        }
        else if (playerComponent.inputComponent.interactionActive && !playerComponent.inputComponent.interactionActivePrevious) {
            if (playerComponent.interactingWith.interactionAction(playerComponent.interactingWith, topText.chosenOption, false)) {
                playerComponent.newState = PlayerState.OnGround;
            }
        }
        if (topText.options.length > 0) {
            if (playerComponent.inputComponent.downActive && !playerComponent.inputComponent.downActivePrevious) {
                ++topText.chosenOption;
                if (topText.chosenOption >= topText.options.length) {
                    topText.chosenOption = 0;
                }
            }
            else if (playerComponent.inputComponent.jumpActive && !playerComponent.inputComponent.jumpActivePrevious) {
                --topText.chosenOption;
                if (topText.chosenOption < 0) {
                    topText.chosenOption = topText.options.length - 1;
                }
            }
        }
    }
    HandleAttackingState(entity, playerComponent, deltaTime) {
        this.HandleMovement(playerComponent, true, false);
        playerComponent.attackTimer += deltaTime;
        if (playerComponent.attackTimer >= this.attackPostTime) {
            if (MovingSystem.IsOnGroundOrPlatform(this.engine, playerComponent.moveableComponent)) {
                playerComponent.newState = PlayerState.OnGround;
            }
            else if (playerComponent.moveableComponent.velocity.y >= 0) {
                playerComponent.newState = PlayerState.Falling;
            }
            else {
                playerComponent.newState = PlayerState.Jumping;
            }
        }
        else if (playerComponent.attackTimer >= this.attackTime) {
            this.engine.RemoveEntity(playerComponent.attackEntity);
            playerComponent.attackEntity = null;
        }
        else if (playerComponent.attackTimer >= this.attackPreTime && playerComponent.attackEntity === null) {
            let attackEntity = new Entity();
            let attackPosition = new PositionComponent(0, 0, playerComponent.positionComponent.width, playerComponent.positionComponent.height);
            Object.defineProperty(attackPosition.position, 'x', {
                get() { return playerComponent.renderableComponent.orientationLeft ? (playerComponent.positionComponent.position.x - (2 / 3 * playerComponent.positionComponent.width)) : (playerComponent.positionComponent.position.x + (2 / 3 * playerComponent.positionComponent.width)); },
                set(_) { }
            });
            Object.defineProperty(attackPosition.position, 'y', {
                get() { return playerComponent.positionComponent.position.y; },
                set(_) { }
            });
            attackEntity.AddComponent(attackPosition);
            attackEntity.AddComponent(new AttackComponent(attackPosition, entity, playerComponent.attackDamage, true));
            playerComponent.attackEntity = attackEntity;
            this.engine.AddEntity(attackEntity);
        }
        let attackFrame = Math.round(playerComponent.attackTimer / (this.attackPostTime / 15));
        playerComponent.renderableComponent.gameAnimation = SpriteHelper.playerAttack;
        playerComponent.renderableComponent.frame = attackFrame;
        if (!MovingSystem.IsOnGroundOrPlatform(this.engine, playerComponent.moveableComponent)) {
            if (playerComponent.moveableComponent.velocity.y >= 0) {
                playerComponent.moveableComponent.velocity.y = ((playerComponent.moveableComponent.velocity.y * 7.0) + this.fallSpeed) / 8.0;
            }
            else {
                playerComponent.moveableComponent.velocity.y += 4 * this.movementSpeed * deltaTime;
            }
        }
    }
    LevelChanged() {
    }
    EntityAdded(entity) {
    }
    EntityRemoved(entity) {
    }
}
class RenderingSystem extends System {
    Update(deltaTime) {
        var camera = this.engine.GetEntities([CameraComponent.name])[0].GetComponent(CameraComponent.name);
        var context = Game.Instance.context;
        context.clearRect(0, 0, Game.ResolutionWidth, Game.ResolutionHeight);
        context.beginPath();
        var entities = this.engine.GetEntities([RenderableComponent.name]);
        entities = entities.concat(this.engine.GetEntities([DebugRenderableComponent.name]));
        entities.sort(function (a, b) {
            var renderA = (a.GetComponent(RenderableComponent.name) || a.GetComponent(DebugRenderableComponent.name));
            var renderB = (b.GetComponent(RenderableComponent.name) || b.GetComponent(DebugRenderableComponent.name));
            if (renderA.renderLayer < renderB.renderLayer) {
                return -1;
            }
            if (renderB.renderLayer < renderA.renderLayer) {
                return 1;
            }
            if (renderA.renderPriority < renderB.renderPriority) {
                return -1;
            }
            if (renderB.renderPriority < renderA.renderPriority) {
                return 1;
            }
            return 0;
        });
        for (var i = 0; i < entities.length; ++i) {
            var renderableComponent = (entities[i].GetComponent(RenderableComponent.name) || entities[i].GetComponent(DebugRenderableComponent.name));
            if (!renderableComponent.visible) {
                continue;
            }
            var cameraSpeedModifier = renderableComponent.renderLayer == RenderLayer.Background ? 0.5 : (renderableComponent.renderLayer == RenderLayer.Foreground ? 1.2 : 1);
            if (renderableComponent.gameAnimation) {
                var extra = renderableComponent.orientationLeft ? renderableComponent.width : 0;
                context.translate(renderableComponent.positionComponent.position.x - (camera.positionComponent.position.x * cameraSpeedModifier) + extra, renderableComponent.positionComponent.position.y - camera.positionComponent.position.y);
                if (renderableComponent.orientationLeft) {
                    context.scale(-1, 1);
                }
                context.drawImage(renderableComponent.gameAnimation.imageFile, renderableComponent.gameAnimation.sourceX + (renderableComponent.gameAnimation.width * renderableComponent.frame), renderableComponent.gameAnimation.sourceY, renderableComponent.gameAnimation.width, renderableComponent.gameAnimation.height, 0, 0, renderableComponent.width, renderableComponent.height);
                context.resetTransform();
            }
            else {
                context.beginPath();
                context.fillStyle = renderableComponent.color;
                context.strokeStyle = renderableComponent.color;
                context.fillRect(renderableComponent.positionComponent.position.x - (camera.positionComponent.position.x * cameraSpeedModifier), renderableComponent.positionComponent.position.y - camera.positionComponent.position.y, renderableComponent.width, renderableComponent.height);
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
            context.textAlign = 'center';
            context.textBaseline = 'top';
            context.font = '20pt Arial';
            var splitText = topText.text.split('\n');
            for (var j = 0; j < splitText.length; ++j) {
                context.fillText(splitText[j].toUpperCase(), Game.ResolutionWidth / 2, 200 + (35 * j));
            }
            context.textAlign = 'left';
            context.font = '16pt Calibri';
            var startY = 35 * j + 10;
            for (var k = 0; k < topText.options.length; ++k) {
                if (topText.chosenOption === k) {
                    context.lineWidth = 4;
                    context.beginPath();
                    context.moveTo(15, startY + (30 * k));
                    context.lineTo(15, startY + (30 * k) + 20);
                    context.lineTo(35, startY + (30 * k) + 10);
                    context.closePath();
                }
                context.lineWidth = 1;
                context.fillText(topText.options[k].toUpperCase(), 50, startY + (30 * k));
            }
            context.fill();
            context.stroke();
        }
    }
    LevelChanged() {
    }
    EntityAdded(entity) {
    }
    EntityRemoved(entity) {
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
            if (spawnComponent.moveableComponent.velocity.x === 0 && spawnComponent.moveableComponent.velocity.y === 0) {
                this.engine.RemoveEntity(entities[i]);
            }
            else if (spawnComponent.moveableComponent.positionComponent.position.x > spawnComponent.maxPosition.x || spawnComponent.moveableComponent.positionComponent.position.x < spawnComponent.minPosition.x
                || spawnComponent.moveableComponent.positionComponent.position.y > spawnComponent.maxPosition.y || spawnComponent.moveableComponent.positionComponent.position.y < spawnComponent.minPosition.y) {
                this.engine.RemoveEntity(entities[i]);
            }
            else if (this.CollisionWithPlayer(playerComponent, spawnComponent)) {
                playerComponent.newState = PlayerState.Respawing;
            }
        }
    }
    LevelChanged() {
    }
    EntityAdded(entity) {
    }
    EntityRemoved(entity) {
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
                var entity = EntityHelper.CreateSpawnedEntity(spawnComponent.spawnLocation.x, spawnComponent.spawnLocation.y, 10, 10, spawnComponent.spawnVelocity.clone(), spawnComponent.spawnMinPosition, spawnComponent.spawnMaxPosition, spawnComponent.spawnHealth);
                this.engine.AddEntity(entity);
            }
        }
    }
    LevelChanged() {
    }
    EntityAdded(entity) {
    }
    EntityRemoved(entity) {
    }
}
class TriggerSystem extends System {
    constructor() {
        super(...arguments);
        this.eventTriggered = false;
    }
    static CollisionWithPlayer(engine, positionComponent) {
        var playerEntity = engine.GetEntityByName('player');
        var player = playerEntity.GetComponent(PlayerComponent.name);
        if ((positionComponent.position.x <= player.positionComponent.position.x + player.positionComponent.width && positionComponent.position.x + positionComponent.width > player.positionComponent.position.x)
            && (positionComponent.position.y <= player.positionComponent.position.y + player.positionComponent.height && positionComponent.position.y + positionComponent.height > player.positionComponent.position.y)) {
            return true;
        }
        return false;
    }
    Update(deltaTime) {
        var levelTriggers = this.engine.GetEntities([LevelTriggerComponent.name]);
        var levelEvents = this.engine.GetEntities([EventComponent.name]);
        for (var i = 0; i < levelTriggers.length; ++i) {
            var levelTrigger = levelTriggers[i].GetComponent(LevelTriggerComponent.name);
            if (TriggerSystem.CollisionWithPlayer(this.engine, levelTrigger.positionComponent)) {
                Game.Instance.ChangeLevel(levelTrigger.level, levelTrigger.playerX, levelTrigger.playerY);
            }
        }
        for (var i = 0; i < levelEvents.length; ++i) {
            var levelEvent = levelEvents[i].GetComponent(EventComponent.name);
            if (TriggerSystem.CollisionWithPlayer(this.engine, levelEvent.positionComponent) && this.eventTriggered === false) {
                console.log("Fire event");
                this.eventTriggered = true;
            }
        }
    }
    LevelChanged() {
    }
    EntityAdded(entity) {
    }
    EntityRemoved(entity) {
    }
}
//# sourceMappingURL=all.js.map
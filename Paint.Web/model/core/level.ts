abstract class Level {
    public Width: number;
    public Height: number;
    public LoadScreen: GameAnimation;
    public MapLayout: GameAnimation;

    constructor(width: number, height: number, loadScreen: GameAnimation, mapLayout: GameAnimation) {
        this.Width = width;
        this.Height = height;
        this.LoadScreen = loadScreen;
        this.MapLayout = mapLayout;
    }

    public abstract Init(engine: Engine, playerX: number, playerY: number): void;

    public SaveState(engine: Engine): void {
        var entities = engine.GetEntities([]);
        for (var i = 0; i < entities.length; ++i) {
            var components = entities[i].GetAllComponents();
            for (var j = 0; j < components.length; ++j) {
                var component = <any>components[j];
                Game.Instance.GetSerializationAttributes(component.constructor.name).forEach(function (property) {
                    Game.Instance.SetSerializationState(entities[i].name, component.constructor.name, property, component[property]);
                });
            }
        }
    }

    public InitState(engine: Engine): void {
        var entities = engine.GetEntities([]);
        for (var i = 0; i < entities.length; ++i) {
            var components = entities[i].GetAllComponents();
            for (var j = 0; j < components.length; ++j) {
                var component = <any>components[j];
                Game.Instance.GetSerializationAttributes(component.constructor.name).forEach(function (property) {
                    var propertyValue = Game.Instance.GetSerializationState(entities[i].name, component.constructor.name, property);
                    if (propertyValue) {
                        component[property] = propertyValue;
                    }
                });
            }
        }
    }
}
class Entity {
    private static nameCounter: number = 0;

    private _name: string;
    get name(): string {
        return this._name;
    }

    components: Map<string, Component> = new Map<string, Component>();

    constructor(name?: string) {
        if (name) {
            this._name = name;
        } else {
            this._name = "_entity" + (++Entity.nameCounter);
        }
    }

    public AddComponent(component: Component): Entity {
        this.components.set(component.constructor.name, component);
        return this;
    }

    public RemoveComponent(componentType: string): Component {
        if (this.components.has(componentType)) {
            var component = this.components.get(componentType);
            this.components.delete(componentType);
            return component;
        }

        return null;
    }

    public GetAllComponents(): Component[] {
        var result : Component[] = [];
        this.components.forEach(function (c) {
            result.push(c);
        })
        return result;
    }

    public GetComponent(componentType: string): Component {
        return this.components.get(componentType);
    }

    public HasComponent(componentType: string): boolean {
        return this.components.has(componentType);
    }

    public HasComponents(componentTypes: string[]): boolean {
        for (var i = 0; i < componentTypes.length; ++i) {
            if (!this.HasComponent(componentTypes[i])) {
                return false;
            }
        }

        return true;
    }
}
class Entity {
    private static nameCounter: number = 0;

    _name: string;
    get name(): string {
        return this._name;
    }

    components: any[];

    constructor(name?: string) {
        if (name) {
            this._name = name;
        } else {
            this._name = "_entity" + (++Entity.nameCounter);
        }
    }

    public AddComponent(component: any): Entity {
        this.components.push(component);
        return this;
    }

    public RemoveComponent(component: any): any {
        var index = this.components.indexOf(component)
        if (index !== -1) {
            var component = this.components[index];
            this.components.splice(index, 1);
            return component;
        }

        return null;
    }

    public GetAllComponents(): any[] {
        return this.components.slice();
    }
}
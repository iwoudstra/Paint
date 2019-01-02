class Game {
    constructor() {
        this.requestAnimFrame = window.requestAnimationFrame;
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
    }
    static get Instance() {
        return this._instance || (this._instance = new this());
    }
    Handle() {
        this.now = Date.now();
        this.deltaTime = (this.now - this.lastTime) / 1000.0;
        this.lastTime = this.now;
        this.requestAnimFrame(this.Handle);
    }
}
class Player {
}
class Engine {
    AddEntity(entity) {
        this.entities.push(entity);
    }
    RemoveEntity(entity) {
        var index = this.entities.indexOf(entity);
        if (index !== -1) {
            var entity = this.entities[index];
            this.entities.splice(index, 1);
            return entity;
        }
        return null;
    }
}
class Entity {
    constructor(name) {
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
        this.components.push(component);
        return this;
    }
    RemoveComponent(component) {
        var index = this.components.indexOf(component);
        if (index !== -1) {
            var component = this.components[index];
            this.components.splice(index, 1);
            return component;
        }
        return null;
    }
    GetAllComponents() {
        return this.components.slice();
    }
}
Entity.nameCounter = 0;
//# sourceMappingURL=all.js.map
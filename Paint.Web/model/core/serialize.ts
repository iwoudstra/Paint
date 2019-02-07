function serializeParameter(saveState: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Game.Instance.AddSerializationAttribute(target.constructor.name, propertyKey);
    }
}
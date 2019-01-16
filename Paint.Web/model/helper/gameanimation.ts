class GameAnimation {
    public imageFile: HTMLImageElement;
    public sourceX: number;
    public sourceY: number;
    public width: number;
    public height: number;
    public frames: number;
    public name: string;

    constructor(imageFile: HTMLImageElement, sourceX: number, sourceY: number, width: number, height: number, frames: number, name: string) {
        this.imageFile = imageFile;
        this.sourceX = sourceX;
        this.sourceY = sourceY;
        this.width = width;
        this.height = height;
        this.frames = frames;
        this.name = name;
    }
}
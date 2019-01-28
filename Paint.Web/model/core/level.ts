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
}
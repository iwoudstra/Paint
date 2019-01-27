class SpriteHelper {
    static characterSpriteSheet: HTMLImageElement = new Image();
    static rockPlatform: HTMLImageElement = new Image();
    static level1: HTMLImageElement = new Image();


    static playerWalking: GameAnimation;
    static playerJumping: GameAnimation;
    static rockPlatformAnimation: GameAnimation;
    static level1Animation: GameAnimation;


    public static InitSprites(): void {
        this.characterSpriteSheet.src = 'assets/sprites/characterspritesheet.png';
        this.rockPlatform.src = 'assets/sprites/rockplatform.png';
        this.level1.src = 'assets/sprites/level.png';

        this.playerWalking = new GameAnimation(this.characterSpriteSheet, 0, 361, 391, 361, 6, 'playerwalking');
        this.playerJumping = new GameAnimation(this.characterSpriteSheet, 0, 0, 391, 361, 3, 'playerjumping');
        this.rockPlatformAnimation = new GameAnimation(this.rockPlatform, 0, 0, 580, 540, 1, 'rockplatform');
        this.level1Animation = new GameAnimation(this.level1, 0, 0, 3000, 1080, 1, 'gamemap');
    }
}
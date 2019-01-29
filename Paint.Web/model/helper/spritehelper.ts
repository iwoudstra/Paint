class SpriteHelper {
    static characterSpriteSheet: HTMLImageElement = new Image();
    static rockPlatform: HTMLImageElement = new Image();
    static level1: HTMLImageElement = new Image();
    static level2: HTMLImageElement = new Image();



    static playerWalking: GameAnimation;
    static playerJumping: GameAnimation;
    static rockPlatformAnimation: GameAnimation;
    static level1Animation: GameAnimation;
    static level2Animation: GameAnimation;


    public static InitSprites(): void {
        this.characterSpriteSheet.src = 'assets/sprites/characterspritesheet.png';
        this.rockPlatform.src = 'assets/sprites/rockplatform.png';
        this.level1.src = 'assets/sprites/level.png';
        this.level2.src = 'assets/sprites/level-2.png';

        this.playerWalking = new GameAnimation(this.characterSpriteSheet, 0, 361, 391, 361, 6, 'playerwalking');
        this.playerJumping = new GameAnimation(this.characterSpriteSheet, 0, 0, 391, 361, 3, 'playerjumping');
        this.rockPlatformAnimation = new GameAnimation(this.rockPlatform, 0, 0, 580, 540, 1, 'rockplatform');
        this.level1Animation = new GameAnimation(this.level1, 0, 0, 3071, 2944, 1, 'gamemap');
        this.level2Animation = new GameAnimation(this.level2, 0, 0, 2074, 1920, 1, 'gamemap');
    }
}

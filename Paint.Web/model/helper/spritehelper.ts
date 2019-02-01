class SpriteHelper {
    static characterSpriteSheet: HTMLImageElement = new Image();
    static rockPlatform: HTMLImageElement = new Image();
    static level1: HTMLImageElement = new Image();
    static level1f: HTMLImageElement = new Image();
    static level2: HTMLImageElement = new Image();
    static npcwip: HTMLImageElement = new Image();



    static playerWalking: GameAnimation;
    static playerJumping: GameAnimation;
    static rockPlatformAnimation: GameAnimation;
    static level1Animation: GameAnimation;
    static level1fAnimation: GameAnimation;
    static level2Animation: GameAnimation;
    static npcwipAnimation: GameAnimation;


    public static InitSprites(): void {
        this.characterSpriteSheet.src = 'assets/sprites/characterspritesheet.png';
        this.level1.src = 'assets/sprites/level.png';
        this.level1f.src = 'assets/sprites/level-1-f.png';
        this.level2.src = 'assets/sprites/level-2.png';
        this.npcwip.src = 'assets/sprites/npc.png';

        this.playerWalking = new GameAnimation(this.characterSpriteSheet, 0, 361, 391, 361, 6, 'playerwalking');
        this.playerJumping = new GameAnimation(this.characterSpriteSheet, 0, 0, 391, 361, 3, 'playerjumping');
        this.npcwipAnimation = new GameAnimation(this.npcwip, 0, 0, 130, 195, 1, 'npcwip');
        this.level1Animation = new GameAnimation(this.level1, 0, 0, 3071, 2944, 1, 'gamemap');
        this.level1fAnimation = new GameAnimation(this.level1f, 0, 0, 1917, 1147, 1, 'gamemap');
        this.level2Animation = new GameAnimation(this.level2, 0, 0, 2074, 1920, 1, 'gamemap');
    }
}

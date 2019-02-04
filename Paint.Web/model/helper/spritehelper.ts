class SpriteHelper {
    static characterSpriteSheet: HTMLImageElement = new Image();
    static rockPlatform: HTMLImageElement = new Image();
    static level1: HTMLImageElement = new Image();
    static level1fg: HTMLImageElement = new Image();
    static level1f: HTMLImageElement = new Image();
    static level1bg: HTMLImageElement = new Image();
    static level2: HTMLImageElement = new Image();
    static level3: HTMLImageElement = new Image();
      static level3bg: HTMLImageElement = new Image();
    static npcwip: HTMLImageElement = new Image();


    static playerWalking: GameAnimation;
    static playerJumping: GameAnimation;
    static level1Animation: GameAnimation;
    static level1fAnimation: GameAnimation;
    static level1fgAnimation: GameAnimation;
    static level1bgAnimation: GameAnimation;
    static level2Animation: GameAnimation;
    static level3Animation: GameAnimation;
    static level3bgAnimation: GameAnimation;
    static npcwipAnimation: GameAnimation;
    static npcLeftEyeAnimation: GameAnimation;
    static npcRightEyeAnimation: GameAnimation;


    public static InitSprites(): void {
        this.characterSpriteSheet.src = 'assets/sprites/player/characterspritesheet.png';
        this.npcwip.src = 'assets/sprites/npc/npc.png';
        this.level1.src = 'assets/sprites/level-1/level.png';
        this.level1fg.src = 'assets/sprites/level-1/level-1-fg.png'
        this.level1f.src = 'assets/sprites/level-1/level-1-f.png';
        this.level1bg.src = 'assets/sprites/level-1/level-1-bg.png';
        this.level2.src = 'assets/sprites/level-2/level-2.png';
        this.level3.src = 'assets/sprites/level-3/level-3.png';
        this.level3bg.src = 'assets/sprites/level-3/level-3-bg.png';

        this.playerWalking = new GameAnimation(this.characterSpriteSheet, 0, 361, 391, 361, 6, 'playerwalking');
        this.playerJumping = new GameAnimation(this.characterSpriteSheet, 0, 0, 391, 361, 3, 'playerjumping');
        this.npcwipAnimation = new GameAnimation(this.npcwip, 0, 0, 130, 195, 1, 'npcwip');
        this.npcLeftEyeAnimation = new GameAnimation(this.npcwip, 60, 58, 5, 6, 1, 'npcLeftEye');
        this.npcRightEyeAnimation = new GameAnimation(this.npcwip, 75, 58, 5, 8, 1, 'npcRightEye');
        this.level1Animation = new GameAnimation(this.level1, 0, 0, 3071, 2944, 1, 'gamemap');
        this.level1fAnimation = new GameAnimation(this.level1f, 0, 0, 1917, 1147, 1, 'gamemap');
        this.level1fgAnimation = new GameAnimation(this.level1fg, 0, 0, 3071, 2944, 1, 'gamemap');
        this.level1bgAnimation = new GameAnimation(this.level1bg, 0 , 0, 3071, 2944, 1, 'gamemap');

        this.level2Animation = new GameAnimation(this.level2, 0, 0, 2495, 1920, 1, 'gamemap');

        this.level3Animation = new GameAnimation(this.level3, 0, 0, 2950, 1855, 1, 'gamemap');
        this.level3bgAnimation = new GameAnimation(this.level3bg, 0, 0, 2950, 1855, 1, 'gamemap');
    }
}

class Game {
	canvas: HTMLCanvasElement;
	context: CanvasRenderingContext2D;
	requestAnimFrame = window.requestAnimationFrame;
	private static _instance: Game;
	private now: number;
	private lastTime: number;
	private deltaTime: number;

	private constructor() {
		this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
		this.context = this.canvas.getContext('2d');
	}

	public static get Instance() {
		return this._instance || (this._instance = new this());
	}

	public Handle(): void {
		this.now = Date.now();
		this.deltaTime = (this.now - this.lastTime) / 1000.0;



		this.lastTime = this.now;
		this.requestAnimFrame(this.Handle);
	}
}
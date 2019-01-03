const precision = [
    1,
    10,
    100,
    1000,
    10000,
    100000,
    1000000,
    10000000,
    100000000,
    1000000000,
    10000000000
]

class Vector2d {
    _x: number = 0;
    _y: number = 0;
    
    get x(): number {
        return this._x;
    }

    set x(newX: number) {
        this._x = newX;
    }

    get y(): number {
        return this._y;
    }

    set y(newY: number) {
        this._y = newY;
    }

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Return the vector as a formatted string, e.g "(0, 4)"
     */
    toString(round = false) {
        if (round) {
            return `(${Math.round(this.x)}, ${Math.round(this.y)})`
        }
        return `(${this.x}, ${this.y})`
    }

    /**
     * Return an Array containing the vector axes, e.g [0, 4]
     */
    toArray() {
        return [this.x, this.y]
    }

    /**
     * Return an Object containing the vector axes, e.g { x: 0, y: 4 }
     */
    toObject() {
        return {
            x: this.x,
            y: this.y
        }
    }

    /**
     * Add the provided vector to this one
     */
    add(vec: Vector2d) {
        this.x += vec.x
        this.y += vec.y

        return this
    }

    /**
     * Subtract the provided vector from this one
     */
    subtract(vec: Vector2d) {
        this.x -= vec.x
        this.y -= vec.y

        return this
    }

    /**
     * Check if the provided vector equal to this one
     */
    equals(vec: Vector2d) {
        return vec.x === this.x && vec.y === this.y
    }

    /**
     * Multiply this vector by the provided vector
     */
    multiplyByVector(vec: Vector2d) {
        this.x *= vec.x
        this.y *= vec.y

        return this
    }

    /**
     * Multiply this vector by the provided vector
     */
    mulV(vec: Vector2d) {
        return this.multiplyByVector(vec)
    }

    /**
     * Divide this vector by the provided vector
     */
    divideByVector(vec: Vector2d) {
        this.x /= vec.x
        this.y /= vec.y
        return this
    }

    /**
     * Divide this vector by the provided vector
     */
    divV(v: Vector2d) {
        return this.divideByVector(v)
    }

    /**
     * Multiply this vector by the provided number
     */
    multiplyByScalar(n: number) {
        this.x *= n
        this.y *= n

        return this
    }

    /**
     * Multiply this vector by the provided number
     */
    mulS(n: number) {
        return this.multiplyByScalar(n)
    }

    /**
     * Divive this vector by the provided number
     */
    divideByScalar(n: number) {
        this.x /= n
        this.y /= n
        return this
    }

    /**
     * Divive this vector by the provided number
     */
    divS(n: number) {
        return this.divideByScalar(n)
    }

    /**
     * Normalise this vector
     */
    normalise() {
        return this.divideByScalar(this.magnitude())
    }

    /**
     * For American spelling. Same as unit/normalise function
     */
    normalize() {
        return this.normalise()
    }

    /**
     * The same as normalise and normalize
     */
    unit() {
        return this.normalise()
    }

    /**
     * Returns the magnitude (length) of this vector
     */
    magnitude() {
        const x = this.x
        const y = this.y

        return Math.sqrt(x * x + y * y)
    }

    /**
     * Returns the magnitude (length) of this vector
     */
    length() {
        return this.magnitude()
    }

    /**
     * Returns the squred length of this vector
     */
    lengthSq() {
        const x = this.x
        const y = this.y

        return x * x + y * y
    }

    /**
     * Returns the dot product of this vector by another
     */
    dot(vec: Vector2d) {
        return vec.x * this.x + vec.y * this.y
    }

    /**
     * Returns the cross product of this vector by another.
     */
    cross(vec: Vector2d) {
        return this.x * vec.y - this.y * vec.x
    }

    /**
     * Reverses this vector i.e multiplies it by -1
     */
    reverse() {
        this.x = -this.x
        this.y = -this.y
        return this
    }

    /**
     * Set the vector axes values to absolute values
     */
    abs() {
        this.x = Math.abs(this.x)
        this.y = Math.abs(this.y)

        return this
    }

    /**
     * Zeroes the vector i.e sets all axes to 0
     */
    zero() {
        this.x = this.y = 0

        return this
    }

    /**
     * Returns the distance between this vector and another
     */
    distance(v: Vector2d) {
        var x = this.x - v.x
        var y = this.y - v.y

        return Math.sqrt(x * x + y * y)
    }

    /**
     * Rotates the vetor by provided radians
     */
    rotate(rads: number) {
        const cos = Math.cos(rads)
        const sin = Math.sin(rads)

        const ox = this.x
        const oy = this.y

        this.x = ox * cos - oy * sin
        this.y = ox * sin + oy * cos

        return this
    }

    /**
     * Rounds this vector to n decimal places
     */
    round(n = 2) {
        var p = precision[n]

        // This performs waaay better than toFixed and give Float32 the edge again.
        // http://www.dynamicguru.com/javascript/round-numbers-with-precision/
        this.x = ((0.5 + this.x * p) << 0) / p
        this.y = ((0.5 + this.y * p) << 0) / p

        return this
    }

    /**
     * Returns a copy of this vector
     */
    clone() {
        return new Vector2d(this.x, this.y)
    }
}
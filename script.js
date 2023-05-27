const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

//Class
class RGB {
    constructor(r, g, b, a = 1) {
        this.R = r
        this.G = g
        this.B = b
        this.A = a
    }
    toString() {
        return `rgb(${this.R}, ${this.G}, ${this.B}, ${this.A})`
    }
    toCorrect(value, correct) {
        if (correct < value) {
            return correct
        }
        else if (value < 0) {
            return 0
        }
        return value
    }
    add(value) {
        let r = this.toCorrect(this.R + value, this.R)
        let g = this.toCorrect(this.G + value, this.G)
        let b = this.toCorrect(this.B + value, this.B)
        return new RGB(r, g, b)
    }
    alpha(value) {
        return new RGB(this.R, this.G, this.B, value)
    }
}

class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    add(b) {
        this.x += b.x
        this.y += b.y
    }
}

class Explode {
    constructor(x, y, CurrentIndex, LastIndex) {
        this.CurrentIndex = CurrentIndex
        this.LastIndex = LastIndex
        this.life_current = 0
        this.life_last = 0
        this.decrease = 0
        this.start = new Vector(x, y)

        this.particle = new Particle(x, y, LastIndex)
    }
    draw() {
        //Current
        selectColor(this.CurrentIndex)
        ctx.arc(this.start.x, this.start.y, this.life_current, 0, HALF, false)
        ctx.fill()

        this.life_current += 15

        //Last
        ctx.beginPath()
        let alpha_color = Palette[this.LastIndex]
        alpha_color = alpha_color.alpha(0.3 - this.life_last * 0.0012)
        ctx.fillStyle = alpha_color.toString()
        let r = this.life_last * 2
        if (this.decrease > 0 && this.this.decrease < 2) {
            this.decrease += 0.5
        }
        ctx.arc(this.start.x, this.start.y, r, 0, HALF, false)
        ctx.fill()

        this.life_last += 2 - this.decrease

        //Particle
        this.particle.draw()
    }
}

class Atom {
    constructor(x, y, vel_x, vel_y, r) {
        this.pos = new Vector(x, y)
        this.velocity = new Vector(vel_x, vel_y)
        this.r = r
    }
    draw() {
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, HALF, false)
        ctx.fill()
    }
    move() {
        this.pos.add(this.velocity)
        this.velocity.x -= getSym(this.velocity.x) * 0.01
        this.velocity.y -= getSym(this.velocity.y) * 0.01
        this.r -= 0.1
        if (this.r < 0) {
            this.r = 0
        }
    }
}

class Particle {
    constructor(x, y, index) {
        this.start = new Vector(x, y)
        this.index = index
        this.atoms = []
        this.init()
    }
    init() {
        for (var i = 0; i < PARTICLE_COUNT; i++) {
            const pos = new Vector(this.start.x + rand(50) * randSym(),
                this.start.y + rand(50) * randSym())
            const vel = new Vector(pos.x - this.start.x, pos.y - this.start.y)

            this.atoms.push(new Atom(pos.x, pos.y,
                vel.x / 12, vel.y / 12, rand(20, 70)))
        }
    }
    draw() {
        selectColor(this.index)
        this.atoms.forEach(i => {
            i.move()
            i.draw()
        })
    }
}

//Constant
const printf = (text) => console.log(text)

const HALF = Math.PI * 2
const CENTER = new Vector(canvas.width / 2, canvas.height / 2)
const PARTICLE_COUNT = 50

const Palette = [
    new RGB(0, 196, 255), //파
    new RGB(252, 255, 178),
    new RGB(255, 152, 128), //duswb
    new RGB(255, 97, 55), //주
    new RGB(249, 248, 113), //노2
]

const RenderList = []
//Variable
let CurrentIndex = 1
let LastIndex = 0

//Function
function getSym(n) {
    if (n < 0) {
        return -1
    }
    return +1
}

function rand(n) {
    // 0 ~ (n - 1)
    return Math.floor(Math.random() * n)
}

function randSym() {
    if (rand(2) == 0) {
        return 1
    }
    return -1
}

function selectColor(index) {
    ctx.beginPath()
    ctx.fillStyle = Palette[index].toString()
    ctx.strokeStyle = Palette[index].toString()
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}


function render() {
    clear()
    RenderList.forEach(i => i.draw())
}

function display() {
    render()
    requestAnimationFrame(display)
}

//Run
display()

let i = 0
//Event
function clickCanvas(event) {
    const start = new Vector(event.offsetX, event.offsetY)
    CurrentIndex += 1
    if (CurrentIndex >= Palette.length) {
        CurrentIndex = 0
    }
    /*while (true) {
        CurrentIndex = Math.floor(Math.random() * Palette.length)
        if (CurrentIndex !== LastIndex) {
            break
        }
    }*/
    RenderList.push(new Explode(start.x, start.y, CurrentIndex, LastIndex))
    if (RenderList.length > 10) {
        RenderList.shift()
    }
    LastIndex = CurrentIndex
}

//Add Listener
canvas.addEventListener("click", clickCanvas)

window.addEventListener(`resize`, function () {
    $('#canvas').attr('width', this.innerWidth)
    $('#canvas').attr('height', this.innerHeight)
});

window.addEventListener('load', () => {
    $('#canvas').attr('width', this.innerWidth)
    $('#canvas').attr('height', this.innerHeight)
})

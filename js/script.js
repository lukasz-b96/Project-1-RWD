const toggleScript = document.querySelector('.toggle')
const navigationScript = document.querySelector('.navigation')

toggleScript.addEventListener('click', () => {
    toggleScript.classList.toggle('active');
    navigationScript.classList.toggle('active');
})



const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
const nPoints = canvas.getAttribute('points')

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

let mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 80) * (canvas.width / 80)
}

window.addEventListener('mousemove',
    function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    }
);

// create particles

function strokeStar(x, y, r, n, inset, color) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.moveTo(0, 0 - r);
    for (var i = 0; i < n; i++) {
        ctx.rotate(Math.PI / n);
        ctx.lineTo(0, 0 - (r * inset));
        ctx.rotate(Math.PI / n);
        ctx.lineTo(0, 0 - r);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    // draw single particle
    draw() {
        ctx.beginPath();
        /*ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#fc0303';
        ctx.fill();
        */
        strokeStar(this.x, this.y, this.size, nPoints, 2, this.color)
    }

    // check particle position, check mouse position, 
    // move particle, draw particle
    update() {
        // check if particle is still within canvas
        if (this.x > canvas.width || this.x < 0) {
            this.directionX *= -1;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY *= -1;
        }

        // check collision
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 10
                this.directionX *= -1;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 10
                this.directionX *= -1;
            }
            if (mouse.y < this.y && this.y < canvas.width - this.size * 10) {
                this.y += 10
                this.directionY *= -1;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 10
                this.directionY *= -1;
            }
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init() {

    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 15000;
    for (let i = 0; i < numberOfParticles; i++) {
        // 1-5
        let size = (Math.random() * 5) + 1;

        // do no get stuck in the wall
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2)
        let y = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2)

        // movement speed -2.5 to 2.5
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;

        let color = '000000';
        if (Math.random() >= 0.5) {
            color = '#fc0303';
        }
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color))
    }
    return particlesArray
}

function animate() {

    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
}

window.addEventListener('resize',
    function() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((canvas.height / 80) * canvas.height / 80);
        init();
    })

window.addEventListener('mouseout',
    function() {
        mouse.x = undefined;
        mouse.y = undefined;
    }
)

window.addEventListener('mouseleave',
    function() {
        mouse.x = undefined;
        mouse.y = undefined;
    }
)


init()
animate()
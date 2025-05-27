const canvas = document.getElementById('bouncingBalls');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Ball class
class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = (Math.random() - 0.5) * 8; // Random horizontal velocity
        this.dy = (Math.random() - 0.5) * 8; // Random vertical velocity
        this.mass = 1; // Mass for collision calculations
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    checkCollision(otherBall) {
        const dx = this.x - otherBall.x;
        const dy = this.y - otherBall.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.radius + otherBall.radius) {
            // Collision detected - calculate collision response
            const normalX = dx / distance;
            const normalY = dy / distance;

            // Relative velocity
            const relativeVelocityX = this.dx - otherBall.dx;
            const relativeVelocityY = this.dy - otherBall.dy;

            // Calculate impulse
            const speed = relativeVelocityX * normalX + relativeVelocityY * normalY;
            
            if (speed < 0) return; // Already moving apart

            const impulse = 2 * speed / (this.mass + otherBall.mass);

            // Apply impulse
            this.dx -= impulse * otherBall.mass * normalX;
            this.dy -= impulse * otherBall.mass * normalY;
            otherBall.dx += impulse * this.mass * normalX;
            otherBall.dy += impulse * this.mass * normalY;

            // Prevent sticking by moving balls apart
            const overlap = (this.radius + otherBall.radius - distance) / 2;
            this.x += overlap * normalX;
            this.y += overlap * normalY;
            otherBall.x -= overlap * normalX;
            otherBall.y -= overlap * normalY;
        }
    }

    update(balls) {
        // Bounce off walls
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        // Keep ball within bounds
        this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));

        // Check collisions with other balls
        balls.forEach(ball => {
            if (ball !== this) {
                this.checkCollision(ball);
            }
        });

        // Update position
        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }
}

// Create balls
const balls = [
    new Ball(100, 100, 20, 'red'),
    new Ball(200, 200, 20, 'blue'),
    new Ball(300, 300, 20, 'green'),
    new Ball(400, 400, 20, 'orange'),
    new Ball(500, 500, 20, 'white'),
    new Ball(150, 150, 20, 'green'),
    new Ball(250, 350, 20, 'green'),
    new Ball(450, 250, 20, 'green'),
    new Ball(550, 450, 20, 'green'),
    // Adding two more red balls
    new Ball(350, 150, 20, 'red'),
    new Ball(600, 300, 20, 'red')
];

// Animation loop
function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    balls.forEach(ball => ball.update(balls));
    requestAnimationFrame(animate);
}

// Start animation
animate(); 
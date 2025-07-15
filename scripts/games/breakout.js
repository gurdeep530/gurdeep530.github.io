export function createBreakoutGame(canvas, ctx, scoreDisplay, gridSize, tileCount) {
    let paddle = { x: canvas.width / 2 - 50, y: canvas.height - 20, width: 100, height: 10 };
    let ball = { x: canvas.width / 2, y: canvas.height - 30, dx: 4, dy: -4, radius: 8 };
    let bricks = [];
    let score = 0;
    let isGameRunning = false;

    function init() {
        paddle = { x: canvas.width / 2 - 50, y: canvas.height - 20, width: 100, height: 10 };
        ball = { x: canvas.width / 2, y: canvas.height - 30, dx: 4, dy: -4, radius: 8 };
        bricks = [];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 5; col++) {
                bricks.push({ x: col * (canvas.width / 5), y: row * 30 + 20, width: canvas.width / 5 - 5, height: 20, active: true });
            }
        }
        score = 0;
        scoreDisplay.innerText = `Score: ${score}`;
        isGameRunning = false;
        draw();
    }

    function draw() {
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#0089ce";
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#ff0000";
        ctx.fill();
        bricks.forEach(brick => {
            if (brick.active) {
                ctx.fillStyle = "#73f4f8";
                ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
            }
        });
        scoreDisplay.innerText = `Score: ${score}`;
    }

    function update() {
        isGameRunning = true;
        ball.x += ball.dx;
        ball.y += ball.dy;
        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) ball.dx *= -1;
        if (ball.y - ball.radius < 0) ball.dy *= -1;
        if (ball.y + ball.radius > canvas.height) {
            alert(`Game Over! Score: ${score}`);
            return false;
        }
        if (ball.y + ball.radius > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddle.width) ball.dy *= -1;
        bricks.forEach(brick => {
            if (brick.active && ball.x > brick.x && ball.x < brick.x + brick.width && ball.y > brick.y && ball.y < brick.y + brick.height) {
                brick.active = false;
                ball.dy *= -1;
                score += 10;
            }
        });
        draw();
        return true;
    }

    function handleMouse(e) {
        if (isGameRunning) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            paddle.x = Math.max(0, Math.min(mouseX - paddle.width / 2, canvas.width - paddle.width));
        }
    }

    // Add mouse event listener during init
    function initMouseControls() {
        canvas.addEventListener("mousemove", handleMouse);
    }

    return {
        name: "Breakout",
        init: () => {
            init();
            initMouseControls();
        },
        update,
        draw,
        handleKey: () => {} // Empty, as keyboard controls are replaced
    };
}
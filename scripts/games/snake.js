export function createSnakeGame(canvas, ctx, scoreDisplay, gridSize, tileCount) {
    let snake = [{ x: 10, y: 10 }];
    let food = { x: 15, y: 15 };
    let xVel = 0;
    let yVel = 0;
    let score = 0;

    function init() {
        snake = [{ x: 10, y: 10 }];
        food = { x: 15, y: 15 };
        xVel = 0;
        yVel = 0;
        score = 0;
        scoreDisplay.innerText = `Score: ${score}`;
        draw();
    }

    function draw() {
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        snake.forEach((part, index) => {
            const x = part.x * gridSize;
            const y = part.y * gridSize;

            if (index === 0) {
                // Draw head (rounded square with eyes)
                ctx.fillStyle = "#0089ce";
                ctx.beginPath();
                ctx.roundRect(x + 2, y + 2, gridSize - 4, gridSize - 4, 4);
                ctx.fill();

                // Draw eyes based on direction
                ctx.fillStyle = "#73f4f8";
                let eye1X, eye1Y, eye2X, eye2Y;
                const eyeRadius = gridSize * 0.1; // Small eyes (~1.8px on iPhone SE)
                if (xVel === 1) { // Right
                    eye1X = x + gridSize * 0.7; eye1Y = y + gridSize * 0.3;
                    eye2X = x + gridSize * 0.7; eye2Y = y + gridSize * 0.7;
                } else if (xVel === -1) { // Left
                    eye1X = x + gridSize * 0.3; eye1Y = y + gridSize * 0.3;
                    eye2X = x + gridSize * 0.3; eye2Y = y + gridSize * 0.7;
                } else if (yVel === 1) { // Down
                    eye1X = x + gridSize * 0.3; eye1Y = y + gridSize * 0.7;
                    eye2X = x + gridSize * 0.7; eye2Y = y + gridSize * 0.7;
                } else if (yVel === -1) { // Up
                    eye1X = x + gridSize * 0.3; eye1Y = y + gridSize * 0.3;
                    eye2X = x + gridSize * 0.7; eye2Y = y + gridSize * 0.3;
                } else { // Default (right at start)
                    eye1X = x + gridSize * 0.7; eye1Y = y + gridSize * 0.3;
                    eye2X = x + gridSize * 0.7; eye2Y = y + gridSize * 0.7;
                }
                ctx.beginPath();
                ctx.arc(eye1X, eye1Y, eyeRadius, 0, Math.PI * 2);
                ctx.arc(eye2X, eye2Y, eyeRadius, 0, Math.PI * 2);
                ctx.fill();
            } else if (index === snake.length - 1) {
                // Draw tail (tapered triangle)
                ctx.fillStyle = "#0089ce";
                ctx.beginPath();
                const prev = snake[index - 1];
                if (prev.x < part.x) { // Tail pointing left
                    ctx.moveTo(x + gridSize - 2, y + 2);
                    ctx.lineTo(x + gridSize - 2, y + gridSize - 2);
                    ctx.lineTo(x + 2, y + gridSize / 2);
                } else if (prev.x > part.x) { // Tail pointing right
                    ctx.moveTo(x + 2, y + 2);
                    ctx.lineTo(x + 2, y + gridSize - 2);
                    ctx.lineTo(x + gridSize - 2, y + gridSize / 2);
                } else if (prev.y < part.y) { // Tail pointing up
                    ctx.moveTo(x + 2, y + gridSize - 2);
                    ctx.lineTo(x + gridSize - 2, y + gridSize - 2);
                    ctx.lineTo(x + gridSize / 2, y + 2);
                } else { // Tail pointing down
                    ctx.moveTo(x + 2, y + 2);
                    ctx.lineTo(x + gridSize - 2, y + 2);
                    ctx.lineTo(x + gridSize / 2, y + gridSize - 2);
                }
                ctx.closePath();
                ctx.fill();
            } else {
                // Draw body (rounded square)
                ctx.fillStyle = "#0089ce";
                ctx.beginPath();
                ctx.roundRect(x + 2, y + 2, gridSize - 4, gridSize - 4, 4);
                ctx.fill();
            }
        });

        // Draw food (red circle)
        ctx.fillStyle = "#ff0000";
        ctx.beginPath();
        ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 2 - 2, 0, Math.PI * 2);
        ctx.fill();

        scoreDisplay.innerText = `Score: ${score}`;
    }

    function update() {
        const head = { x: snake[0].x + xVel, y: snake[0].y + yVel };
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            food = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
            if (snake.some(part => part.x === food.x && part.y === food.y)) {
                food = {
                    x: Math.floor(Math.random() * tileCount),
                    y: Math.floor(Math.random() * tileCount)
                };
            }
        } else {
            snake.pop();
        }
        if (
            head.x < 0 ||
            head.x >= tileCount ||
            head.y < 0 ||
            head.y >= tileCount ||
            snake.slice(1).some(part => part.x === head.x && part.y === head.y)
        ) {
            alert(`Game Over! Score: ${score}`);
            return false;
        }
        draw();
        return true;
    }

    function handleKey(e) {
        switch (e.key) {
            case "w":
                if (yVel === 0) { yVel = -1; xVel = 0; }
                break;
            case "s":
                if (yVel === 0) { yVel = 1; xVel = 0; }
                break;
            case "a":
                if (xVel === 0) { xVel = -1; yVel = 0; }
                break;
            case "d":
                if (xVel === 0) { xVel = 1; yVel = 0; }
                break;
        }
    }

    return {
        name: "Snake",
        init,
        update,
        draw,
        handleKey
    };
}
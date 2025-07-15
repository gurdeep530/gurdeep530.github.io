export function createMemoryGame(canvas, ctx, scoreDisplay) {
    return {
        name: "Memory",
        init() {
            const game = this; 
            let cards = [];
            let flippedCards = [];
            let matches = 0;
            let isGameRunning = false;
            let canFlip = false;

            const GRID_SIZE = 4;
            const CARD_SIZE = 80;
            const GAP = 10;
            const TOTAL_WIDTH = GRID_SIZE * CARD_SIZE + (GRID_SIZE - 1) * GAP;
            canvas.width = TOTAL_WIDTH;
            canvas.height = TOTAL_WIDTH;

            function shuffle(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
            }

            function initializeCards() {
                cards = [];
                const values = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
                shuffle(values);
                for (let i = 0; i < GRID_SIZE; i++) {
                    for (let j = 0; j < GRID_SIZE; j++) {
                        cards.push({
                            x: j * (CARD_SIZE + GAP),
                            y: i * (CARD_SIZE + GAP),
                            value: values[i * GRID_SIZE + j],
                            flipped: false,
                            matched: false,
                            flipProgress: 0
                        });
                    }
                }
            }

            function drawCard(card) {
                ctx.save();
                ctx.translate(card.x + CARD_SIZE / 2, card.y + CARD_SIZE / 2);
                if (card.flipProgress < 90 && !card.matched) {
                    ctx.rotate((card.flipProgress * Math.PI) / 180);
                }
                ctx.translate(-CARD_SIZE / 2, -CARD_SIZE / 2);

                if (card.flipProgress < 90 && !card.matched) {
                    ctx.fillStyle = "#0089ce";
                    ctx.fillRect(0, 0, CARD_SIZE, CARD_SIZE);
                } else {
                    ctx.fillStyle = card.matched ? "#73f4f8" : "#fff";
                    ctx.fillRect(0, 0, CARD_SIZE, CARD_SIZE);
                    ctx.fillStyle = "#000";
                    ctx.font = "24px Arial";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(card.value, CARD_SIZE / 2, CARD_SIZE / 2);
                }
                ctx.restore();
            }

            function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.style.backgroundImage = "none";
                canvas.style.backgroundColor = "#f0f0f0";
                cards.forEach(card => drawCard(card));
                if (matches === 8) {
                    ctx.fillStyle = "#0089ce";
                    ctx.font = "32px Arial";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText("You Win!", canvas.width / 2, canvas.height / 2);
                }
            }

            function animateFlips() {
                let animating = false;
                cards.forEach(card => {
                    if (card.flipped && card.flipProgress < 180) {
                        card.flipProgress += 10;
                        animating = true;
                    } else if (!card.flipped && card.flipProgress > 0 && !card.matched) {
                        card.flipProgress -= 10;
                        animating = true;
                    }
                });
                draw();
                if (animating) {
                    requestAnimationFrame(animateFlips);
                }
            }

            this.start = () => {
                if (!isGameRunning) {
                    isGameRunning = true;
                    canFlip = true;
                    matches = 0;
                    scoreDisplay.innerText = `Matches: ${matches}`;
                    initializeCards();
                    draw();
                }
            };

            this.update = () => {
                return true;
            };

            this.handleKey = () => {};

            function handleClick(e) {
                if (!isGameRunning || !canFlip || matches === 8) return;
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                cards.forEach(card => {
                    if (!card.flipped && !card.matched && x >= card.x && x <= card.x + CARD_SIZE && y >= card.y && y <= card.y + CARD_SIZE) {
                        card.flipped = true;
                        flippedCards.push(card);
                        animateFlips();
                        if (flippedCards.length === 2) {
                            canFlip = false;
                            const [card1, card2] = flippedCards;
                            if (card1.value === card2.value) {
                                card1.matched = true;
                                card2.matched = true;
                                matches++;
                                scoreDisplay.innerText = `Matches: ${matches}`;
                                flippedCards = [];
                                canFlip = true;
                                if (matches === 8) {
                                    isGameRunning = false;
                                    scoreDisplay.style.display = "none";
                                    document.getElementById("startBtn").style.display = "block";
                                    draw();
                                    setTimeout(() => {
                                        game.init();
                                        game.start();
                                    }, 2000);
                                }
                            } else {
                                setTimeout(() => {
                                    card1.flipped = false;
                                    card2.flipped = false;
                                    flippedCards = [];
                                    canFlip = true;
                                    animateFlips();
                                }, 1000);
                            }
                        }
                    }
                });
                return true;
            }

            canvas.addEventListener("click", handleClick);
            canvas.addEventListener("touchstart", e => {
                e.preventDefault();
                handleClick(e.touches[0]);
            });

            initializeCards();
            draw();
        }
    };
}
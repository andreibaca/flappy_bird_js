const gameW = 100;
const gameH = 160;
const game = document.getElementById('game');
const ofScreenCanvas = document.createElement('canvas');
ofScreenCanvas.width = game.width;
ofScreenCanvas.height = gameH;
const ofScreenContext = ofScreenCanvas.getContext("2d");

const context = game.getContext("2d", { alpha: false });

const pipeWidth = gameW/5;
let pipeHeight = gameH/2;
let pipeX = gameW;
let pipeGap = gameH/2;

let score = 0;
let bestScore = 0;

const bird = {
    startY: gameH/2,
    x:0,
    y: gameH/2,
    speedY: 0,
    size: gameH/8,
    img: new Image(),
}

bird.img.src = './images/bird.png';

game.onclick = () => (bird.speedY = -4);

let interval = 25;

function birdDied(){
    if (bird.y > gameH || bird.y < 0-bird.size) return true;
    if ((bird.y < pipeHeight || bird.y > pipeHeight+pipeGap) && pipeX < bird.x ) return true;
    return false;
}

function draw() {
    ofScreenContext.fillStyle = 'skyblue';
    ofScreenContext.fillRect(0,0,gameW,gameH);
    bird.speedY += 0.25;
    bird.y = Math.floor(bird.speedY + bird.y);
    ofScreenContext.drawImage(bird.img, bird.x,bird.y, bird.size, bird.size);
    pipeX -= 1;
    if (pipeX < - pipeWidth){
        pipeX = gameW;
        pipeHeight = (gameH-pipeGap)*Math.random();
    }

    ofScreenContext.fillStyle = 'green';
    ofScreenContext.fillRect(pipeX,0,pipeWidth,pipeHeight); //Draw top pipe
    ofScreenContext.fillRect(pipeX,pipeHeight+pipeGap,pipeWidth, gameH); //Draw bottom pipe

    if (birdDied()){
        bird.speedY = 0;
        bird.y = bird.startY;
        bestScore = Math.max(bestScore, score)
        score=0;
    }

    ofScreenContext.fillStyle = "black";
    ofScreenContext.fillText(score++,9,25);
    ofScreenContext.fillText(`Best: ${bestScore}`,9,50);

    context.drawImage(ofScreenCanvas, 0, 0);

    requestAnimationFrame(draw)

}

requestAnimationFrame(draw);
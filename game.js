const gameW = 100;
const gameH = 160;
const game = document.getElementById('game');
const ofScreenCanvas = document.createElement('canvas');
ofScreenCanvas.width = game.width;
ofScreenCanvas.height = gameH;
const ofScreenContext = ofScreenCanvas.getContext("2d");

const context = game.getContext("2d", { alpha: false });


const pipe = {
    w:gameW/5,
    h:gameH/2,
    x:gameW,
    gap:gameH/2,
    draw(ctx){
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x,0,this.w,this.h); //Draw top pipe
        ctx.fillRect(this.x,this.h+this.gap,this.w, gameH); //Draw bottom pipe
    },
    move(){
        this.x -= 1;
        if (this.x < - this.w){
            this.x = gameW;
            this.h = (gameH-this.gap)*Math.random();
        }

    }
}

let score = 0;
let bestScore = 0;


const bird = {
    startY: gameH/2,
    x:0,
    y: gameH/2,
    speedY: 0,
    size: gameH/8,
    img: new Image(),
    fly(){
        this.speedY += 0.25; // Gravity acceleration
        this.y = Math.floor(this.speedY + this.y);
    },
    draw(ctx){
        ctx.drawImage(this.img, this.x,this.y, this.size, this.size);
    },
    init(){
        this.img.src = './images/bird.png'; // define image
        game.onclick = () => (this.speedY = -4); // fly up
    },

    died(){
        if (this.y > gameH || this.y < 0-this.size) return true;
        if ((this.y < pipe.h || this.y > pipe.h+pipe.gap) && pipe.x < (this.x+this.size) && (pipe.x+pipe.w) > this.x) return true;
        return false;
    }
}


bird.init();


function draw() {
    ofScreenContext.fillStyle = 'skyblue';
    ofScreenContext.fillRect(0,0,gameW,gameH);

    bird.fly();
    bird.draw(ofScreenContext);

    pipe.move();
    pipe.draw(ofScreenContext);


    if (bird.died()){
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
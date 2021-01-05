const game = {
    canvas:document.getElementById('game'),
    ctx:this.canvas.getContext("2d", { alpha: false }),
    vCanvas:document.createElement('canvas'),
    vCtx: this.vCanvas.getContext("2d", { alpha: false }),
    w: 100,
    h:160,
    init(){
        this.vCanvas.width = this.w;
        this.vCanvas.height = this.h;

        this.ctx.fillStyle = '#6d4242';
        this.ctx.fillRect(0,0,100,200);
    }
}

game.init();

const context = game.getContext("2d", { alpha: false });


const pipe = {
    w:game.w/5,
    h:game.h/2,
    x:game.w,
    gap:game.h/2,
    draw(ctx){
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x,0,this.w,this.h); //Draw top pipe
        ctx.fillRect(this.x,this.h+this.gap,this.w, game.h); //Draw bottom pipe
    },
    move(){
        this.x -= 1;
        if (this.x < - this.w){
            this.x = game.w;
            this.h = (game.h-this.gap)*Math.random();
        }

    }
}

let score = 0;
let bestScore = 0;


const bird = {
    startY: game.h/2,
    x:0,
    y: game.h/2,
    speedY: 0,
    size: game.h/8,
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
        if (this.y > game.h || this.y < 0-this.size) return true;
        if ((this.y < pipe.h || this.y > pipe.h+pipe.gap) && pipe.x < (this.x+this.size) && (pipe.x+pipe.w) > this.x) return true;
        return false;
    }
}


bird.init();


function draw() {
    game.vCtx.fillStyle = 'skyblue';
    game.vCtx.fillRect(0,0,game.w,game.h);

    bird.fly();
    bird.draw(game.vCtx);

    pipe.move();
    pipe.draw(game.vCtx);


    if (bird.died()){
        bird.speedY = 0;
        bird.y = bird.startY;
        bestScore = Math.max(bestScore, score)
        score=0;
    }

    game.vCtx.fillStyle = "black";
    game.vCtx.fillText(score++,9,25);
    game.vCtx.fillText(`Best: ${bestScore}`,9,50);

    context.drawImage(ofScreenCanvas, 0, 0);

    requestAnimationFrame(draw)

}

requestAnimationFrame(draw);
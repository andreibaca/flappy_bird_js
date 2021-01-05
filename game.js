const game = {
    canvas:document.getElementById('game'),
    ctx:null,
    vCanvas:document.createElement('canvas'),
    vCtx: null,
    w: 100,
    h:160,
    init(){
        this.ctx = this.canvas.getContext("2d", { alpha: false });
        this.vCtx = this.vCanvas.getContext("2d", { alpha: false });
        this.vCanvas.width = this.w;
        this.vCanvas.height = this.h;

        this.ctx.fillStyle = '#6d4242';
        this.ctx.fillRect(0,0,100,200);
    },
    reset(){
        bird.speedY = 0;
        bird.y = bird.startY;
        pipe.x = this.w;
        score.setBest();

    },
    drawBG(){
        this.vCtx.fillStyle = 'skyblue';
        this.vCtx.fillRect(0,0,this.w,this.h);
    },
    renderFinal(){
        this.ctx.drawImage(this.vCanvas, 0, 0);
    }

}

game.init();


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
            score.increase();
        }

    }
}


const score = {
    current:0,
    best:0,
    increase(){
        this.current++;
    },
    setBest(){
        this.best = Math.max(this.best, this.current);
        this.current=0;
    },
    draw(ctx){
        ctx.fillStyle = "black";
        ctx.fillText(this.current,9,25);
        ctx.fillText(`Best: ${this.best}`,9,50);
    }
}


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
        document.onclick = () => (this.speedY = -4); // fly up
    },

    died(){
        if (this.y > game.h || this.y < 0-this.size) return true;
        if ((this.y < pipe.h || this.y > pipe.h+pipe.gap) && pipe.x < (this.x+this.size) && (pipe.x+pipe.w) > this.x) return true;
        return false;
    }
}


bird.init();


function draw() {

    game.drawBG()

    bird.fly();
    bird.draw(game.vCtx);

    pipe.move();
    pipe.draw(game.vCtx);


    if (bird.died()){
        game.reset();
    }

    score.draw(game.vCtx);

    game.renderFinal();

    requestAnimationFrame(draw)

}

requestAnimationFrame(draw);
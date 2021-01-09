const game = {
    canvas:document.getElementById('game'),
    ctx:null,
    vCanvas:document.createElement('canvas'),
    vCtx: null,
    w: 100,
    h:160,
    groundColor: '#6d4242',
    init(){
        this.ctx = this.canvas.getContext("2d", { alpha: false });
        this.vCtx = this.vCanvas.getContext("2d", { alpha: false });
        this.vCanvas.width = this.w;
        this.vCanvas.height = this.h;

        this.ctx.fillStyle = this.groundColor;
        this.ctx.fillRect(0,0,100,200);
    },
    reset(){

        bird.reset();
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
        if (bird.x > 10) this.x -= 1;
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
        ctx.fillStyle =  game.groundColor,
        ctx.fillRect(0,160,game.w,50);
        ctx.fillStyle = "white";
        ctx.fillText(this.current,9,175);
        ctx.fillText(`Best: ${this.best}`,9, 190);
    }
}


const bird = {
    startY:  game.h/2,
    x:       0,
    y:       game.h/2,
    speedY:  0,
    rotate: 0,
    currentRotation: 0,
    size:    game.h/8,
    img:     new Image(),
    canvas:  document.createElement('canvas'),
    birdCtx: null,
    fly(){
        if (this.x < 20) this.x++;
        else {
            this.speedY += 0.25; // Gravity acceleration
            this.y = Math.floor(this.speedY + this.y);
            if (this.rotate < 3) this.rotate += 1.5;
        }
    },
    draw(ctx){
        this.birdCtx.clearRect(0,0,this.size, this.size);
        // this.birdCtx.fillRect(0,0,this.size, this.size);
        this.rotateBird();
        this.birdCtx.drawImage(this.img, 0, 0, this.size, this.size);
        ctx.drawImage(this.canvas, this.x,this.y);
    },
    init(){
        this.x = -this.size;
        this.img.src = './images/bird.png'; // define image
        this.canvas.width = this.size;
        this.canvas.height = this.size;
        this.birdCtx = this.canvas.getContext("2d");

        document.onclick = () => {
            if (this.x < 20) return;
            this.speedY = -4; // fly up
            this.rotate = -20;

        };
    },
    rotateBird(){
        this.birdCtx.translate(this.size/2,this.size/2);
        this.birdCtx.rotate(this.rotate*Math.PI/180);
        this.currentRotation += this.rotate;
        console.log(this.currentRotation);
        if (this.currentRotation < -50 ) {
            this.rotate = 0;
        }
        this.birdCtx.translate(-this.size/2,-this.size/2);
    },
    died(){
        let margin = this.size/2;
        if (this.y+margin > game.h || this.y < 0-margin) return true;
        if ((this.y+margin < pipe.h || this.y+margin > pipe.h+pipe.gap) && pipe.x < (this.x+margin) && (pipe.x+pipe.w) > this.x) return true;
        return false;
    },
    reset(){
        this.birdCtx.setTransform(1,0,0,1,0,0);
        this.rotate = 0;
        this.currentRotation = 0;
        this.x = -this.size;
        this.y = this.startY;
        this.speedY = 0;
    }
}



game.init();

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

    score.draw(game.ctx);

    game.renderFinal();

    requestAnimationFrame(draw)

}

requestAnimationFrame(draw);
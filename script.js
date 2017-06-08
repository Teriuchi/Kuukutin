var canvas = document.getElementById("canvas"),
       ctx = canvas.getContext("2d");
       
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.backgroundColor = "blue";

var Game = function(){
	this.player = {
		x: 100,
		y: canvas.height,
		w: 52,
	   	h: 60,
		runw: 56,
		runh: 72,
		diry: 1,
		dirx: 1,
		movestat: 1,
		tick: 0,	//frame data starts from here
		idleframe: 0,
		idleframemax: 4,
		idletickmax: 11,
		runframe: 0,
		runframemax: 5,
		runtickmax: 6,
		jumpframe: 0,
		jumpframemax: 6,
		jumptickmax: 6,
		jumplooptickmax: 12,
		deathframe: 0,
		deathframemax: 7,
		deathtickmax: 10,
		attackframe: 0,
		attackframemax: 5,
		attacktickmax: 3, //frame data ends here
		gravity: 0.05,
		gravitySpeed: 0,
		img: null
	};
	this.img = new Image();
	this.img.onload = function() {
		game.player.img = game.img;
	}
	this.img.src = "sprites/player/player_spritesheet.png";
	this.player.playeranimate = function(){
		if (this.img === null)
			return;
		switch(this.movestat){
			case 0:	//idle animation
					ctx.drawImage(this.img,18+(this.idleframe*64),24,26,30,this.x,this.y,this.w,this.h);
					if (this.tick <= this.idletickmax){
						this.tick++;
					}
					else{
						this.tick = 0;
						this.idleframe++;
					}
					if (this.idleframe >= this.idleframemax){
						this.idleframe = 0;
					}
					break;
			case 1:	//run animation
					ctx.drawImage(this.img,18+(this.runframe*64),82,30,36,this.x,this.y-12,this.runw,this.runh);
					if (this.tick <= this.runtickmax){
						this.tick++;
					}
					else{
						this.tick = 0;
						this.runframe++;
					}
					if (this.runframe >= this.runframemax){
						this.runframe = 0;
					}
					break;
			case 2: //jumping animation
					ctx.drawImage(this.img,18+(this.jumpframe*64),338,30,36,this.x,this.y-12,this.runw,this.runh);
					if (this.tick <= this.jumptickmax){
						this.tick++;
					}
					else{
						this.tick = 0;
						this.jumpframe++;
					}
					if (this.jumpframe >= this.jumpframemax){
						this.jumpframe = 6;
					}
					break;
			case 3:	//jumping loop animation
					ctx.drawImage(this.img,18+(this.jumpframe*64),338,30,36,this.x,this.y-12,this.runw,this.runh);
					if (this.tick <= this.jumplooptickmax){
						this.tick++;
					}
					else{
						this.tick = 0;
						if (this.jumpframe <= 5){
							this.jumpframe = 6;
							}
						else
							this.jumpframe--;
					}
					break;
			case 4:	//landing animation
					ctx.drawImage(this.img,18+(7*64),338,30,36,this.x,this.y-12,this.runw,this.runh);
					if (this.tick <= this.jumptickmax){
						this.tick++;
					}
					else{
						this.tick = 0;
						this.jumpframe++;
					}
					break;
			case 5:	//death animation
					ctx.drawImage(this.img,14+(this.deathframe*64),212,34,36,this.x-6,this.y-8,this.runw+10,this.runh);
					if (this.tick <= this.deathtickmax){
						this.tick++;
					}
					else{
						this.tick = 0;
						this.deathframe++;
					}
					if (this.deathframe >= this.deathframemax){
						this.deathframe = 0;
						this.movestat = -1;
					}
					break;
			case 6: //attack animation
					ctx.drawImage(this.img,18+(this.attackframe*64),148,30,36,this.x,this.y-8,this.runw,this.runh);
					if (this.tick <= this.attacktickmax){
						this.tick++;
					}
					else{
						this.tick = 0;
						this.attackframe++;
					}
					if (this.attackframe >= this.attackframemax){
						this.attackframe = 0;
					}
					break;
			default:
		}
	}
	this.player.resetframes = function(){ //implemented for future usage
		this.tick = this.idleframe = this.runframe = this.jumpframe = this.deathframe = this.attackframe = 0;
	}
	
	var obstacles = [];
	
	/*function Obstacle(I) {					//PLACEHOLDER Needs fixing
		I.active = true;
		I.color = "white";
		I.y = 0;
		I.x = 1000;
		I.width = 30;
		I.height = Math.random() * 1000 + 1;
	
		I.inBounds = function() {
			return I.x >= 0 && I.x <= window.width && 
			I.y >= 0 && I.y <= window.height;
		};
	
		I.draw = function() {
			this.draw() = function() {
				canvas.fillStyle = this.color;
				canvas.fillRect(this.x, this.y, this.width, this.height);
			}
		}
		
		I.update = function() {
			I.x -= 1;
			I.y = I.y;
			I.active = I.active & I.inBounds();
		};
	
		return I;
	} */
	
	this.imgcoin = new Image();
	this.imgcoin.src = "sprites/coin/full_coins.png";
	this.Coin = function(coinx, coiny){
		this.x = coinx;
		this.y = coiny;
		this.w = 22.5;
		this.h = 24;
		this.points;
		this.tick = 0;
		this.tickmax = 5;
		this.curframe = 0;
		this.maxframe = 8;
		this.img = game.imgcoin;
		
		this.coinanimate = function(){
			ctx.drawImage(this.img,(this.curframe*16),0,15,16,this.x,this.y,this.w,this.h);
			if (this.tick <= this.tickmax){
				this.tick++;
			}
			else{
				this.tick = 0;
				this.curframe++;
			}
			if (this.curframe >= this.maxframe){
				this.curframe = 0;
			}
		}
	}
		
		window.addEventListener("keydown", function(e) {
			if (!(game.player.movestat === 5)){
				game.key = e.keyCode;
			}
		})
		
		window.addEventListener("keyup", function (e) {
            game.key = false;
        })

	this.animate = function(){
		requestAnimationFrame(game.animate);
		ctx.clearRect(0,0,canvas.width,canvas.height);
		coin.coinanimate(); //in future coins will be animated here, before the player
		game.player.playeranimate();
		
		if(game.player.movestat === 3){
			game.player.gravitySpeed += game.player.gravity;
		}
		
		if(game.key && game.key == 39)	// Right arrow
			{game.player.x += 6;}
			if(game.player.x < 0)
				game.player.x = 0;
		if(game.key && game.key == 37) // Left Arrow
			{game.player.x -= 6;}
				if(game.player.x + game.player.w > canvas.width)
					game.player.x = canvas.width - game.player.w;
		if(game.key && game.key == 38) // Up Arrow
			{game.player.y -= 4;}
				if(game.player.y < 0)
					game.player.y = 0;
		if(game.key && game.key == 40) // Down arrow
			{game.player.y += 4;}
				if(game.player.y > canvas.height)
					game.player.y = canvas.height;
		if(game.key && game.key == 32) //Spacebar
			{game.player.y -= 10;} 
		game.player.y = game.player.y + game.player.gravitySpeed;
		game.player.hitBottom();
	}
	
	this.player.hitBottom = function() {
		var rockbottom = canvas.height - game.player.h;
		if(game.player.y > rockbottom) {
			game.player.y = rockbottom;
		}
	}
		
		/*game.obstacles.forEach(function(game.obstacle) { //PLACEHOLDER Needs fixing
			game.obstacle.update();
		});
		
		game.obstacles = game.obstacle.filter(function(game.obstacle) {
			return game.obstacle.active;
		});
		
		if(game.player.tick == 0){
			game.obstacles.push(Obstacle());
		}
		
		game.obstacle.draw();*/
	
}
var game = new Game();
var coin = new game.Coin(200, 100); //placeholder, remove once coin spawning has been implemented
window.onload = game.animate();

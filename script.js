"use strict";
/////////////////////
//Canvas variables
/////////////////////
var canvas 	= document.getElementById("canvas"),
       ctx 	= canvas.getContext("2d");
canvas.style.position 		= "absolute";
canvas.style.zIndex   		= 1;
canvas.width 				= 1024;
canvas.height 				= window.innerHeight;
var resize = function(){
	window.onresize = function(){
		canvas.style.position 		= "absolute";
		canvas.style.zIndex   		= 1;
		canvas.width 				= 1024;
		canvas.height 				= window.innerHeight;
		game.player.y				= canvas.height - 80;
		if(game.player.x > canvas.width)
			game.player.x = canvas.width - game.player.w;
	};
}
/////////////////////
//The game itself
/////////////////////
var Game = function(){
/////////////////////
//Game variables
/////////////////////
	this.floorTick = 0;
	this.floorTickMax = 95;
	this.coinTick = 0;
	this.coinTickMax = 200;
	this.wallTick = 0;
	this.wallTickMax = 199;
	this.transitioning = false;
/////////////////////
//Start Menu
/////////////////////	
	this.menuDraw = function() {
		ctx.fillStyle = 'black';
		ctx.font = '48px serif';
		ctx.fillText('Kuukutin', (canvas.width/2)-100, 350);
		ctx.font = '24px verdana';
		ctx.fillText('Control Kuukutin by using arrow keys.', (canvas.width/2)-242, (canvas.height/2)-50);	
		ctx.font = '24px';
		ctx.fillText('While midair, you can switch your gravity by pressing Z-key.', (canvas.width/2)-350, (canvas.height/2));
		ctx.font = '24px verdana';
		ctx.fillText('Press spacebar to begin your journey', (canvas.width/2)-240, (canvas.height/2)+150);		
	}
/////////////////////
//Player character
/////////////////////
	this.player = {
		x: 100,
		y: canvas.height - 80,
		y_max: canvas.height - 80,
		w: 52,
	   	h: 60,
		runw: 56,
		runh: 72,
		diry: 1,
		dirx: 0,
		speed: 5,
		jumpspeed: 18,
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
		falling: false,
		jumptimetotal: 0,
		jumping: false,
		jumpCollision: false,
		onground: true,
		gravitytick: 0,
		gravitynegative: 1,
		gravityReversed: false,
		gravityspamblock: false,
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
					if (this.gravityReversed){
						ctx.save();
						ctx.scale(1, -1);
						ctx.drawImage(this.img,18+(this.idleframe*64),24,26,30,this.x,(this.y*-1)-this.h,this.w,this.h);
					}
					else
						ctx.drawImage(this.img,18+(this.idleframe*64),24,26,30,this.x,this.y,this.w,this.h);
					if (this.gravityReversed)
						ctx.restore();
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
					if (this.gravityReversed){
						ctx.save();
						ctx.scale(1, -1);
						ctx.drawImage(this.img,18+(this.runframe*64),82,30,36,this.x,(this.y*-1)-12-this.h,this.runw,this.runh);
					}
					else
						ctx.drawImage(this.img,18+(this.runframe*64),82,30,36,this.x,this.y-12,this.runw,this.runh);
					if (this.gravityReversed)
						ctx.restore();
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
					if (this.gravityReversed){
						ctx.save();
						ctx.scale(1, -1);
						ctx.drawImage(this.img,18+(this.jumpframe*64),338,30,36,this.x,(this.y*-1)-12-this.h,this.runw,this.runh);
					}
					else
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
					if (this.gravityReversed){
						ctx.save();
						ctx.scale(1, -1);
						ctx.drawImage(this.img,18+(this.jumpframe*64),338,30,36,this.x,(this.y*-1)-12-this.h,this.runw,this.runh);
					}
					else
						ctx.drawImage(this.img,18+(this.jumpframe*64),338,30,36,this.x,this.y-12,this.runw,this.runh);
					if (this.gravityReversed)
						ctx.restore();
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
					if (this.gravityReversed){
						ctx.save();
						ctx.scale(1, -1);
						ctx.drawImage(this.img,18+(7*64),338,30,36,this.x,(this.y*-1)-12-this.h,this.runw,this.runh);
					}
					else
						ctx.drawImage(this.img,18+(7*64),338,30,36,this.x,this.y-12,this.runw,this.runh);
					if (this.gravityReversed)
						ctx.restore();
					if (this.tick <= this.jumptickmax){
						this.tick++;
					}
					else{
						this.tick = 0;
						this.jumpframe++;
					}
					game.player.movestat = 1;
					break;
			case 5:	//death animation
					if (this.gravityReversed){
						ctx.save();
						ctx.scale(1, -1);
						ctx.drawImage(this.img,14+(this.deathframe*64),212,34,36,this.x-6,(this.y*-1)-8-this.h,this.runw+10,this.runh);
					}
					else
						ctx.drawImage(this.img,14+(this.deathframe*64),212,34,36,this.x-6,this.y-8,this.runw+10,this.runh);
					if (this.gravityReversed)
						ctx.restore();
					if (this.tick <= this.deathtickmax){
						this.tick++;
					}
					else{
						this.tick = 0;
						this.deathframe++;
					}
					if (this.deathframe >= this.deathframemax){
						this.deathframe = 0;
						location.reload();
					}
					break;
			case 6: //attack animation
					if (this.gravityReversed){
						ctx.save();
						ctx.scale(1, -1);
						ctx.drawImage(this.img,18+(this.attackframe*64),148,30,36,this.x,(this.y*-1)-8-this.h,this.runw,this.runh);
					}
					else
						ctx.drawImage(this.img,18+(this.attackframe*64),148,30,36,this.x,this.y-8,this.runw,this.runh);
					if (this.gravityReversed)
						ctx.restore();
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
/////////////////////
//Obstacles
/////////////////////
	this.obstacles = [];
	this.imgobs = new Image();
	this.imgobs.src = "sprites/obstacles/brick_2.png";
	this.Obstacle = function(oy, oh){
		this.x = canvas.width + 85;
		this.y = oy;
		this.w = 100;
		this.h = oh;
		this.img = game.imgobs;
		
			
	}
	this.Obstacle.prototype.collision = function(){
		if (this.x < -1300){
			for(var i = 0; i < game.obstacles.length; i++) {
				if (game.obstacles[i].x === this.x && game.obstacles[i].y === this.y){
					game.obstacles.splice(i,1);
					break;
				}
			}
		}
	};
	this.Obstacle.prototype.moveWall = function(){
		this.x -= 5;
		ctx.drawImage(this.img, 4, 0, 100, this.h, this.x, this.y, 100, this.h);
	};
	this.spawnWall = function(){
		if(game.wallTick >= game.wallTickMax){
			let h = Math.ceil((Math.random()*4));
			h = h*50;
			let rng = Math.random();
			if(rng > 0.5){
				var newObs = new game.Obstacle(canvas.height-20-h, h);
			} else{
				var newObs = new game.Obstacle(20, h);
			}
			game.obstacles.push(newObs);
			game.wallTick = 0;
		}
		else{
			game.wallTick++;
		}
	}
	
	this.floors = function(){
		let canvasBlocks = Math.ceil(canvas.width / 100) +1;
		for (let x=0;x<canvasBlocks;x++){
			
				ctx.drawImage(this.imgobs, 4, 0, 100, 50, (x*100) - game.floorTick, canvas.height-20, 100, 50);
		}
		for (let x=0;x<canvasBlocks;x++){
			
				ctx.drawImage(this.imgobs, 4, 0, 100, 50, (x*100) - game.floorTick, -30, 100, 50);
		}
		if(game.floorTick >= game.floorTickMax){
			game.floorTick = 0;
		}
		else{
			game.floorTick += 5;
		}
	}
////////////////////////
//Collision
////////////////////////
	this.Obstacle.prototype.collision = function(){
		if (game.player.x+game.player.w-5 >= this.x && game.player.y+game.player.h >= this.y+5 && game.player.x <= this.x+this.w && game.player.y <= this.y +this.h-5)
			switch(game.player.dirx){
				case -1:
							break;
				case 0: game.player.x -= game.player.speed;
						game.player.movestat = 0;
							break;
				case 1: game.player.x -= game.player.speed*2;
						game.player.movestat = 0;
							break;
				default:
			}
		//This still needs some work to account for multiple blocks
		if (game.player.falling === true && game.player.jumptimetotal >= 18){
			if (game.player.x+game.player.w-5 >= this.x && game.player.y+game.player.h >= this.y && game.player.x <= this.x+this.w-10 && game.player.y <= this.y +this.h && game.player.gravityReversed === false){
				game.player.onground = true;
				game.player.y = this.y-60;
				game.player.jumptimetotal = 0;
				game.player.falling = false;
				game.player.jumping = false;
				game.player.movestat = 1;
				game.player.gravityspamblock = false;
				game.player.diry = 0;
				game.player.jumpCollision = true;
			}
			if (game.player.x+game.player.w-5 >= this.x && game.player.y+game.player.h >= this.y && game.player.x <= this.x+this.w-10 && game.player.y <= this.y +this.h && game.player.gravityReversed === true){
				game.player.onground = true;
				game.player.y = this.y+this.h;
				game.player.jumptimetotal = 0;
				game.player.falling = false;
				game.player.jumping = false;
				game.player.movestat = 1;
				game.player.gravityspamblock = false;
				game.player.diry = 0;
				game.player.jumpCollision = true;
			}
		}
	};
	
	this.Obstacle.prototype.collisionReset = function(){
		if(game.player.jumpCollision){
			if (!(game.player.x+game.player.w-5 >= this.x && game.player.y+game.player.h >= this.y && game.player.x <= this.x+this.w-10 && game.player.y <= this.y +this.h)){
				game.player.onground = false;
				game.player.falling = true;
				game.player.jumptimetotal = 18;
				game.player.jumpCollision = false;
			}
		}
	}
/////////////////////
//Coins
/////////////////////	
	this.coins = [];
	this.imgcoin = new Image();
	this.imgcoin.src = "sprites/coin/full_coins.png";
	this.Coin = function(coinx, coiny){
		this.x = coinx;
		this.y = coiny;
		this.w = 22.5;
		this.h = 24;
		this.points = 10;
		this.tick = 0;
		this.tickmax = 5;
		this.curframe = 0;
		this.maxframe = 8;
		this.disappear = 0;
		this.disappearMax = 30;
		this.transparency = 1;
		this.timeToDie = false;
		this.img = game.imgcoin;	
	}
	this.Coin.prototype.coinanimate = function(){
			ctx.globalAlpha = this.transparency;
			ctx.drawImage(this.img,(this.curframe*16),0,15,16,this.x,this.y,this.w,this.h);
			ctx.globalAlpha = 1;
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
			this.x -=2.5;
		};
	this.Coin.prototype.collect = function(){
			if (this.x+(this.w/2) < game.player.w+game.player.x && this.x+(this.w/2) > game.player.x && this.y+(this.h/2) < game.player.y+game.player.h && this.y+(this.h/2) > game.player.y){
				if (this.points === 10){
					game.score.addingTime = true;
					game.score.addTick = 0;
					game.score.scoreAdd += 10;
					game.score.scoreTrans = 1;
					game.score.multiplier += 0.1;
					game.score.multiplier = game.score.multiplier * 10;
					game.score.multiplier = Math.floor(game.score.multiplier);
					game.score.multiplier = game.score.multiplier/10;
				}
				this.points = 0;
				this.timeToDie = true;
			}
			if (this.x+this.w < 0){
				for(var i = 0; i < game.coins.length; i++) {
					if (game.coins[i].x === this.x){
						game.coins.splice(i,1)
						break;
					}
				}
			}
			if (this.timeToDie){
				if (this.disappear >= this.disappearMax){
					for(var i = 0; i < game.coins.length; i++) {
						if (game.coins[i].x === this.x){
							game.coins.splice(i,1)
							break;
						}
					}
				}
				else{
					this.y -= 1.5*game.player.gravitynegative;
					this.disappear++;
					this.transparency -= 0.03333333
				}
			}
		};
	this.spawncoin = function(){
		if(game.coinTick >= game.coinTickMax){
			let canvasheight = Math.ceil(canvas.height/7)
			let newCoin = new game.Coin(canvas.width, Math.ceil(Math.random()*6)*canvasheight - 12);
			game.coins.push(newCoin);
			game.coinTick = Math.random()*190;
		}
		else{
			game.coinTick++;
		}
	}
/////////////////////
//Background
/////////////////////
	this.imgbackgroundbase = new Image();
	this.imgbackgroundbase.src = "sprites/background/cave_layermain.png";
	this.imgbackgroundmiddle = new Image();
	this.imgbackgroundmiddle.src = "sprites/background/cave_layermid.png";
	this.imgbackgroundback = new Image();
	this.imgbackgroundback.src = "sprites/background/cave_layerback.png";
	this.Background = function(speedx){
		this.speed = speedx;
		this.x = 0;
		this.y = 0;
		this.img;
		this.draw = function(){
			this.x -= this.speed;
			ctx.drawImage(this.img, 0, 0, 1024, 1024, this.x, this.y, 1024, canvas.height);
			ctx.drawImage(this.img, 0, 0, 1024, 1024, this.x + 1024, this.y, 1024, canvas.height);
			if (this.x <= 0 - canvas.width){
				this.x = 0;
			}
		}
	}
//////////////////////////
//Score
//////////////////////////
	this.score = {
		scoreTick: 0,
		scoreTickMax: 40,
		x: 5,
		y: 45,
		font: "30px Courier New",
		color: "white",
		score: 0,
		scoreAdd: 0,
		scoreTrans: 1,
		addTick: 0,
		addTickMax: 150,
		addingTime: false,
		multiplier: 0.9,
		scoreReserve: 0
	};
	
	this.score.draw = function(){
		ctx.fillStyle = this.color;
		ctx.font = this.font;
		ctx.fillText("Score: "+this.score,this.x,this.y);
		if(game.score.scoreTick < game.score.scoreTickMax){
			game.score.scoreTick++;
		}else{
			game.score.score = game.score.score + 1;
			game.score.scoreTick = 0;
		}
	}
	this.score.increase = function(){
		if (this.addTick >= this.addTickMax){
			this.scoreReserve += Math.ceil(this.scoreAdd * this.multiplier);
			this.addTick = 0;
			this.addingTime = false;
			this.scoreAdd = 0;
			this.scoreTrans = 1;
			this.multiplier = 0.9;
		}
		else{
			this.addTick++;
			ctx.fillStyle = this.color;
			ctx.font = this.font;
			ctx.globalAlpha = this.scoreTrans;
			ctx.fillText("Score: "+this.score +" +"+this.scoreAdd +" x" + this.multiplier,this.x,this.y);
			ctx.globalAlpha = 1;
			this.scoreTrans -= 0.0066666667;
		}
	}
	this.score.moarPoints = function(){
		if (this.scoreReserve > 0){
			this.score++;
			this.scoreReserve--;
		}
	}
		
////////////////////////
//Movement
////////////////////////
	this.player.movement = function(){
		if (game.player.movestat === 5){
			
		}
		else{
			switch(this.dirx){
				case -1:this.movestat = 0; 
					if(this.x <= 4){
							this.x = 4;
						 }
							this.x -= this.speed;
							break;
				case 0: this.movestat = 1;
					break;
				case 1: this.movestat = 1;
					if(this.x >= canvas.width - this.runw){
							this.x = canvas.width - this.runw;
						}
							this.x += this.speed;
							break;
				default:
			}
			if (this.onground === false){
				this.movestat = 3;
				if (this.falling === false){
					this.jumptimetotal += 0.4;
					this.diry = -1 * this.gravitynegative;
					this.y -= (this.jumpspeed - this.jumptimetotal)*this.gravitynegative;
					if (this.jumptimetotal === this.jumpspeed){
						this.falling = true;
					}
				}
				else{
					this.diry = 1 * this.gravitynegative;
					this.jumptimetotal += 0.8;
					this.y += (this.jumptimetotal - this.jumpspeed)*this.gravitynegative;
				}
			}
			if (this.falling === true){
				if (this.y+this.h >= canvas.height - 20 && this.gravityReversed === false){
					this.onground = true;
					this.y = canvas.height-this.h - 20;
					this.jumptimetotal = 0;
					this.falling = false;
					this.jumping = false;
					this.movestat = 1;
					this.gravityspamblock = false;
					this.diry = 0;
				}
				if (this.y <= 20 && this.gravityReversed === true){
					this.onground = true;
					this.y = 20;
					this.jumptimetotal = 0;
					this.falling = false;
					this.jumping = false;
					this.movestat = 1;
					this.gravityspamblock = false;
					this.diry = 0;
				}
			}
		}
	}
/////////////////////
//Controls
/////////////////////

window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return;
  }

  switch (event.which) {
     case 90: if (game.player.jumping === true && game.player.gravityspamblock === false){ //Z key
				game.player.gravityspamblock = true;
				game.player.jumptimetotal = 0;
			 if(game.player.gravityReversed){
				game.player.gravityReversed = false;
			 }
			 else{
				game.player.gravityReversed = true;
			 }
				game.player.gravitynegative = game.player.gravitynegative*-1;
			 }
			 break;
    case 37: game.player.dirx = -1; //Left Arrow
			 break;
    case 38: if(game.player.onground){ //Up Arrow
				game.player.jumpCollision = false;
				game.player.onground = false;
				game.player.jumping = true;
			 }
			 break;
    case 39: game.player.dirx = 1; // Right Arrow
		break;
    case 40: game.spawncoin();
		break;
    default:
      return;
  }
  event.preventDefault();
}, true);

window.addEventListener("keyup", function (event) {
  if (event.defaultPrevented) {
    return;
  }

  switch (event.which) {
    case 32: game.transitioning = true;
		break;
    case 37:if (game.player.dirx === -1) 
					game.player.dirx = 0;
		break;
    case 38:
			game.player.falling = true;
		break;
    case 39: if (game.player.dirx === 1) 
					game.player.dirx = 0;
		break;
    case 75: game.player.movestat = 5;
		break;
    default:
      return;
  }
  event.preventDefault();
}, true);
////////////////////////
//Animation
////////////////////////

	this.animate = function(){
		requestAnimationFrame(game.animate);
		backgroundbase.draw();
		backgroundmid.draw();
		backgroundback.draw();
		game.floors();
		game.player.movement();
		game.player.playeranimate();
		if(game.transitioning === true){
			game.spawnWall();
			game.obstacles.forEach(function(item) {
				item.moveWall();
				item.collision();
				item.collisionReset();
			});
			game.spawncoin();
			game.coins.forEach(function(item) {
				item.coinanimate();
				item.collect();
			});
			game.score.draw();
			if(game.score.addingTime)
				game.score.increase();
			game.score.moarPoints();
		} else {
			game.menuDraw();
		}
	}
}
/////////////////////////
//Current initialization
/////////////////////////
var game = new Game();
var backgroundbase = new game.Background(1);
	backgroundbase.img = game.imgbackgroundback;
var backgroundmid = new game.Background(2);
	backgroundmid.img = game.imgbackgroundmiddle;
var backgroundback = new game.Background(3);
	backgroundback.img = game.imgbackgroundbase;
window.onload = game.animate();

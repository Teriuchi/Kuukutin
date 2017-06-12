"use strict";
/////////////////////
//Canvas variables
/////////////////////
var canvas 	= document.getElementById("canvas"),
       ctx 	= canvas.getContext("2d");
var	bg 	= document.createElement('canvas'),
	bgtx	= bg.getContext('2d');   
canvas.style.position 		= "absolute";
canvas.style.zIndex   		= 1;
canvas.width 				= window.innerWidth;
canvas.height 				= window.innerHeight;
bg.style.position 			= "absolute";
bg.style.zIndex   			= -1;
bg.style.backgroundColor 		= "#758a88";
bg.width				= window.innerWidth;
bg.height				= window.innerHeight;
document.body.appendChild(bg);
/////////////////////
//The game itself
/////////////////////
var Game = function(){
/////////////////////
//Player character
/////////////////////
	this.player = {
		x: 100,
		y: canvas.height - 60,
		y_max: canvas.height - 60,
		w: 52,
	   	h: 60,
		runw: 56,
		runh: 72,
		diry: 1,
		dirx: 0,
		speed: 7,
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
						this.movestat = -1;
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
	var obstacles = [];
	
/////////////////////
//Coins
/////////////////////	
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
			bgtx.drawImage(this.img, 0, 0, 2000, 2000, this.x, this.y, bg.width, bg.height);
			bgtx.drawImage(this.img, 0, 0, 2000, 2000, this.x + canvas.width, this.y, bg.width, bg.height);
			if (this.x <= 0 - canvas.width){
				this.x = 0;
			}
		}
	}
//////////////////////////
//Score & Event Listeners
//////////////////////////
	this.score = {
		scoreTick: 0,
		scoreTickMax: 40,
		x: 5,
		y: 35,
		font: "30px Courier New",
		color: "white",
		score: 0
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
		window.addEventListener("keydown", function(e) {
			if(e.repeat)
				return;
			if (!(game.player.movestat === 5)){
				game.key = e.keyCode;
			}
		})
		
		window.addEventListener("keyup", function (e) {
		   game.key = false;
		   if(e.repeat)
			   return;
        })
		
////////////////////////
//Movement
////////////////////////
	this.player.movement = function(){
		switch(this.dirx){
			case -1: this.x -= this.speed;
					break;
			case 0:
					break;
			case 1: this.x += this.speed;
					break;
			default:
		}
		if (this.onground === false){
			if (this.falling === false){
				this.jumptimetotal += 0.4;
				this.y -= (this.jumpspeed - this.jumptimetotal)*this.gravitynegative;
				if (this.jumptimetotal === this.jumpspeed){
					this. falling = true;
				}
			}
			else{
				this.jumptimetotal += 0.8;
				this.y += (this.jumptimetotal - this.jumpspeed)*this.gravitynegative;
			}
		}
		if (this.falling === true){
			if (this.y+this.h >= canvas.height){
				this.onground = true;
				this.y = canvas.height-this.h;
				this.jumptimetotal = 0;
				this.falling = false;
				this.jumping = false;
				this.movestat = 1;
			}
			if (this.y <= 0){
				this.onground = true;
				this.y = 0;
				this.jumptimetotal = 0;
				this.falling = false;
				this.jumping = false;
				this.movestat = 1;
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
    case 32: 	
			if (game.player.jumping === true && game.player.gravityspamblock === false){
				game.player.gravityspamblock = true;
				if(game.player.gravityReversed){
					game.player.gravityReversed = false;
				}
				else{
					game.player.gravityReversed = true;
				}
				game.player.gravitynegative = game.player.gravitynegative*-1;
			}
		break;
    case 37: game.player.dirx = -1;
		break;
    case 38:if(game.player.onground){
			game.player.onground = false;
			game.player.jumping = true;
			game.player.movestat = 3;
		}
		break;
    case 39: game.player.dirx = 1;
		break;
    case 40:
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
    case 32: game.player.gravityspamblock = false;
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
    case 40:
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
		ctx.clearRect(0,0,canvas.width,canvas.height);
		bgtx.clearRect(0,0,canvas.width,canvas.height);
		backgroundbase.draw();
		backgroundmid.draw();
		backgroundback.draw();
		game.score.draw();
		coin.coinanimate(); //in future coins will be animated here, before the player
		game.player.movement();
		game.player.playeranimate();
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
var coin = new game.Coin(200, 100); //placeholder, remove once coin spawning has been implemented
window.onload = game.animate();

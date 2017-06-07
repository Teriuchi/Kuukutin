var canvas = document.getElementById("canvas"),
       ctx = canvas.getContext("2d");
       
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/*function Obstacle(I) {					PLACEHOLDER
	I.active = true;
	I.color = "white";
	I.y = 0;
	I.width = 30;
	I.height = Math.random() * 1000 + 1;
	
	I.draw = function() {
		this.draw()
	}
}*/

Game = function(){
	this.player = {
       x: 100,
       y: 100,
       w: 52,
	   h: 60,
	   runw: 56,
	   runh: 72,
	   diry: 1,
	   dirx: 1,
	   movestat: 1,
	   idleframe: 0,
	   idleframemax: 3,
	   idletick: 0,
	   idletickmax: 11,
	   runframe: 0,
	   runframemax: 5,
	   runtick: 0,
	   runtickmax: 6,
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
			case 0:	
					ctx.drawImage(this.img,18+(this.idleframe*64),24,26,30,this.x,this.y,this.w,this.h);
					if (this.idletick <= this.idletickmax){
						this.idletick++;
					}
					else{
						this.idletick = 0;
						this.idleframe++;
					}
					if (this.idleframe >= this.idleframemax){
						this.idleframe = 0;
					}
					break;
			case 1:	
					ctx.drawImage(this.img,18+(this.runframe*64),82,30,36,this.x,this.y-12,this.runw,this.runh);
					if (this.runtick <= this.runtickmax){
						this.runtick++;
					}
					else{
						this.runtick = 0;
						this.runframe++;
					}
					if (this.runframe >= this.runframemax){
						this.runframe = 0;
					}
					break;
			default:
		}
	}
		
		window.addEventListener("keydown", function(e) {
			game.key = e.keyCode;
		})
		
		window.addEventListener("keyup", function (e) {
            game.key = false;
        })

	this.animate = function(){
		requestAnimationFrame(game.animate);
		ctx.clearRect(0,0,canvas.width,canvas.height);
		game.player.playeranimate();
		
		if(game.key && game.key == 39) // Right arrow
			{game.player.x += 2;}
		if(game.key && game.key == 37) // Left Arrow
			{game.player.x -= 2;}
		if(game.key && game.key == 38) // Up Arrow
			{game.player.y -= 4;}
		if(game.key && game.key == 40) // Down arrow
			{game.player.y += 4;}
		if(game.key && game.key == 32) //Spacebar
			{game.player.y -= 10;} 
		}
	
}
var game = new Game();
window.onload = game.animate();

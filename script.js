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


function controls() {
	if(event.keyCode == 39) // Right arrow
		this.player.x += 1;
	if(event.keyCode == 37) // Left Arrow
		this.player.x -= 1;
	if(event.keyCode == 38) // Up Arrow
		this.player.y -= 4;
	if(event.keyCode == 40) // Down arrow
		this.player.y += 4;
	if(event.keyCode == 32) //Spacebar
		this.player.y += 40; 
}

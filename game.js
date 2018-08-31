var theGame;

window.onload = function() {

//Global Variables
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var theInt;

class Game{
    constructor () {
        this.player = new Player();
        this.obstacles = [];
    }

    obstacleCollisionCheck() {
        this.obstacles.forEach((eachObstacle, i) => {
            var scoreDiv = document.getElementsByClassName("total-score")[0]
            var totalScore = Number(scoreDiv.innerHTML);
            var theTimer = timer.innerHTML;
            var healthDiv = document.getElementsByClassName("total-health")[0]
            var totalHealth = Number(healthDiv.innerHTML);
            var healthBar = document.getElementsByClassName("bar")[0]
            var healthWidth = healthBar.style.width.slice(0, -1);
           
            if ((this.player.x + this.player.width >= eachObstacle.x && this.player.x <= eachObstacle.x + eachObstacle.width) &&
                (this.player.y + this.player.height >= eachObstacle.y && this.player.y <= eachObstacle.y + eachObstacle.height)){
                if(eachObstacle.imgsrc === 'images/mushroom-obstacle.png'){
                    this.obstacles.splice(i , 1);
                    this.player.score += 5;
                    scoreDiv.innerHTML = (totalScore + 5);
                } else if (eachObstacle.imgsrc === 'images/sapling-obstacle.png') {
                    this.obstacles.splice(i , 1);
                    this.player.health -= 10;
                    healthDiv.innerHTML = (totalHealth - 10);
                    healthBar.style.width = `${Number(healthWidth) - 10}%`
                        if (totalHealth === 10) {
                            healthDiv.innerHTML = (totalHealth - 10);
                            setTimeout(() => {
                                alert("Game Over! You played for " + `${theTimer}` + " and Your final score is " + `${totalScore}` + "." + " Click OK to play again.");
                                window.location.reload();
                            }, 1000)
                        }
                }      
            }
            if(eachObstacle.x === -75) {
                this.obstacles.pop(eachObstacle);
            } 
            
        })
    }
        
    drawEverything() {
        this.player.drawPlayer();
        this.obstacles.forEach((oneObsticle) => {
            oneObsticle.drawObstacle();
        })
    }
    
    generateNewObstacle() {
        const theX = 750;
        const theY = Math.floor(Math.random()*275);

        this.obstacles.unshift(new Obstacle(theX, theY))
        this.obstacles[0].moveObstacle();
    }
}

class Player {
    constructor(){
        this.x = 40;
        this.y = 250;
        this.width = 65;
        this.height = 80;
        this.img = 'images/teemo-player.png';
        this.score = 0;
        this.health = 100;
    }
    
    drawPlayer() {
        var img = new Image();
        img.src = this.img;
        ctx.drawImage(img, this.x, this.y,this.width, this.height);
    }
        
        movePlayer(number) {
            switch(number){
                case 37:
                if (this.x > 0) {
                    this.img = 'images/teemo-player-left.png'
                    this.x -= 5;
                }break;
                case 39:
                if (this.x < canvas.width-75){
                    this.x += 5;
                    this.img = 'images/teemo-player.png'
                }else{
                    this.x += 0;
                }
            }
        }
        
        jumpPlayer(keyCode) {
            clearInterval(theInt);
            if (keyCode === 32) {
                if (this.y > 50){
                    this.y -= 50;            
                    theInt = setInterval(() => {
                        if(this.y < 250){
                            this.y += 5    
                        }
                    }, 50);
                }else{
                    this.y=50;  
                    theInt = setInterval(() => {
                        if(this.y < 250){
                            this.y += 5    
                        }
                    }, 50);             
                }
            } 
        } 
}        

class Obstacle {
     constructor(theX, theY) {
        this.x = theX;
        this.y = theY;
        this.width = 50;
        this.height = 50;
        this.image = ['images/mushroom-obstacle.png', 'images/sapling-obstacle.png']
        this.imgsrc = this.image[Math.floor(Math.random() * 2)]
    }
    
    drawObstacle() {
        var theImage = new Image();
        theImage.src = this.imgsrc;
                ctx.drawImage(theImage, this.x, this.y, 45, 40);
    }
        
    moveObstacle() {
        setInterval(() => {
            this.x-=1;
        }, 15);
    }
}
    
let frames = 0;
    
function animate() {
        ctx.clearRect(0,0,800,400);
        theGame.drawEverything();
        if(frames % 75 === 0) theGame.generateNewObstacle();
        theGame.obstacleCollisionCheck();
        frames++;
    window.requestAnimationFrame(animate);
}

function bgScroll() {
    let bgPos = canvas.style.backgroundPositionX.slice(0, -1);
    canvas.style.backgroundPositionX = `${Number(bgPos) + .65}%`;
    window.requestAnimationFrame(bgScroll);
}

//Timer functions
let timer = document.getElementById('timer');
let seconds = 0;
let minutes = 0;
let t;
function addTime() {
    seconds++;
    if(seconds >= 60){
        seconds =  0;
        minutes++;
    }
    timer.innerHTML = (minutes? (minutes > 9? minutes : "0" + minutes) : "00") +":"+ (seconds? (seconds > 9? seconds : "0" + seconds) : "00")
    theTimer();
}

function theTimer() {
    t = this.setTimeout(addTime, 1000);
}

//Audio 
//play on start
function play(){
    let audio = document.getElementById('audio');
        audio.play();
}

//play/pause toggle
let playPause = document.getElementById('play-pause');
let btnImg = document.querySelector('#play-pause img')

playPause.addEventListener('click', function() {
    if(audio.paused === true) {
        audio.play();
        btnImg.src = "images/mushroom-obstacle.png";
    } else if (audio.paused === false) {
        audio.pause();
        btnImg.src = "images/sapling-obstacle.png";
    }
})

function startGame() {
    theGame = new Game();
}


document.getElementById("btn-start").onclick = function() {
    startGame();
    animate();
    bgScroll();
    theTimer();
    play();
}

document.onkeydown = function(e) {
    e.preventDefault();
    var move = e.keyCode;
    if (move === 37 || move === 39){
        theGame.player.movePlayer(move);
    }
    if (move === 40){
        theGame.player.movePlayer(move);
    }
    if (move === 32) {
        theGame.player.jumpPlayer(move);
    }
}

}
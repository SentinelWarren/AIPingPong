// (c) SentinelWarren

var ballX = 75;
var ballY = 75;
var ballSpeedX = 5;
var ballSpeedY = 7;

const BRICK_WIDTH = 80;
const BRICK_HEIGHT = 20;
const BRICK_GAP = 2;
const BRICK_COLS = 10;
const BRICK_ROWS = 14;
var brickGrid = new Array(BRICK_COLS * BRICK_ROWS);

const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 15;
const PADDLE_EDGE_DIST = 60;
var paddleX = 400;

var canvas, canvasContext;

var mouseX = 0;
var mouseY = 0;

function updateMousePosition(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;

    mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseY = evt.clientY - rect.top - root.scrollTop;

    paddleX = mouseX - PADDLE_WIDTH;
}

function brickReset() {
    for(var i=0;i<BRICK_COLS * BRICK_ROWS;i++) {
        brickGrid[i] = true;
    }
}

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    var framesPerSec = 30;
    setInterval(upadteAll, 1000/framesPerSec);

    canvas.addEventListener('mousemove', updateMousePosition);

    brickReset();

}

function upadteAll() {
    moveAll();
    drawAll();
}

function ballReset(){
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

function ballMove() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    
    //left
    if(ballX < 0) {
        ballSpeedX *= -1;
    }

    //right
    if(ballX > canvas.width) {
        ballSpeedX *= -1;
    }

    //top
    if(ballY < 0) { 
        ballSpeedY *= -1;
    }

    //bottom
    if(ballY > canvas.height) {
        ballReset();
    }
}

function ballBrickHandling() {
    var ballBrickCol = Math.floor(ballX / BRICK_WIDTH);
    var ballBrickRow = Math.floor(ballY / BRICK_HEIGHT);
    var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);
    

    if(ballBrickCol >= 0 && ballBrickCol < BRICK_COLS && ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS) {
        if(brickGrid[brickIndexUnderBall]) {
            brickGrid[brickIndexUnderBall] = false;

            var prevBallX = ballX - ballSpeedX;
            var prevBallY = ballY - ballSpeedY;
            var prevBrickCol = Math.floor(prevBallX / BRICK_WIDTH);
            var prevBrickRow = Math.floor(prevBallY / BRICK_HEIGHT);

            var bothTestFailed = true;

            if(prevBrickCol != ballBrickCol) {
                var adjBrickSide = rowColToArrayIndex(prevBrickCol, ballBrickRow);

                if(brickGrid[adjBrickSide] == false) {
                    ballSpeedX *= -1;
                    bothTestFailed = false;
                }
            }

            if(prevBrickRow != ballBrickRow) {
                var adjBrickTopBtm = rowColToArrayIndex(ballBrickCol, prevBrickRow);

                if(brickGrid[adjBrickTopBtm] == false) {
                    ballSpeedY *= -1;
                    bothTestFailed = false;
                }
            }

            if(bothTestFailed) {
                ballSpeedX *= -1;
                ballSpeedY *= -1;
            }
            
        }
    }
}

function ballPaddleHandling() {
    var paddleTopEdgeY = canvas.height - PADDLE_EDGE_DIST;
    var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
    var paddleLeftEdgeX = paddleX;
    var paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH;
    if( ballY > paddleTopEdgeY &&
        ballY < paddleBottomEdgeY && 
        ballX > paddleLeftEdgeX &&
        ballX < paddleRightEdgeX) {

        ballSpeedY *= -1;

        var centerOfPaddleX = paddleX + PADDLE_WIDTH/2;
        var ballDistFrmPaddleCenterX = ballX - centerOfPaddleX;
        ballSpeedX = ballDistFrmPaddleCenterX * 0.35;
    }
}

function moveAll() {

    ballMove();

    ballBrickHandling();

    ballPaddleHandling();
}

function rowColToArrayIndex(col, row) {
    return col + BRICK_COLS * row;
}

function drawBricks() {
    for(var eachRow=0;eachRow<BRICK_ROWS;eachRow++) {
        for(var eachCol=0;eachCol<BRICK_COLS;eachCol++) {

            var arrayIndex = rowColToArrayIndex(eachCol, eachRow);

            if(brickGrid[arrayIndex]) {
                colorRect(BRICK_WIDTH*eachCol,BRICK_HEIGHT*eachRow, BRICK_WIDTH-BRICK_GAP,BRICK_HEIGHT-BRICK_GAP, '#FC4A1A')
            }
        }
    }
}

function drawAll() {
    colorRect(0,0, canvas.width,canvas.height, '#3AAFA9'); //clean screen

    colorCircle(ballX,ballY, 10, '#17252A'); //draw ball

    colorRect(paddleX, canvas.height - PADDLE_EDGE_DIST, PADDLE_WIDTH,PADDLE_THICKNESS, '#17252A');

    drawBricks();

}

function colorRect(topLeftX,topLeftY, boxWidth,boxHeight, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
}

function colorCircle(centerX,centerY, radius, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX,centerY, radius, 0,Math.PI*2, true);
    canvasContext.fill();

}

function colorText(showWords, textX,textY, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillText(showWords, textX,textY);
}
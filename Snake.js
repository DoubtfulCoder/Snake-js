document.addEventListener('keydown', update);

const canvas = document.getElementById("frame");
const ctx = canvas.getContext("2d");
let score = 0;
let gameSpeed = 100;

let direction = "";
let xSpeed = 0;
let ySpeed = 0;

let enemyX;
let enemyY;

let coords = [[0,0]]; // coords of snake TODO : switch to snakeCoords
let possibleCoords = []; // possible coordinates for enemy
for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
        possibleCoords.push([i*40, j*40]);
    }
}
console.log(possibleCoords);


drawInit() // TODO : remove
drawNewEnemy();
const gameTimer = setInterval(drawCanvas, gameSpeed);

/* Draws enemy at random pos */
function drawNewEnemy() {
    // let possibleXs = [], possibleYs = []; // for avoiding spawn on top of snake
    // let notPossibleXs = [], notPossibleYs = [];
    // for (let i = 0; i < 14; i++) {
    //     possibleXs[i] = i*40;
    //     possibleYs[i] = i*40;
    // }
    // for (let i = 0; i < coords.length; i++) {
    //     notPossibleXs.push(coords[i][0]);
    //     notPossibleYs.push(coords[i][1]);
    // }
    console.log("Old len: " + possibleCoords.length);
    newPosCoords = possibleCoords.filter(coord => coords.indexOf(coord) === -1);
    console.log("New len: " + newPosCoords.length);
    // newPosXs = possibleXs.filter(x => coords.indexOf(x) === -1);
    // newPosXs = possibleYs.filter(y => coords.indexOf(y) === -1);
    
    // enemyX = Math.floor(Math.random() * 15) * 40;
    // enemyY = Math.floor(Math.random() * 15) * 40;
    let enemyCoords = newPosCoords[Math.floor(Math.random() * 225)];
    // enemyX = possibleXs[Math.floor(Math.random() * possibleXs.length)];
    // enemyY = possibleYs[Math.floor(Math.random() * possibleYs.length)];
    enemyX = enemyCoords[0];
    enemyY = enemyCoords[1];
    ctx.fillStyle = "red";
    ctx.fillRect(enemyX, enemyY, 40, 40);
    console.log("drew enemy");
}

function drawInit() {
    // ctx.fillStyle = "green"
    // ctx.fillRect(0, 0, 120, 40);
}

function drawCanvas() {
    addHead(); // add head before erase tail to avoid empty list iter 1
    eraseTail(); // TODO : erase tail

    // ctx.clearRect(coords[score][0], coords[score][1], 40, 40);
    // coords[score][0]+=xSpeed;
    // coords[score][1]+=ySpeed;

    let currentX = getHeadX();
    let currentY = getHeadY();

    // if (currentX < 0 || currentX >= 600 || currentY < 0 || currentY >= 600) {
    if (checkGameOver()) {
        console.log("Game over!");
        document.getElementById("game-over").style.display = 'block';
        clearInterval(gameTimer);
        document.removeEventListener('keydown', update);
    }

    // // TODO : draw front
    // ctx.fillStyle = "green";
    // ctx.fillRect(currentX, currentY, 40, 40);
    drawHead();

    console.log(currentX);
    console.log(enemyX);

    if (currentX === enemyX && currentY === enemyY) {
        score++;
        addToTail();
        // coords.unshift([0, 0]);
        document.getElementById("score").textContent = "Score: " + score;
        drawNewEnemy();
    }
}

function update(e) {
    if (e.keyCode == 37) { // left arrow
        if (direction !== "right" && direction !== "left") {
            xSpeed = -40;
            ySpeed = 0;
            direction = "left";
            drawCanvas();
        }
    }
    else if (e.keyCode == 38) { // up arrow
        if (direction !== "down" && direction !== "up") {
            xSpeed = 0;
            ySpeed = -40;
            direction = "up";
            drawCanvas();
        }
    }
    else if (e.keyCode == 39) { // right arrow
        if (direction !== "left" && direction !== "right") {
            xSpeed = 40;
            ySpeed = 0;
            direction = "right";
            drawCanvas();
        }
    }
    else if (e.keyCode == 40) { // down arrow
        if (direction !== "up" && direction !== "down") {
            xSpeed = 0;
            ySpeed = 40;
            direction = "down";
            drawCanvas();
        }
    }
}

/* Adds to tail based on current direction of piece */
function addToTail() {
    const x = getTailX();
    const y = getTailY();
    coords.unshift([x-xSpeed, y-ySpeed]);
    // if (direction === "left") {
    //     coords.unshift([x + 40, y]);
    // }
    // else if (direction === "right") {
    //     coords.unshift([x - 40, y]);
    // }
    // else if (direction === "up") {
    //     coords.unshift([x + 40, y]);
    // }
    // else if (direction === "down") {
        
    // }
}

/* Draws head */
function addHead() {
    coords.push([getHeadX()+xSpeed, getHeadY()+ySpeed]);
    // Removes element at coordinate x*15 + y
    // possibleCoords.splice(getHeadX)
}

/* Erases tail */
function eraseTail() {
    ctx.clearRect(getTailX(), getTailY(), 40, 40);
    let removedElement = coords.shift();
    // Adds back in coordinate at x*15 + y 
    // possibleCoords.splice(removedElement[0]*15+removedElement[1], 0, removedElement); 
}

/* Draws head */
function drawHead() {
    ctx.fillStyle = "green";
    ctx.fillRect(getHeadX(), getHeadY(), 40, 40);
}

/* Returns x-coordinate of tail */
function getTailX() {
    return coords[0][0];
}

/* Returns y-coordinate of tail */
function getTailY() {
    return coords[0][1];
}

/* Returns x-coordinate of head */
function getHeadX() {
    return coords[coords.length-1][0];
}

/* Returns y-coordinate of head */
function getHeadY() {
    return coords[coords.length-1][1];
}

/* Checks if game over: head biting tail or snake out of bounds */
function checkGameOver() {
    // Checks out of bounds
    let headX = getHeadX(), headY = getHeadY();
    if (headX < 0 || headX >= 600 || headY < 0 || headY >= 600) {
        return true;
    }
    // Checks if head has hit tail
    for (let i = 0; i < coords.length-1;  i++) {
        if (coords[i][0] === headX && coords[i][1] === headY) {
            return true;
        }
    }
    return false;
}

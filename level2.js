let intervalIdRight = undefined;
let intervalIdLeft = undefined;
let intervalIdJump = undefined;
let intervalIdDead = undefined;
var score = 0;
let position = 170;
var direction = "right";
let bgPositionX = 0;
let isDead = false;
let iswin = false;
const girl = document.getElementById("girl");
const movebackground = document.getElementById("b");
const { width, height } = window.screen;
var mt = 450;

// muisc
var nature = new Audio("resources/music/nature.mp3");
nature.loop = true;
var samurai = new Audio("resources/music/samurai.mp3");
var samuraiss = new Audio("resources/music/samurai.mp3");
var ds = new Audio("resources/music/dead.mp3");
var gs = new Audio("resources/music/gem.mp3");
var rs = new Audio("resources/music/running2.mp3");
rs.loop = true;
var js = new Audio("resources/music/jmp2.mp3")

// gems, obstacles positions
const gems = [[500, 200], [1200, 100], [1900, 100], [2500, 200], [2800, 200], [3500, 50], [3900, 0], [4200, 200],[4500, 50]];
const obstacles = [[1100, 50], [1500, 50], [2000, 50], [2300, 50], [3000, 50]];
const door = [[4925, 0]];
let collectedGems = [];

// let samurais = setInterval(function() {samuraiss.play()},100);
// creating gems, obstacles, door
gems.forEach((gem, index) => {
    createGem(gem[0], gem[1], index);
});

obstacles.forEach((obstacle, index) => {
    createObstacle(obstacle[0], obstacle[1], index);
});

door.forEach((door, index) => {
    createdoor(door[0], door[1], index);
});

//breathing conditions
setInterval(function () {
    if (!intervalIdRight && !intervalIdLeft && !intervalIdJump && !intervalIdDead && !isDead) {
        idle();
        nature.play();
    }
}, 200);

//Breathing animation
var i = 0;
var iw = 0;
function idle() {
    var iimg = document.getElementById("girl");
    i = i + 1;
    if (i == 10) { i = 0; }
    if (direction === "right") {
        iimg.src = "resources/ninjagirl/Idle (" + i + ").png";
    }
    else if (direction === "left") {
        iimg.src = "resources/ninjagirl/Idleb (" + i + ").png";
    }
}

//Run animation
// Run forward
var r = 0;
var rw = 0;
function run() {
    if (!intervalIdJump) {
        var rimg = document.getElementById("girl");
        r = r + 1;
        iw = 0;
        if (r == 9) {
            r = 0;
        }
        rimg.src = "resources/ninjagirl/run (" + r + ").png";
        direction = "right";
    }
}

// Run backward
var rb = 0;
var rbw = 0;
function runb() {
    if (!intervalIdJump) {
        var rbimg = document.getElementById("girl");
        rb = rb + 1;
        if (rb == 9) {
            rb = 0;
            if (rb = 0) {
                ibw = setInterval(idleb, 200);
            }
        }
        rbimg.src = "resources/ninjagirl/runb (" + rb + ").png";
        direction = "left";
    }
}

//Jump animation
var j = 0;
var jw = 0;
function jump() {
    var jimg = document.getElementById("girl");
    j = j + 1;

    if (j <= 4) {  //jump img
        mt = mt - 40;
    }
    else if (j > 4 && j >= 7) {  //jump img
        mt = mt + 40;
    }
    jimg.style.marginTop = mt + "px";
    if (j == 10) {
        j = 0;
        if (intervalIdJump) {
            clearInterval(intervalIdJump);
            intervalIdJump = undefined;
        }
        jw = 0;
        i = 0;
    }
    if (direction === "right") {
        jimg.src = "resources/ninjagirl/Jump (" + j + ").png";
    }
    else if (direction === "left") {
        jimg.src = "resources/ninjagirl/Jumpb (" + j + ").png";
    }
}

// dead animation
var dw = 0;
var d = 0;
function dead() {
    var dimg = document.getElementById("girl");
    d = d + 1;
    if (d == 10) {
        d = 9;
    }

    dimg.src = "resources/ninjagirl/Dead (" + d + ").png";
}

// keydown events
document.addEventListener("keydown", function (event) {
    switch (event.key) {
        case "ArrowLeft":
            if (!intervalIdLeft && !intervalIdDead) {
                intervalIdLeft = setInterval(function () {
                    if (!isDead && !iswin) {
                        runb();
                        if (position > width / 4) {
                            position = position - 10;
                            girl.style.marginLeft = position + "px";
                        } else if (position <= width / 4) {
                            bgPositionX = bgPositionX + 10;
                            moveGemsWithBG();
                            moveObstaclesWithBG();
                            moveDoorWithBG();
                            movebackground.style.backgroundPositionX = bgPositionX + "px";
                        }
                        checkDead();
                        checkGemCatch();
                        rs.play();
                        checkDoor();
                        // console.warn("bg : " + bgPositionX + ", girl : " + position + ", actual : " + (position - bgPositionX) + ", mt : " + mt);
                    }
                }, 50);
            }
            break;
        case "ArrowRight":
            if (!intervalIdRight && !intervalIdDead) {
                intervalIdRight = setInterval(function () {
                    if (!isDead && !iswin) {
                        run();
                        if (position < width / 3) {
                            position = position + 10;
                            girl.style.marginLeft = position + "px";
                        } else if (position >= width / 3) {
                            bgPositionX = bgPositionX - 10;
                            moveGemsWithBG();
                            moveObstaclesWithBG();
                            moveDoorWithBG();
                            movebackground.style.backgroundPositionX = bgPositionX + "px";
                        }
                        checkDead();
                        checkGemCatch();
                        rs.play();
                        checkDoor();
                        // console.warn("bg : " + bgPositionX + ", girl : " + position + ", actual : " + (position - bgPositionX) + ", mt : " + mt);
                    }
                }, 50);
            }
            break;
        case "ArrowUp":
            if (!intervalIdJump && !intervalIdDead) {
                intervalIdJump = setInterval(() => {
                    if (!isDead && !iswin) {
                        jump();
                        checkDead();
                        checkGemCatch();
                        // console.warn("bg : " + bgPositionX + ", girl : " + position + ", actual : " + (position - bgPositionX) + ", mt : " + mt);
                    }
                    js.play();
                    rs.pause();
                }, 100);
            }
            break;
        default:
            break;
    }
});

// keyup events
document.addEventListener("keyup", function (event) {
    switch (event.key) {
        case "ArrowLeft":
            if (intervalIdLeft) {
                clearInterval(intervalIdLeft);
                intervalIdLeft = undefined;
            }
            rs.pause();
            break;
        case "ArrowRight":
            if (intervalIdRight) {
                clearInterval(intervalIdRight);
                intervalIdRight = undefined;
            }
            rs.pause();
            break;
        default:
            break;
    }
});

// create door
function createdoor(x, y, id) {
    var i = document.createElement("img");
    i.src = "resources/background/door.png";
    i.className = "do";
    i.style.position = 'absolute';
    i.style.left = x + 'px';
    i.style.bottom = y + 'px';
    i.id = "do" + id;
    document.getElementById("b").appendChild(i);
}

// move door with background
function moveDoorWithBG() {
    door.forEach((door, index) => {
        let _door = document.getElementById("do" + index);
        _door.style.left = door[0] + bgPositionX + "px";
    })
}

// create gem function
function createGem(x, y, id) {
    var i = document.createElement("img");
    i.src = "resources/gems/W9jz.gif";
    i.className = "f";
    i.style.position = 'absolute';
    i.style.left = x + 'px';
    i.style.bottom = y + 'px';
    i.id = "g" + id;
    document.getElementById("b").appendChild(i);
}

// move gems with background
function moveGemsWithBG() {
    gems.forEach((gem, index) => {
        if (!collectedGems.includes(index)) {
            let _gem = document.getElementById("g" + index);
            _gem.style.left = gem[0] + bgPositionX + "px";
        }
    })
}

// create obstacles function
function createObstacle(x, y, id) {
    var i = document.createElement("img");
    i.src = "resources/boxes/nouriken-nou.gif";
    i.className = "f";
    i.style.position = 'absolute';
    i.style.left = x + 'px';
    i.style.bottom = y + 'px';
    i.id = "ob" + id;
    document.getElementById("b").appendChild(i);
}

// move obstacles with background
function moveObstaclesWithBG() {
    obstacles.forEach((obstacle, index) => {
        let _obstacle = document.getElementById("ob" + index);
        _obstacle.style.left = obstacle[0] + bgPositionX + "px";
    })
}

// check Dead
function checkDead() {
    let positionX = (position - bgPositionX);

    obstacles.forEach((obstacle) => {
        let xm = obstacle[0] - 50;
        let xh = obstacle[0] + 70;

        if (positionX >= xm && positionX <= xh && mt >= 420 && mt <= 450) {
            isDead = true;
        }
    })

    if (isDead) {
        if (!intervalIdDead) {
            intervalIdDead = setInterval(function () { dead(); }, 100);
            ds.play();
            nature.pause();
            samurai.play();
            document.getElementById("end").style.visibility = "visible";
            document.getElementById("endScore").innerHTML = score;

        }
    }
}

// check got the gem
function checkGemCatch() {
    gems.forEach((_gem, index) => {
        if (!collectedGems.includes(index)) {
            let level = 450 - mt;
            const height = 150;
            const halfWidth = 45;
            let positionX = (position - bgPositionX);
            if (height + level > _gem[1] && level < _gem[1] + 2 * halfWidth && positionX >= _gem[0] - halfWidth && positionX <= _gem[0] + halfWidth) {
                _catch = true;
                collectedGems.push(index);
                scoreUp();
                const gemElement = document.getElementById("g" + index);
                gemElement.parentNode.removeChild(gemElement);
                gs.play();
            }
        }
    })
}

// score up
function scoreUp() {
    const scoreP = document.getElementById("score");
    score = score + 100;
    scoreP.textContent = score;
}

// reload game
function re() {
    location.reload();
}

// start page
// function st() {
//     document.getElementById("start").style.visibility = "hidden";
//     clearInterval(samurais);
//     samuraiss.pause();
// }

// check win
function checkDoor() {
    let positionX = (position - bgPositionX);

    door.forEach((_door) => {
        if (positionX >= _door[0] ) {
            iswin = true;
        }
    })
    if(iswin){
    let winlayout = document.getElementById("win");
    winlayout.style.visibility = "visible";
    samurai.play();
    document.getElementById("winScore").innerHTML = score;
    }    
}
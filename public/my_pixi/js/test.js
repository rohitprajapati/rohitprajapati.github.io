var stage = new PIXI.Container();
var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {transparent: true});
renderer.view.style.visibility = 'hidden';
renderer.view.style.position = 'absolute';
renderer.view.style.top = '0';
renderer.view.style.left = '0';
document.body.appendChild(renderer.view);

PIXI.loader
    .add("img/checkmark.png")
    .add("img/earth.png")
    .load(setup);

//setup();

function setup() {
    // Create target
    target = new PIXI.Sprite(PIXI.loader.resources['img/earth.png'].texture);
    stage.addChild(target);

    turnOn();
    gameLoop();
}

function gameLoop() {
    var timeStep = 1 / 60; // seconds
    setInterval(function () {
        play();
        renderer.render(stage);
    }, 1000 * timeStep);
}

function play() {
    
}

function turnOn() {
    renderer.view.style.visibility = 'visible';
}

function turnOff() {
    renderer.view.style.visibility = 'hidden';
}


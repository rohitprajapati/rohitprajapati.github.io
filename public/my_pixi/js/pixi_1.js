var WW = 10;
var HH = 10;
var WINDOW_WIDTH = WW * 100;
var WINDOW_HEIGHT = HH * 65;
var TARGET_RADIUS = WW * HH * 0.5;
var SHIP_VELOCITY = 200;

var P2_BOUNDARY_PATH = [
    [0, 0],
    [0, WINDOW_HEIGHT],
    [WINDOW_WIDTH, WINDOW_HEIGHT],
    [WINDOW_WIDTH, 0 - TARGET_RADIUS * 2 - WW],
    [WINDOW_WIDTH - WW, 0 - TARGET_RADIUS * 2 - WW],
    [WINDOW_WIDTH - WW, WINDOW_HEIGHT - WW],
    [WW, WINDOW_HEIGHT - WW],
    [WW, WW],
    [WINDOW_WIDTH - TARGET_RADIUS * 2 - WW * 2, WW],
    [WINDOW_WIDTH - TARGET_RADIUS * 2 - WW * 2, 0 - TARGET_RADIUS * 2 - WW],
    [WINDOW_WIDTH - TARGET_RADIUS * 2 - WW * 3, 0 - TARGET_RADIUS * 2 - WW],
    [WINDOW_WIDTH - TARGET_RADIUS * 2 - WW * 3, 0]
];
var BOUNDARY_PATH = [].concat.apply([], P2_BOUNDARY_PATH);

var P2_BRICK = [[31.5,99],[94,157.5],[224,33],[254.5,59.5],[253.5,69],[93.5,223],[2,128.5]];
var BRICK = [].concat.apply([], P2_BRICK);


var BG_COLOR = 0x1099bb;
var BOUNDARY_COLOR = 0x33FF00;
var STONE_COLOR = 0xffFF00;


var target;
var boundary;
var stone;
var brick;
var world;
var brickScale = 2;

var stage = new PIXI.Container();
var renderer = PIXI.autoDetectRenderer(WINDOW_WIDTH, WINDOW_HEIGHT, {backgroundColor: BG_COLOR});
document.body.appendChild(renderer.view);

//Use Pixi's built-in `loader` object to load an image
PIXI.loader
    .add("img/checkmark.png")
    .add("img/earth.png")
    .load(setup);

//setup();

function setup() {

    // Create boundary
    boundary = new PIXI.Graphics();
    stage.addChild(boundary);

    // Create target
    target = new PIXI.Sprite(PIXI.loader.resources['img/earth.png'].texture);
    target.anchor.set(0.5, 0.5);
    target.scale.x = 0.9;
    target.scale.y = 0.9;
    stage.addChild(target);

    // Create stone
    stone = new PIXI.Graphics();
    stage.addChild(stone);

    // Create brick
    brick = new PIXI.Sprite(PIXI.loader.resources['img/checkmark.png'].texture);
    brick.scale.x = brick.scale.y = brickScale;
    brick.x = 100;
    brick.y = 100;
    stage.addChild(brick);


    // ================ Add some physics =================
    // Create the world
    world = new p2.World({
        gravity: [0, 0]
    });

    var boundaryBody = new p2.Body({
        mass: 500,
        position: [0, 0],
        fixedX: true,
        fixedY: true,
        fixedRotation: true
    });
    boundaryBody.fromPolygon(P2_BOUNDARY_PATH);
    world.addBody(boundaryBody);
    boundary.p2Body = boundaryBody;

    var targetBody = new p2.Body({
        mass: 500,
        position: [WINDOW_WIDTH - TARGET_RADIUS - WW - WW / 2, WINDOW_HEIGHT / 2],
        fixedX: true
    });
    var targetShape = new p2.Circle({radius: TARGET_RADIUS});
    targetBody.addShape(targetShape);
    world.addBody(targetBody);
    target.p2Body = targetBody;

    var stoneBody = new p2.Body({
        mass: 50,
        position: [WW * 2 + WW / 2, WINDOW_HEIGHT / 2]
    });
    var stoneShape = new p2.Circle({radius: WW});
    stoneBody.addShape(stoneShape);
    world.addBody(stoneBody);
    stone.p2Body = stoneBody;

    var brickBody = new p2.Body({
        mass: 500,
        position: [100, 100]
    });
    brickBody.fromPolygon(P2_BRICK);
    world.addBody(brickBody);
    brick.p2Body = brickBody;

    drawBoundary();

    keyboardHandlerSetup(stoneBody);
    //stage.y = 800;
    gameLoop();
}

function gameLoop() {
    var timeStep = 1 / 60; // seconds

    setInterval(function () {
        world.step(timeStep);
        play();
        renderer.render(stage);
    }, 1000 * timeStep);
}


function play() {
    drawStone();
    drawTarget();
    drawBrick();

    //console.log(stone.x, stone.y);
    //
    //target.x = Math.floor(target.p2Body.position[0]);
    //target.y = Math.floor(target.p2Body.position[1]);
}

function drawBoundary() {
    boundary.clear();
    boundary.beginFill(BOUNDARY_COLOR);
    boundary.drawPolygon(BOUNDARY_PATH);
    boundary.endFill();
}

function drawBrick() {
    if (!brick.p2Offset) {
        brick.p2Offset = {
            x: (brick.p2Body.position[0] - brick.x) / brickScale,
            y: (brick.p2Body.position[1] - brick.y) / brickScale
        };
    }
    brick.pivot.set(brick.p2Offset.x, brick.p2Offset.y);
    brick.x = brick.p2Body.position[0];
    brick.y = brick.p2Body.position[1];
    brick.rotation = brick.p2Body.angle;
}

function drawStone() {
    stone.clear();
    stone.beginFill(STONE_COLOR);
    stone.drawCircle(stone.p2Body.position[0], stone.p2Body.position[1], WW);
    stone.endFill();
}

function drawTarget() {
    target.x = target.p2Body.position[0];
    target.y = target.p2Body.position[1];
    target.rotation = target.p2Body.angle;
}

function keyboardHandlerSetup(thing) {
    var left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);

    //Left arrow key `press` method
    left.press = function () {
        thing.velocity[0] = -SHIP_VELOCITY;
        thing.velocity[1] = 0;
    };

    //Left arrow key `release` method
    left.release = function () {
        if (!right.isDown && thing.velocity[1] === 0) {
            thing.velocity[0] = 0;
        }
    };

    //Right
    right.press = function () {
        thing.velocity[0] = SHIP_VELOCITY;
        thing.velocity[1] = 0;
    };

    right.release = function () {
        if (!left.isDown && thing.velocity[1] === 0) {
            thing.velocity[0] = 0;
        }
    };

    //Down
    down.press = function () {
        thing.velocity[1] = SHIP_VELOCITY;
        thing.velocity[0] = 0;
    };
    down.release = function () {
        if (!up.isDown && thing.velocity[0] === 0) {
            thing.velocity[1] = 0;
        }
    };

    //Up
    up.press = function () {
        thing.velocity[1] = -SHIP_VELOCITY;
        thing.velocity[0] = 0;
    };
    up.release = function () {
        if (!down.isDown && thing.velocity[0] === 0) {
            thing.velocity[1] = 0;
        }
    };
}


function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = function (event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = function (event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );
    return key;
}

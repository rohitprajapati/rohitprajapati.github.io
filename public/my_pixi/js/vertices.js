var WW = 10;
var HH = 10;
var WINDOW_WIDTH = WW * 100;
var WINDOW_HEIGHT = HH * 65;
var BG_COLOR = 0x1099bb;

var icon;
var line;
var dots = [];
var clickPath = [];
var verElm;
var scaleElm;
var imageElm;
var scale = 1;

var stage = new PIXI.Container({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT
});
var renderer = PIXI.autoDetectRenderer(WINDOW_WIDTH, WINDOW_HEIGHT, {backgroundColor: BG_COLOR});
document.body.appendChild(renderer.view);

setup();

function setup() {
    verElm = document.getElementById("vertices");
    scaleElm = document.getElementById("scale");
    imageElm = document.getElementById("image");

    icon = new PIXI.Sprite();
    stage.addChild(icon);

    line = new PIXI.Graphics();
    stage.addChild(line);

    printVertices();
    printScale();
    setupEventHandler();
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
    drawClickPath();
}

function drawClickPath() {
    var i;
    line.clear();
    if (clickPath.length > 1) {
        line.lineStyle(2, 0xFF0000, 0.8);
        line.moveTo(clickPath[0][0], clickPath[0][1]);
        for (i = 1; i < clickPath.length; i++) {
            line.lineTo(clickPath[i][0], clickPath[i][1]);
        }
    }
    for (i = 0; i < dots.length; i++) {
        var dot = dots[i];
        dot.clear();
        dot.beginFill(0xffFF00);
        dot.drawCircle(clickPath[i][0], clickPath[i][1], 3);
        dot.endFill();
    }
}

function printVertices() {
    verElm.innerHTML = JSON.stringify(clickPath);
}

function fileUploaded() {
    var file = imageElm.files[0];
    var reader = new FileReader();
    reader.onload = function (event) {
        var image = new Image();
        image.src = event.target.result;
        var baseTex = new PIXI.BaseTexture(image);
        icon.texture = new PIXI.Texture(baseTex);
    };
    reader.readAsDataURL(file);
}

function printScale() {
    scaleElm.innerHTML = JSON.stringify(scale);
}

function setupEventHandler() {
    var left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40),
        del = keyboard(8);

    icon.interactive = true;
    icon.click = function(mouseData){
        clickPath.push([mouseData.data.global.x, mouseData.data.global.y]);
        var dot = new PIXI.Graphics();
        stage.addChild(dot);
        dots.push(dot);
        printVertices();
    };

    down.release = function () {
        var i;
        scale /= 2;
        icon.scale.x = scale;
        icon.scale.y = scale;
        for (i = 0; i < clickPath.length; i++) {
            var point = clickPath[i];
            point[0] /= 2;
            point[1] /= 2;
        }
        printScale();
        printVertices();
    };

    up.release = function () {
        var i;
        scale *= 2;
        icon.scale.x = scale;
        icon.scale.y = scale;
        for (i = 0; i < clickPath.length; i++) {
            var point = clickPath[i];
            point[0] *= 2;
            point[1] *= 2;
        }
        printScale();
        printVertices();
    };

    del.release = function () {
        clickPath.pop();
        var dot = dots.pop();
        dot.clear();
        printVertices();
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

var game = new Phaser.Game(300, 500, Phaser.AUTO, 'ctb_game');

var WORLD_WIDTH;
var WORLD_HEIGHT;

var ctb_box;
var ctb_ball;
var levels = [];
var level_index = 0;
var level = 1;
var red_ball_count = 0;
var red_balls;

var ads = [];

var boot = {
    create: function () {
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.state.start('load');
    }
};
game.state.add('boot', boot);



// HELPER FUNCTIONS
function constrainVelocity(sprite, maxVelocity) {
    var body = sprite.body;
    var angle, currVelocitySqr, vx, vy;
    vx = body.velocity.x;
    vy = body.velocity.y;
    currVelocitySqr = vx * vx + vy * vy;
    if (currVelocitySqr > maxVelocity * maxVelocity) {
        angle = Math.atan2(vy, vx);
        vx = Math.cos(angle) * maxVelocity;
        vy = Math.sin(angle) * maxVelocity;
        body.velocity.x = vx;
        body.velocity.y = vy;
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var load = {
    preload: function () {
        game.load.image('ctb_ball', 'img/ctb_ball.png');
        game.load.image('ctb_ball_2', 'img/ctb_ball_2.png');
        game.load.image('ctb_box', 'img/ctb_box.png');
        game.load.physics('ctb_box_physics', 'img/ctb_box.json');
        game.load.physics('ctb_ball_physics', 'img/ctb_ball.json');
        game.load.spritesheet('ctb_buttons', 'img/ctb_buttons.png', 80, 30, -1, 0, 10);
    },
    create: function () {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.stage.backgroundColor = '#eee';
        WORLD_WIDTH = game.world.width;
        WORLD_HEIGHT = game.world.height;
        game.state.start('menu');
    }
};
game.state.add('load', load);


var menu = {
    create: function () {
        menu.boardIn();
    },

    boardIn: function() {
        var board = game.add.bitmapData(WORLD_WIDTH / 1.5, WORLD_HEIGHT / 2);
        board.fill(80, 0, 80, 0.7);
        var boardSprite = game.add.sprite(WORLD_WIDTH / 2, -200, board);
        boardSprite.anchor.set(0.5);

        var text1 = game.make.text(0, 0, 'Tap to start', { fill: '#ffffff', font: 'bold 20pt Comic Sans MS'});
        text1.anchor.set(0.5);
        boardSprite.addChild(text1);

        game.add.tween(boardSprite).to({ y: WORLD_HEIGHT / 2 }, 1000, Phaser.Easing.Bounce.Out).start();
        game.input.onDown.addOnce(function () {
            menu.boardOut(boardSprite);
        });
    },

    boardOut: function (boardSprite) {
        var t = game.add.tween(boardSprite).to({ y: -250 }, 500, Phaser.Easing.Bounce.Out);
        t.onComplete.add(function () {
            game.state.start(levels[level_index].name);
        }, this);
        t.start();
    }
};
game.state.add('menu', menu);


var play1_board_shown = false;
var play1_result = false;
var play1_box_down = false;
var play1 = {

    name: 'play1',

    create: function () {
        play1_board_shown = false;
        play1_result = false;
        play1_box_down = false;

        var topBM = game.add.bitmapData(WORLD_HEIGHT, WORLD_HEIGHT);
        topBM.fill(200, 100, 0);
        var topBlock = game.add.sprite(WORLD_WIDTH / 2, 0 - WORLD_HEIGHT / 2, topBM);
        game.physics.p2.enable(topBlock, false);
        topBlock.body.static = true;

        var bottomBM = game.add.bitmapData(WORLD_HEIGHT, WORLD_HEIGHT);
        bottomBM.fill(200, 100, 0);
        var bottomBlock = game.add.sprite(WORLD_WIDTH / 2, WORLD_HEIGHT + WORLD_HEIGHT / 2, bottomBM);
        game.physics.p2.enable(bottomBlock, false);
        bottomBlock.body.static = true;

        var leftBM = game.add.bitmapData(WORLD_HEIGHT, WORLD_HEIGHT);
        leftBM.fill(200, 100, 0);
        var leftBlock = game.add.sprite(0 - WORLD_HEIGHT / 2, WORLD_HEIGHT / 2, leftBM);
        game.physics.p2.enable(leftBlock, false);
        leftBlock.body.static = true;

        var rightBM = game.add.bitmapData(WORLD_HEIGHT, WORLD_HEIGHT);
        rightBM.fill(200, 100, 0);
        var rightBlock = game.add.sprite(WORLD_WIDTH + WORLD_HEIGHT / 2, WORLD_HEIGHT / 2, rightBM);
        game.physics.p2.enable(rightBlock, false);
        rightBlock.body.static = true;

        var middleBM = game.add.bitmapData(WORLD_WIDTH, 10);
        middleBM.fill(200, 100, 0);
        var middleBlock = game.add.sprite(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, middleBM);
        game.physics.p2.enable(middleBlock, false);
        middleBlock.body.static = true;
        middleBlock.body.mass = 10000;

        ctb_ball = game.add.sprite(Math.floor(Math.random() * WORLD_WIDTH - 50) + 50, WORLD_HEIGHT * 3 / 4, 'ctb_ball');
        game.physics.p2.enable(ctb_ball, false);
        ctb_ball.scale.set(0.2);
        ctb_ball.body.clearShapes();
        ctb_ball.body.loadPolygon('ctb_ball_physics', 'ctb_ball');
        ctb_ball.body.fixedRotation = true;
        ctb_ball.body.velocity.x = (Math.random() > 0.5 ? 1 : -1) * 100;
        ctb_ball.body.velocity.y = (Math.random() > 0.5 ? 1 : -1) * 100;
        ctb_ball.body.mass = 0.1;
        ctb_ball.body.damping = 0;
        ctb_ball.body.angularDamping = 0;
        ctb_ball.body.collideWorldBounds = true;

        red_balls = [];
        for (var i = 0; i < red_ball_count; i++) {
            var ctb_red_ball = game.add.sprite(getRandomInt(50, WORLD_WIDTH - 50), getRandomInt(WORLD_HEIGHT * 3 / 4, WORLD_HEIGHT - 10), 'ctb_ball_2');
            game.physics.p2.enable(ctb_red_ball, false);
            ctb_red_ball.body.clearShapes();
            ctb_red_ball.body.loadPolygon('ctb_ball_physics', 'ctb_ball');
            ctb_red_ball.body.fixedRotation = true;
            ctb_red_ball.body.velocity.x = (Math.random() > 0.5 ? 1 : -1) * 100;
            ctb_red_ball.body.velocity.y = (Math.random() > 0.5 ? 1 : -1) * 100;
            ctb_red_ball.body.mass = 0.1;
            ctb_red_ball.body.damping = 0;
            ctb_red_ball.body.angularDamping = 0;
            ctb_red_ball.body.collideWorldBounds = true;
            red_balls.push(ctb_red_ball);
        }

        ctb_box = game.add.sprite(WORLD_WIDTH / 2, 20, 'ctb_box');
        game.physics.p2.enable(ctb_box, false);
        ctb_box.body.clearShapes();
        ctb_box.body.loadPolygon('ctb_box_physics', 'ctb_box');
        ctb_box.body.kinematic = true;
        ctb_box.body.mass = 10000;
        game.physics.p2.restitution = 1;
        game.physics.p2.gravity.y = 0;

        game.input.onDown.addOnce(function () {
            ctb_box.body.velocity.y = 500;
        });
    },

    update: function () {
        constrainVelocity(ctb_ball, 300);
        for (var i = 0; i < red_balls.length; i++) {
            constrainVelocity(red_balls[i], 300);
        }
        if (ctb_ball.body.y < WORLD_HEIGHT / 2) {
            ctb_ball.body.y = WORLD_HEIGHT + 50;
        }
        if (!play1_box_down && ctb_box.y >= WORLD_HEIGHT - ctb_box.height / 2) {
            play1_box_down = true;
            ctb_box.body.velocity.y = 0;

            setTimeout(function () {
                play1_result = play1.checkResult();
                if (!play1_board_shown) {
                    play1_board_shown = true;
                    play1.boardIn();
                }
            }, 500);
        }
    },

    checkResult: function () {
        return ctb_ball.y >= ctb_box.y - ctb_box.height / 2 && ctb_ball.y <= WORLD_HEIGHT && ctb_ball.x >= ctb_box.x - ctb_box.width / 2 && ctb_ball.x <= ctb_box.x + ctb_box.width / 2;
    },

    boardIn: function () {
        var board = game.add.bitmapData(WORLD_WIDTH / 1.5, WORLD_HEIGHT / 2);
        board.fill(80, 0, 80, 0.7);
        var boardSprite = game.add.sprite(WORLD_WIDTH / 2, -200, board);
        boardSprite.anchor.set(0.5);

        var levelText = game.make.text(0, -100, 'Level ' + level, {fill: '#ffffff', font: 'bold 10pt Comic Sans MS'});
        levelText.anchor.set(0.5);
        boardSprite.addChild(levelText);

        var r = play1_result ? 'HAPPY BIRTHDAY SAKSHI' : 'CATCH SAKSHI AGAIN';
        var resultText = game.make.text(0, -50, r, {fill: '#ffffff', font: 'bold 10pt Comic Sans MS'});
        resultText.anchor.set(0.5);
        boardSprite.addChild(resultText);

        var retryButton = game.make.button(0, 20, 'ctb_buttons', function () {
            play1.boardOut(boardSprite);
        }, this, 4, 3, 5);
        retryButton.anchor.set(0.5);
        retryButton.scale.setTo(1.5);
        retryButton.input.priorityID = 1;
        boardSprite.addChild(retryButton);

        if (play1_result) {
            var nextButton = game.make.button(0, 80, 'ctb_buttons', function () {
                level_index = (level_index + 1) % levels.length;
                level++;
                red_ball_count++;
                play1.boardOut(boardSprite);
            }, this, 7, 6, 8);
            nextButton.anchor.set(0.5);
            nextButton.scale.setTo(1.5);
            nextButton.input.priorityID = 1;
            boardSprite.addChild(nextButton);
        }

        game.add.tween(boardSprite).to({y: WORLD_HEIGHT / 2}, 1000, Phaser.Easing.Bounce.Out).start();

        var bg = game.add.sprite(0, 0);
        bg.fixedToCamera = true;
        bg.scale.setTo(WORLD_WIDTH, WORLD_HEIGHT);
        bg.inputEnabled = true;
        bg.input.priorityID = 0; // lower priority
        bg.events.onInputDown.add(function () {
            if (play1_result) {
                level_index = (level_index + 1) % levels.length;
                level++;
                red_ball_count++;
            }
            play1.boardOut(boardSprite);
        });
    },

    boardOut: function (boardSprite) {
        var t = game.add.tween(boardSprite).to({y: -250}, 700, Phaser.Easing.Bounce.Out);
        t.onComplete.add(function () {
            game.state.start(levels[level_index].name);
        }, this);
        t.start();
    }
};

game.state.add(play1.name, play1);
levels.push(play1);


var play2_board_shown = false;
var play2_result = false;
var play2_box_down = false;
var play2_box_velocity = 150;
var play2 = {

    name: 'play2',

    create: function () {
        play2_board_shown = false;
        play2_result = false;
        play2_box_down = false;

        var topBM = game.add.bitmapData(WORLD_HEIGHT, WORLD_HEIGHT);
        topBM.fill(200, 100, 0);
        var topBlock = game.add.sprite(WORLD_WIDTH / 2, 0 - WORLD_HEIGHT / 2, topBM);
        game.physics.p2.enable(topBlock, false);
        topBlock.body.static = true;

        var bottomBM = game.add.bitmapData(WORLD_HEIGHT, WORLD_HEIGHT);
        bottomBM.fill(200, 100, 0);
        var bottomBlock = game.add.sprite(WORLD_WIDTH / 2, WORLD_HEIGHT + WORLD_HEIGHT / 2, bottomBM);
        game.physics.p2.enable(bottomBlock, false);
        bottomBlock.body.static = true;

        var leftBM = game.add.bitmapData(WORLD_HEIGHT, WORLD_HEIGHT);
        leftBM.fill(200, 100, 0);
        var leftBlock = game.add.sprite(0 - WORLD_HEIGHT / 2, WORLD_HEIGHT / 2, leftBM);
        game.physics.p2.enable(leftBlock, false);
        leftBlock.body.static = true;

        var rightBM = game.add.bitmapData(WORLD_HEIGHT, WORLD_HEIGHT);
        rightBM.fill(200, 100, 0);
        var rightBlock = game.add.sprite(WORLD_WIDTH + WORLD_HEIGHT / 2, WORLD_HEIGHT / 2, rightBM);
        game.physics.p2.enable(rightBlock, false);
        rightBlock.body.static = true;

        var middleBM = game.add.bitmapData(WORLD_WIDTH, 10);
        middleBM.fill(200, 100, 0);
        var middleBlock = game.add.sprite(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, middleBM);
        game.physics.p2.enable(middleBlock, false);
        middleBlock.body.static = true;
        middleBlock.body.mass = 10000;

        ctb_ball = game.add.sprite(Math.floor(Math.random() * WORLD_WIDTH - 50) + 50, WORLD_HEIGHT * 3 / 4, 'ctb_ball');
        game.physics.p2.enable(ctb_ball, false);
        ctb_ball.scale.set(0.2);
        ctb_ball.body.clearShapes();
        ctb_ball.body.loadPolygon('ctb_ball_physics', 'ctb_ball');
        ctb_ball.body.fixedRotation = true;
        ctb_ball.body.velocity.x = (Math.random() > 0.5 ? 1 : -1) * 100;
        ctb_ball.body.velocity.y = (Math.random() > 0.5 ? 1 : -1) * 100;
        ctb_ball.body.mass = 0.1;
        ctb_ball.body.damping = 0;
        ctb_ball.body.angularDamping = 0;
        ctb_ball.body.collideWorldBounds = true;

        red_balls = [];
        for (var i = 0; i < red_ball_count; i++) {
            var ctb_red_ball = game.add.sprite(getRandomInt(50, WORLD_WIDTH - 50), getRandomInt(WORLD_HEIGHT * 3 / 4, WORLD_HEIGHT - 10), 'ctb_ball_2');
            game.physics.p2.enable(ctb_red_ball, false);
            ctb_red_ball.body.clearShapes();
            ctb_red_ball.body.loadPolygon('ctb_ball_physics', 'ctb_ball');
            ctb_red_ball.body.fixedRotation = true;
            ctb_red_ball.body.velocity.x = (Math.random() > 0.5 ? 1 : -1) * 100;
            ctb_red_ball.body.velocity.y = (Math.random() > 0.5 ? 1 : -1) * 100;
            ctb_red_ball.body.mass = 0.1;
            ctb_red_ball.body.damping = 0;
            ctb_red_ball.body.angularDamping = 0;
            ctb_red_ball.body.collideWorldBounds = true;
            red_balls.push(ctb_red_ball);
        }

        ctb_box = game.add.sprite(WORLD_WIDTH / 2, 20, 'ctb_box');
        game.physics.p2.enable(ctb_box, false);
        ctb_box.body.clearShapes();
        ctb_box.body.loadPolygon('ctb_box_physics', 'ctb_box');
        ctb_box.body.kinematic = true;
        ctb_box.body.mass = 10000;
        ctb_box.body.velocity.x = play2_box_velocity;

        game.physics.p2.restitution = 1;
        game.physics.p2.gravity.y = 0;

        game.input.onDown.addOnce(function () {
            ctb_box.body.velocity.x = 0;
            ctb_box.body.velocity.y = 500;
        });
    },

    update: function () {
        constrainVelocity(ctb_ball, 300);
        for (var i = 0; i < red_balls.length; i++) {
            constrainVelocity(red_balls[i], 300);
        }
        if (ctb_ball.body.y < WORLD_HEIGHT / 2) {
            ctb_ball.body.y = WORLD_HEIGHT + 50;
        }
        if (ctb_box.body.x + 20 >= WORLD_WIDTH) {
            ctb_box.body.velocity.x = - play2_box_velocity;
        }
        if (ctb_box.body.x - 20 <= 0) {
            ctb_box.body.velocity.x = play2_box_velocity;
        }
        if (!play2_box_down && ctb_box.y >= WORLD_HEIGHT - ctb_box.height / 2) {
            play2_box_down = true;
            ctb_box.body.velocity.y = 0;

            setTimeout(function () {
                play2_result = play2.checkResult();
                if (!play2_board_shown) {
                    play2_board_shown = true;
                    play2.boardIn();
                }
            }, 500);
        }
    },

    checkResult: function () {
        return ctb_ball.y >= ctb_box.y - ctb_box.height / 2 && ctb_ball.y <= WORLD_HEIGHT && ctb_ball.x >= ctb_box.x - ctb_box.width / 2 && ctb_ball.x <= ctb_box.x + ctb_box.width / 2;
    },

    boardIn: function () {
        var board = game.add.bitmapData(WORLD_WIDTH / 1.5, WORLD_HEIGHT / 2);
        board.fill(80, 0, 80, 0.7);
        var boardSprite = game.add.sprite(WORLD_WIDTH / 2, -200, board);
        boardSprite.anchor.set(0.5);

        var levelText = game.make.text(0, -100, 'Level ' + level, {fill: '#ffffff', font: 'bold 10pt Comic Sans MS'});
        levelText.anchor.set(0.5);
        boardSprite.addChild(levelText);

        var r = play2_result ? 'HAPPY BIRTHDAY SAKSHI' : 'CATCH SAKSHI AGAIN';
        var resultText = game.make.text(0, -50, r, {fill: '#ffffff', font: 'bold 10pt Comic Sans MS'});
        resultText.anchor.set(0.5);
        boardSprite.addChild(resultText);

        var retryButton = game.make.button(0, 20, 'ctb_buttons', function () {
            play2.boardOut(boardSprite);
        }, this, 4, 3, 5);
        retryButton.anchor.set(0.5);
        retryButton.scale.setTo(1.5);
        retryButton.input.priorityID = 1;
        boardSprite.addChild(retryButton);

        if (play2_result) {
            var nextButton = game.make.button(0, 80, 'ctb_buttons', function () {
                level_index = (level_index + 1) % levels.length;
                level++;
                red_ball_count++;
                play2.boardOut(boardSprite);
            }, this, 7, 6, 8);
            nextButton.anchor.set(0.5);
            nextButton.scale.setTo(1.5);
            nextButton.input.priorityID = 1;
            boardSprite.addChild(nextButton);
        }

        game.add.tween(boardSprite).to({y: WORLD_HEIGHT / 2}, 1000, Phaser.Easing.Bounce.Out).start();

        var bg = game.add.sprite(0, 0);
        bg.fixedToCamera = true;
        bg.scale.setTo(WORLD_WIDTH, WORLD_HEIGHT);
        bg.inputEnabled = true;
        bg.input.priorityID = 0;
        bg.events.onInputDown.add(function () {
            if (play2_result) {
                level_index = (level_index + 1) % levels.length;
                level++;
                red_ball_count++;
            }
            play2.boardOut(boardSprite);
        });
    },

    boardOut: function (boardSprite) {
        var t = game.add.tween(boardSprite).to({y: -250}, 700, Phaser.Easing.Bounce.Out);
        t.onComplete.add(function () {
            game.state.start(levels[level_index].name);
        }, this);
        t.start();
    }
};
game.state.add(play2.name, play2);
levels.push(play2);


var play3_board_shown = false;
var play3_result = false;
var play3_box_down = false;
var play3_box_velocity = 0;
var play3_box_dropped = false;

var play3 = {

    name: 'play3',

    create: function () {
        play3_board_shown = false;
        play3_result = false;
        play3_box_down = false;
        play3_box_dropped = false;
        play3_box_velocity = 0;

        var topBM = game.add.bitmapData(WORLD_HEIGHT, WORLD_HEIGHT);
        topBM.fill(200, 100, 0);
        var topBlock = game.add.sprite(WORLD_WIDTH / 2, 0 - WORLD_HEIGHT / 2, topBM);
        game.physics.p2.enable(topBlock, false);
        topBlock.body.static = true;

        var bottomBM = game.add.bitmapData(WORLD_HEIGHT, WORLD_HEIGHT);
        bottomBM.fill(200, 100, 0);
        var bottomBlock = game.add.sprite(WORLD_WIDTH / 2, WORLD_HEIGHT + WORLD_HEIGHT / 2, bottomBM);
        game.physics.p2.enable(bottomBlock, false);
        bottomBlock.body.static = true;

        var leftBM = game.add.bitmapData(WORLD_HEIGHT, WORLD_HEIGHT);
        leftBM.fill(200, 100, 0);
        var leftBlock = game.add.sprite(0 - WORLD_HEIGHT / 2, WORLD_HEIGHT / 2, leftBM);
        game.physics.p2.enable(leftBlock, false);
        leftBlock.body.static = true;

        var rightBM = game.add.bitmapData(WORLD_HEIGHT, WORLD_HEIGHT);
        rightBM.fill(200, 100, 0);
        var rightBlock = game.add.sprite(WORLD_WIDTH + WORLD_HEIGHT / 2, WORLD_HEIGHT / 2, rightBM);
        game.physics.p2.enable(rightBlock, false);
        rightBlock.body.static = true;

        var middleBM = game.add.bitmapData(WORLD_WIDTH, 10);
        middleBM.fill(200, 100, 0);
        var middleBlock = game.add.sprite(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, middleBM);
        game.physics.p2.enable(middleBlock, false);
        middleBlock.body.static = true;
        middleBlock.body.mass = 10000;

        ctb_ball = game.add.sprite(Math.floor(Math.random() * WORLD_WIDTH - 50) + 50, WORLD_HEIGHT * 3 / 4, 'ctb_ball');
        game.physics.p2.enable(ctb_ball, false);
        ctb_ball.scale.set(0.2);
        ctb_ball.body.clearShapes();
        ctb_ball.body.loadPolygon('ctb_ball_physics', 'ctb_ball');
        ctb_ball.body.fixedRotation = true;
        ctb_ball.body.velocity.x = (Math.random() > 0.5 ? 1 : -1) * 100;
        ctb_ball.body.velocity.y = (Math.random() > 0.5 ? 1 : -1) * 100;
        ctb_ball.body.mass = 0.1;
        ctb_ball.body.damping = 0;
        ctb_ball.body.angularDamping = 0;
        ctb_ball.body.collideWorldBounds = true;

        red_balls = [];
        for (var i = 0; i < red_ball_count; i++) {
            var ctb_red_ball = game.add.sprite(getRandomInt(50, WORLD_WIDTH - 50), getRandomInt(WORLD_HEIGHT * 3 / 4, WORLD_HEIGHT - 10), 'ctb_ball_2');
            game.physics.p2.enable(ctb_red_ball, false);
            ctb_red_ball.body.clearShapes();
            ctb_red_ball.body.loadPolygon('ctb_ball_physics', 'ctb_ball');
            ctb_red_ball.body.fixedRotation = true;
            ctb_red_ball.body.velocity.x = (Math.random() > 0.5 ? 1 : -1) * 100;
            ctb_red_ball.body.velocity.y = (Math.random() > 0.5 ? 1 : -1) * 100;
            ctb_red_ball.body.mass = 0.1;
            ctb_red_ball.body.damping = 0;
            ctb_red_ball.body.angularDamping = 0;
            ctb_red_ball.body.collideWorldBounds = true;
            red_balls.push(ctb_red_ball);
        }

        ctb_box = game.add.sprite(WORLD_WIDTH / 2, 20, 'ctb_box');
        game.physics.p2.enable(ctb_box, false);
        ctb_box.body.clearShapes();
        ctb_box.body.loadPolygon('ctb_box_physics', 'ctb_box');
        ctb_box.body.kinematic = true;
        ctb_box.body.mass = 10000;

        game.physics.p2.restitution = 1;
        game.physics.p2.gravity.y = 0;

        game.input.onDown.addOnce(function () {
            play3_box_dropped = true;
            ctb_box.body.velocity.y = 500;
        });
    },

    update: function () {
        constrainVelocity(ctb_ball, 300);
        for (var i = 0; i < red_balls.length; i++) {
            constrainVelocity(red_balls[i], 300);
        }
        if (ctb_ball.body.y < WORLD_HEIGHT / 2) {
            ctb_ball.body.y = WORLD_HEIGHT + 50;
        }
        if (!play3_box_dropped) {
            play3_box_velocity += 0.05;
            ctb_box.body.x = WORLD_WIDTH / 2 + 70 * Math.sin(play3_box_velocity);
        }
        if (!play3_box_down && ctb_box.y >= WORLD_HEIGHT - ctb_box.height / 2) {
            play3_box_down = true;
            ctb_box.body.velocity.y = 0;

            setTimeout(function () {
                play3_result = play3.checkResult();
                if (!play3_board_shown) {
                    play3_board_shown = true;
                    play3.boardIn();
                }
            }, 500);
        }
    },

    checkResult: function () {
        return ctb_ball.y >= ctb_box.y - ctb_box.height / 2 && ctb_ball.y <= WORLD_HEIGHT && ctb_ball.x >= ctb_box.x - ctb_box.width / 2 && ctb_ball.x <= ctb_box.x + ctb_box.width / 2;
    },

    boardIn: function () {
        var board = game.add.bitmapData(WORLD_WIDTH / 1.5, WORLD_HEIGHT / 2);
        board.fill(80, 0, 80, 0.7);
        var boardSprite = game.add.sprite(WORLD_WIDTH / 2, -200, board);
        boardSprite.anchor.set(0.5);

        var levelText = game.make.text(0, -100, 'Level ' + level, {fill: '#ffffff', font: 'bold 10pt Comic Sans MS'});
        levelText.anchor.set(0.5);
        boardSprite.addChild(levelText);

        var r = play3_result ? 'HAPPY BIRTHDAY SAKSHI' : 'CATCH SAKSHI AGAIN';
        var resultText = game.make.text(0, -50, r, {fill: '#ffffff', font: 'bold 10pt Comic Sans MS'});
        resultText.anchor.set(0.5);
        boardSprite.addChild(resultText);

        var retryButton = game.make.button(0, 20, 'ctb_buttons', function () {
            play3.boardOut(boardSprite);
        }, this, 4, 3, 5);
        retryButton.anchor.set(0.5);
        retryButton.scale.setTo(1.5);
        retryButton.input.priorityID = 1;
        boardSprite.addChild(retryButton);

        if (play3_result) {
            var nextButton = game.make.button(0, 80, 'ctb_buttons', function () {
                level_index = (level_index + 1) % levels.length;
                level++;
                red_ball_count++;
                play3.boardOut(boardSprite);
            }, this, 7, 6, 8);
            nextButton.anchor.set(0.5);
            nextButton.scale.setTo(1.5);
            nextButton.input.priorityID = 1;
            boardSprite.addChild(nextButton);
        }

        game.add.tween(boardSprite).to({y: WORLD_HEIGHT / 2}, 1000, Phaser.Easing.Bounce.Out).start();

        var bg = game.add.sprite(0, 0);
        bg.fixedToCamera = true;
        bg.scale.setTo(WORLD_WIDTH, WORLD_HEIGHT);
        bg.inputEnabled = true;
        bg.input.priorityID = 0;
        bg.events.onInputDown.add(function () {
            if (play3_result) {
                level_index = (level_index + 1) % levels.length;
                level++;
                red_ball_count++;
            }
            play3.boardOut(boardSprite);
        });
    },

    boardOut: function (boardSprite) {
        var t = game.add.tween(boardSprite).to({y: -250}, 700, Phaser.Easing.Bounce.Out);
        t.onComplete.add(function () {
            game.state.start(levels[level_index].name);
        }, this);
        t.start();
    }
};

game.state.add(play3.name, play3);
levels.push(play3);

game.state.start('boot');


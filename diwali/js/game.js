var game = new Phaser.Game(580, 600, Phaser.AUTO, 'ctb_game');

var WORLD_WIDTH;
var WORLD_HEIGHT;

var chances = 0;


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


var boot = {
    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.state.start('load');
    }
};
game.state.add('boot', boot);


var load = {
    preload: function () {
        game.load.image('balloon1', 'img/balloon1.png');
        game.load.image('balloon2', 'img/balloon2.png');
        game.load.image('balloon3', 'img/balloon3.png');
        game.load.image('balloon4', 'img/balloon4.png');
        game.load.image('happy', 'img/happy.png');
        game.load.image('diya', 'img/diya.png');
        game.load.image('restart', 'img/restart.png');
        game.load.image('d', 'img/d.png');
        game.load.image('i', 'img/i.png');
        game.load.image('w', 'img/w.png');
        game.load.image('a', 'img/a.png');
        game.load.image('l', 'img/l.png');
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

        var text1 = game.make.text(0, -40, 'Create Diwali', { fill: '#ffffff', font: 'bold 20pt Comic Sans MS'});
        text1.anchor.set(0.5);
        boardSprite.addChild(text1);
        var text2 = game.make.text(0, 0, 'using correct balloons', { fill: '#ffffff', font: 'bold 20pt Comic Sans MS'});
        text2.anchor.set(0.5);
        boardSprite.addChild(text2);
        var text3 = game.make.text(0, 40, 'in mimimum efforts', { fill: '#ffffff', font: 'bold 20pt Comic Sans MS'});
        text3.anchor.set(0.5);
        boardSprite.addChild(text3);

        game.add.tween(boardSprite).to({ y: WORLD_HEIGHT / 2 }, 1000, Phaser.Easing.Bounce.Out).start();
        game.input.onDown.addOnce(function () {
            menu.boardOut(boardSprite);
        });
    },

    boardOut: function (boardSprite) {
        var t = game.add.tween(boardSprite).to({ y: -250 }, 500, Phaser.Easing.Bounce.Out);
        t.onComplete.add(function () {
            game.state.start('play');
        }, this);
        t.start();
    }
};
game.state.add('menu', menu);

var result = [
    {
        text: 'd',
        p2: [0, 0],
        p3: [0, 300],
    },
    {
        text: 'i',
        p2: [100, 0],
        p3: [100, 300],
    },
    {
        text: 'w',
        p2: [200, 0],
        p3: [200, 300],
    },
    {
        text: 'a',
        p2: [300, 0],
        p3: [300, 300],
    },
    {
        text: 'l',
        p2: [400, 0],
        p3: [400, 300],
    },
    {
        text: 'i',
        p2: [500, 0],
        p3: [500, 300],
    }
];

var diwali = [
    {
        img: 'balloon1',
        text: 'd',
        velocity: [-100, 100],
        p1: [getRandomInt(100, 400), getRandomInt(100, 400)],
    },
    {
        img: 'balloon2',
        text: 'i',
        velocity: [100, 100],
        p1: [getRandomInt(100, 400), getRandomInt(100, 400)],
    },
    {
        img: 'balloon3',
        text: 'w',
        velocity: [100, -100],
        p1: [getRandomInt(100, 400), getRandomInt(100, 400)],
    },
    {
        img: 'balloon4',
        text: 'a',
        velocity: [-100, -100],
        p1: [getRandomInt(100, 400), getRandomInt(100, 400)],
    },
    {
        img: 'balloon2',
        text: 'l',
        velocity: [-100, 0],
        p1: [getRandomInt(100, 400), getRandomInt(100, 400)],
    },
    {
        img: 'balloon1',
        text: 'i',
        velocity: [100, 0],
        p1: [getRandomInt(100, 400), getRandomInt(100, 400)],
    }
];

function showHappyDiwali() {
    result.forEach(function (node) {
        var d = node.d;
        var tween = game.add.tween(d.sprite);
        tween.to({ x: node.p3[0], y: node.p3[1] }, 1000, 'Linear', true, 0);
        setTimeout(function () {
            d.sprite.loadTexture(d.text, 0);
            var tween = game.add.tween(d.sprite).to( { x: node.p3[0], y: node.p3[1] + 50 }, 500, "Linear", true, 0, -1);
            tween.yoyo(true, 0);
        }, 1000);
    });
    setTimeout(function () {
        var happySprite = game.add.sprite(300, 200, 'happy');
        happySprite.anchor.set(0.5);
        var tween = game.add.tween(happySprite.scale).to( { x: 0.5, y: 0.5 }, 500, "Linear", true, 0, -1);
        tween.yoyo(true, 0);


        var notMatched = result.some(function (node) {
            return node.d.text !== node.text;
        });
        if (notMatched) {
            var restartSprite = game.add.sprite(300, 530, 'restart');
            restartSprite.scale.set(0.8);
            restartSprite.anchor.set(0.5);
            restartSprite.inputEnabled = true;
            restartSprite.events.onInputDown.add(function () {
                count = 0;
                chances++;
                game.state.start('dialogue');
            }, this);
        } else {
            var diyaSprite = game.add.sprite(300, 530, 'diya');
            diyaSprite.scale.set(0.5);
            diyaSprite.anchor.set(0.5);
        }
    }, 1000);
}

var count = 0;
var play = {

    create: function () {
        game.add.text(435, 5, 'Efforts: ' + chances, { fill: '#ffffff' });
        diwali.forEach(function (d) {
            var sprite = game.add.sprite(d.p1[0], d.p1[1], d.img);
            d.sprite = sprite;
            
            game.physics.arcade.enable(sprite);
            sprite.body.velocity.set(d.velocity[0], d.velocity[1]);
            sprite.body.bounce.set(1);
            sprite.body.collideWorldBounds = true;
            sprite.inputEnabled = true;

            var tween = game.add.tween(sprite);

            sprite.events.onInputDown.add(function () {
                var node = result[count];
                node.d = d;
                tween.to({ x: node.p2[0], y: node.p2[1] }, 1000, 'Linear', true, 0);
                sprite.body.velocity.x = 0;
                sprite.body.velocity.y = 0;
                count++;
                if (count === diwali.length) {
                    setTimeout(function () {
                        showHappyDiwali();
                    }, 1000);
                }
            }, this);
        });
    },
};
game.state.add('play', play);

var dialogues = [
    'Tujhe diwali manani nahi aati',
    'Sharam kar sharam',
    'Tu ja yahan se',
    'Beta, tumse naa ho payega',
    'Tu likhwa le...',
    'Ab mujhe gussa aa raha hai',
    'Kanoon ko haath me mat le',
    'Teri life jhand hai',
    'Chor de bhai',
    'Aaj Khush to bohot hoge tum',
    'Kuch kha ke aa',
    'Tera bad luck bhi kharab hai',
    'Tera kya hoga kaliaa',
    'Dusre hath se try kar',
    'Dono aankhein band kar ke',
    'Aas paas rassi hai kya',
    'Mooh dho kar aa',
    'Tune bahot paap kare hain',
    'Kabhi ginti yaad kari hai\nlife mein',
    'Tu color blind to nahi hai',
    'Lagta hai abhi abhi tera\nbreakup hua hai',
    'Mai bata raha hoon\ntera target hi kuch aur hai',
    'WTF, are you doing here',
    'Nahi isme teri koi galti nahi\nGalti to meri hai',
    'Tujhse koi baat nahi karta na',
];
var dialogue = {
    create: function () {
        dialogue.boardIn();
    },

    boardIn: function() {
        var board = game.add.bitmapData(WORLD_WIDTH / 1.5, WORLD_HEIGHT / 2);
        board.fill(80, 0, 80, 0.7);
        var boardSprite = game.add.sprite(WORLD_WIDTH / 2, -200, board);
        boardSprite.anchor.set(0.5);

        var text1 = game.make.text(0, 0, dialogues[(chances - 1) % dialogues.length], { fill: '#ffffff', font: 'bold 20pt Comic Sans MS'});
        text1.anchor.set(0.5);
        boardSprite.addChild(text1);

        game.add.tween(boardSprite).to({ y: WORLD_HEIGHT / 2 }, 1000, Phaser.Easing.Bounce.Out).start();
        game.input.onDown.addOnce(function () {
            dialogue.boardOut(boardSprite);
        });
    },

    boardOut: function (boardSprite) {
        var t = game.add.tween(boardSprite).to({ y: -250 }, 500, Phaser.Easing.Bounce.Out);
        t.onComplete.add(function () {
            game.state.start('play');
        }, this);
        t.start();
    }
};
game.state.add('dialogue', dialogue);


game.state.start('boot');


(function() {
    var platforms, player, cursors, mummy, ground;
    var bullets = [];
    var mission = {
        src: 'assets/mission-1.png',
        width: 4088,
        height: 336
    };
    var config = {
        width: 800,
        height: 600
    };
    var game = new Phaser.Game(config.width, mission.height, Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update
    });
    function preload() {
        // game.load.tilemap('map', 'assets/mission-1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('mission1', mission.src);
        game.load.image('ground', 'assets/platform2.png');
        game.load.image('bullet', 'assets/bullet.gif');
        game.load.atlasXML('marco', 'assets/marco.png', 'assets/marco.xml');
        game.load.spritesheet('mummy', 'assets/mummy.png', 37, 45, 18);
    }

    function create() {
        // map = game.add.tilemap('map');
        game.world.setBounds(0, 0, mission.width, config.height);
        //We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.add.sprite(0, 200, 'mission1');

        platforms = game.add.group();
        platforms.enableBody = true;

        ground = platforms.create(0, game.world.height - 90, 'ground');
        ground.scale.setTo(4, 2);
        ground.body.immovable = true;

        var ledge = platforms.create(0, 480, 'ground');
        ledge.body.immovable = true;
        ledge = platforms.create(-150, 250, 'ground');
        ledge.body.immovable = true;

        player = game.add.sprite(250, game.world.height - 170, 'marco');

        game.camera.follow(player);
        //We need to enable physics on the player
        game.physics.arcade.enable(player);

        //Player physics properties. Give the little guy a slight bounce.
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 700;
        player.body.collideWorldBounds = true;

        //Animations

        player.animations.add('walk', [0,1,2,3,4,5,6,7,8,9], 10);

        player.animations.add('lookingUp', [13,12,11,10], 10, false);
        //Mummy
        // createMummy();

        //Cursors
        cursors = createCursors();
    }

    function createCursors() {
        var c = game.input.keyboard.createCursorKeys();
        c.jump = game.input.keyboard.addKey(Phaser.Keyboard.D);
        c.fire = game.input.keyboard.addKey(Phaser.Keyboard.A);

        return c;
    }

    function update() {
        // ground.scale.setTo(2, 2);
        //Collide the player and the stars with the platforms
        game.physics.arcade.collide(player, platforms);

        //Reset the players velocity (movement)
        player.body.velocity.x = 0;

        updateBullets();

        var now = new Date().getTime();
        var lastBullet = bullets[bullets.length - 1];
        var lastDate = lastBullet ? lastBullet.date + 100 : 0;
        var canFire = lastDate < now;

        if (cursors.fire.isDown && canFire) {
            var x, sprite, y, direction;
            var date = new Date().getTime();

            if (cursors.up.isDown) {
                x = (player.width / 2) + player.position.x;
                y = player.position.y;
                direction = 'up';
            } else {
                x = player.width + player.position.x;
                y = (player.height / 2) + player.position.y;
                direction = player.scale.x === 1 ? 'right' : 'left';
            }

            sprite = game.add.sprite(x, y, 'bullet');

            if (direction === 'left') {
                sprite.scale.x = -1;
            } else if (direction === 'up') {
                sprite.rotation = 4.7;
            }

            bullets.push({
                direction: direction,
                sprite: sprite,
                date: date
            });
        }

        //Cursor keys
        if (cursors.left.isDown) {
            //Set left direction
            if (player.scale.x != -1) {
                player.scale.x = -1;
            }
            player.body.velocity.x = -150;
            player.animations.play('walk');
        } else if (cursors.right.isDown) {
            //Set right direction
            if (player.scale.x != 1) {
                player.scale.x = 1;
            }
            player.body.velocity.x = 150;
            player.animations.play('walk');
        } else if (cursors.up.isDown) {
            if (player.animations.currentFrame.index === 10) {
                player.animations.stop('lookingUp');
            } else {
                player.animations.play('lookingUp');
            }
        } else if (cursors.down.isDown) {

        } else {
            player.animations.stop();
            player.frame = 7;
        }

        //Allow the player to jump if they are touching the ground.
        if (cursors.jump.isDown && player.body.touching.down) {
            player.body.velocity.y = -300;
        }
    }

    function updateBullets(){
        var position;
        var speed = 10;

        bullets.forEach(function(bullet) {
            if (bullet.direction === 'up') {
                bullet.sprite.y -= speed;
            } else {
                position = bullet.direction === 'right' ? speed : -speed;
                bullet.sprite.position.x += position;
            }
        });
    }

    function createMummy() {
        mummy = game.add.sprite(300, 200, 'mummy');
        mummy.scale.x = -1;
        mummy.animations.add('walk');
        mummy.animations.play('walk', 20, true);
    }

    this.game = game;

}).call(App);
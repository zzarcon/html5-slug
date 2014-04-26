(function() {
    var platforms, player, cursors, mummy, ground;
    var config = {
        width: 800,
        height: 600
    };
    var game = new Phaser.Game(config.width, config.height, Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update
    });

    function preload() {
        game.load.image('mission1', 'assets/mission-1.png');
        game.load.image('ground', 'assets/platform.png');
        game.load.atlasXML('marco', 'assets/marco.png', 'assets/marco.xml');
        game.load.spritesheet('mummy', 'assets/mummy.png', 37, 45, 18);
    }

    function create() {

        game.world.setBounds(0, 0, 4088, config.height);
        //We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.add.sprite(0, 200, 'mission1');
        //The platforms group contains the ground and the 2 ledges we can jump on
        platforms = game.add.group();

        //We will enable physics for any object that is created in this group
        platforms.enableBody = true;
        // debugger
        // Here we create the ground.
        ground = platforms.create(0, game.world.height - 64, 'ground');

        //Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.scale.setTo(4, 2);

        //This stops it from falling away when you jump on it
        ground.body.immovable = true;

        //Now let's create two ledges
        // var ledge = platforms.create(400, 400, 'ground');

        // ledge.body.immovable = true;

        // ledge = platforms.create(-150, 250, 'ground');

        // ledge.body.immovable = true;

        // The player and its settings
        player = game.add.sprite(300, game.world.height - 150, 'marco');

        game.camera.follow(player);
        //We need to enable physics on the player
        game.physics.arcade.enable(player);

        //Player physics properties. Give the little guy a slight bounce.
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 700;
        player.body.collideWorldBounds = true;

        //Animations
        player.animations.add('walk', null, 10);

        //Mummy
        // createMummy();

        //Cursors
        cursors = game.input.keyboard.createCursorKeys();
    }

    function update() {
        // ground.scale.setTo(2, 2);
        //Collide the player and the stars with the platforms
        game.physics.arcade.collide(player, platforms);

        //Reset the players velocity (movement)
        player.body.velocity.x = 0;

        if (cursors.left.isDown) {
            //Set left direction
            if (player.scale.x != -1) {
                player.scale.x = -1;
            }
            //Move to the left
            player.body.velocity.x = -150;
            // player.scale.x *= -1
            player.flipped = true;
            player.animations.play('walk');
        } else if (cursors.right.isDown) {
            //Set right direction
            if (player.scale.x != 1) {
                player.scale.x = 1;
            }
            //Move to the right
            player.body.velocity.x = 150;
            player.flipped = false;
            player.animations.play('walk');
        } else {
            //Stand still
            player.animations.stop();
            player.frame = 7;
        }

        //Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown && player.body.touching.down) {
            player.body.velocity.y = -500;
        }
    }

    function createMummy() {
        mummy = game.add.sprite(300, 200, 'mummy');
        mummy.scale.x = -1;
        mummy.animations.add('walk');
        mummy.animations.play('walk', 20, true);
    }

    this.game = game;

}).call(App);
(function() {
    var platforms, player, cursors;
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
        game.load.image('sky', 'assets/sky.png');
        game.load.image('ground', 'assets/platform.png');
        game.load.atlasXML('marco', 'assets/marco.png', 'assets/marco.xml');
    }

    function create() {
        //We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //A simple background for our game
        game.add.sprite(0, 0, 'sky');

        //The platforms group contains the ground and the 2 ledges we can jump on
        platforms = game.add.group();

        //We will enable physics for any object that is created in this group
        platforms.enableBody = true;

        // Here we create the ground.
        var ground = platforms.create(0, game.world.height - 64, 'ground');

        //Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.scale.setTo(2, 2);

        //This stops it from falling away when you jump on it
        ground.body.immovable = true;

        //Now let's create two ledges
        var ledge = platforms.create(400, 400, 'ground');

        ledge.body.immovable = true;

        ledge = platforms.create(-150, 250, 'ground');

        ledge.body.immovable = true;

        // The player and its settings
        player = game.add.sprite(32, game.world.height - 150, 'marco');

        //We need to enable physics on the player
        game.physics.arcade.enable(player);

        //Player physics properties. Give the little guy a slight bounce.
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 700;
        player.body.collideWorldBounds = true;


        //Our two animations, walking left and right.
        player.animations.add('left', [8, 9, 10, 0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        //Cursors
        cursors = game.input.keyboard.createCursorKeys();
    }

    function update() {
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
            player.animations.play('left');
        } else if (cursors.right.isDown) {
            //Set right direction
            if (player.scale.x != 1) {
                player.scale.x = 1;
            }
            //Move to the right
            player.body.velocity.x = 150;
            player.flipped = false;
            player.animations.play('right');
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
})();
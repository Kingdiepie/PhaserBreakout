var game = new Phaser.Game(800,600);
var speed = 350;
var ballSpeed = 450;
var dif = 0;
var lives, bricksLeft;

var box = function(options) {
  var bmd = game.add.bitmapData(options.length,options.width);
  bmd.ctx.beginPath();
  bmd.ctx.rect(0,0,options.length,options.width);
  bmd.ctx.fillStyle = options.color;
  bmd.ctx.fill();
  return bmd;
};

var mainState = {
  create: function() {
    lives = 3;
    game.stage.backgroundColor = '#BDC2C5';
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.enableBody = true;
    this.player = game.add.sprite(340, 565, box({length: 120, width: 16, color: '#66FF22'}));
    this.ball = game.add.sprite(400,300, box({length: 12, width: 12, color: '#374A59'}));
    this.cursor = game.input.keyboard.createCursorKeys();
    this.player.body.collideWorldBounds = true;
    this.walls = game.add.group();
    this.walls.enableBody = true;
    var top = this.walls.create(0, 0, box({length: game.world.width, width: 16, color: '#374A59'}));
    var bottom = this.walls.create(0, game.world.height - 16, box({length: game.world.width, width: 16, color: '#374A59'}));
    var leftWall = this.walls.create(0, 16, box({length: 16, width: game.world.height-32, color: '#374A59'}));
    var rightWall = this.walls.create(game.world.width-16,16,box({length:16,width:game.world.height-32,color:'#374A59'}));
    this.brick = game.add.group();
    this.brick.enableBody = true;
    var bricks = [];
    for(i = 0; i < 10; i++){
      for(j = 0; j < 6; j++){
        bricks.push(this.brick.create(i*70+60,j*40+40, box({length: 40, width: 10, color: '#664488'})));
      }
    }
    top.body.immovable =true;
    bottom.body.immovable =true;
    rightWall.body.immovable =true;
    leftWall.body.immovable =true;
    this.player.body.immovable =true;
    this.ball.body.velocity.setTo(0, 200);
    this.ball.body.bounce.setTo(1, 1);
    this.ball.body.collideWorldBounds = true;
    bricksLeft = bricks.length;
    text1 = game.add.text(50, 584,'Bricks Left: ' + bricksLeft, {
        font: "12px Arial",
        fill: "#ffffff",
        align: "left"
    });
    text2 = game.add.text(150, 584,'Lives Left: ' + lives, {
        font: "12px Arial",
        fill: "#ffffff",
        align: "left"
    });
  },
  
  update: function(){
    text1.setText('Bricks Left: ' + bricksLeft);
    game.physics.arcade.collide(this.player, this.walls);
    //game.physics.arcade.collide(this.walls, this.ball);
    this.player.body.velocity.y = 0;
    this.player.body.velocity.x = 0;
    if (this.cursor.left.isDown) {
      this.player.body.velocity.x -= speed;
    } else if (this.cursor.right.isDown) {
      this.player.body.velocity.x += speed;
    }
    game.physics.arcade.overlap(this.player,this.ball,this.bounceBallPaddle,null,this);
    game.physics.arcade.overlap(this.ball,this.brick,this.bounceBrick,null,this);
    game.physics.arcade.overlap(this.walls,this.ball,this.dead,null,this);
    if(bricksLeft === 0){game.state.start('go');}
  },
  
  dead: function(i,j){
    if(this.ball.y>game.world.height - 16){
      lives--;
      this.ball.x =400;
      this.ball.y =300;
      this.player.x = 340;
      this.ball.body.velocity.setTo(0, 200);
      if(lives === 0){game.state.start('go');}
    }
    text2.setText('Lives Left: ' + lives);
    this.ball.body.velocity.x *=  -1;
  },
  
  bounceBallPaddle: function(player,ball){
    if(this.ball.x<this.player.x+60){dif = this.player.x+60-this.ball.x;}
    else {dif = this.player.x+60-this.ball.x;}
    this.ball.body.velocity.y *= -1;
    this.ball.body.velocity.x += dif *2 + Math.floor(Math.random() * (20 - (-20) + 1)) + (-20);
    //this.ball.body.velocity.x *=  -1;
  },
  
  bounceBrick: function(ball,brick){
    brick.kill();
    bricksLeft--;
    this.ball.body.velocity.y *= -1;
    //this.ball.body.velocity.x *= -1;
  }
};

var gameOverState = {
  create: function() {
    label = game.add.text(game.world.width/2,game.world.height/2,'Game Over\nPress SPACE to restart',{
      font:'22px Arial', fill: '000', align: 'center'
    });
    label.anchor.setTo(0.5,0.5);
    this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  },
  update: function() {
    if (this.spacebar.isDown) {game.state.start('main');}
  }
};

game.state.add('main',mainState);
game.state.add('go',gameOverState);
game.state.start('main');
import {config} from '../game'
import {gameSettings} from '../game'
import {BG_WIDTH} from '../game'
import {BG_HEIGHT} from '../game'
import { runInThisContext } from 'vm';
// import { Input, Physics } from 'phaser';
// import Beam from '../objects/beam'
// import Explosion from '../objects/explosions';

export default class MainScene extends Phaser.Scene {
  background: Phaser.GameObjects.TileSprite;
  config: Phaser.Types.Core.GameConfig;
  powerUps: any;
  width: number;
  height: number;
  mainCam: Phaser.Cameras.Scene2D.Camera;
  player: Phaser.Physics.Arcade.Sprite;
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  spacebar: Phaser.Input.Keyboard.Key;
  game: Phaser.Game;
  projectiles: Phaser.GameObjects.Group;
  score: number;
  scoreLabel: Phaser.GameObjects.BitmapText;
  music: any;
  pickupSound: Phaser.Sound.BaseSound;
  bg_width: number;
  bg_height: number;
  fish1: Phaser.GameObjects.Sprite;
  fish2: Phaser.GameObjects.Sprite;
  fish3: Phaser.GameObjects.Sprite;
  fish4: Phaser.GameObjects.Sprite;
  fish5: Phaser.GameObjects.Sprite;
  fish: Phaser.Physics.Arcade.Group;
  inputElement: Phaser.GameObjects.DOMElement
  dir_msg: Phaser.GameObjects.Text;
  pl_model_key: String;
  pause: boolean;

    constructor() {
      super({ key: 'MainScene' });
      this.width = Number(config.scale?.width);
      this.height = Number(config.scale?.height);
      this.bg_width = BG_WIDTH;
      this.bg_height = BG_HEIGHT;
      this.pl_model_key = "_gr"
      this.pause = false;
    }

    create() {
      this.background = this.add.tileSprite(0, 0, 0, 0, "background");
      this.background.setOrigin(0, 0);
      this.background.setScrollFactor(1);

      this.physics.world.setBounds(0, 0, this.bg_width-200, this.bg_height)
      this.physics.world.setBoundsCollision();
      
      this.player = this.physics.add.sprite(this.bg_width/2, this.bg_height/2, "player");
      this.cursorKeys = this.input.keyboard.createCursorKeys();
      this.player.setCollideWorldBounds(true);
      this.player.setScale(2,2);


      this.mainCam = this.cameras.main.startFollow(this.player);
      this.cameras.main.setDeadzone(this.width-this.player.width, this.height-this.player.height);
      this.background.tilePositionX = this.mainCam.scrollX * .3;


      this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

      //this.fish1 = this.physics.add.sprite(0, Phaser.Math.Between(0, this.bg_height), "sunfish");
      this.fish1 = this.physics.add.sprite(0, Phaser.Math.Between(0, this.bg_height), "sunfish");
      this.fish1.play("sunfish_1_right");
      this.fish1.setInteractive();
      this.fish1.setScale(3.5,3.5);

      //TODO: testing for collision accuracy fix
          // this.fish1.input.hitArea = new Phaser.Geom.Circle(9);
          // this.fish1.setDisplaySize(182, 336);

      this.fish2 = this.physics.add.sprite(0, Phaser.Math.Between(0, this.bg_height), "roundfish");
      //this.fish2.play("roundfish_2_right");
      this.fish2.setScale(1.5,1.5);
      this.fish2.setInteractive();
      //this.fish2.setSize(32,32);

      this.fish3 = this.physics.add.sprite(0, Phaser.Math.Between(0, this.bg_height), "large_fish");
      this.fish3.play("large_fish_2_right");
      this.fish3.setInteractive();
      this.fish3.setScale(2,2);
      //this.fish3.setSize(24,24);

      this.fish4 = this.physics.add.sprite(0, Phaser.Math.Between(0, this.bg_height), "roundfish");
      //this.fish4.play("roundfish_2_left");
      this.fish4.setScale(1.5,1.5);

      this.fish5 = this.physics.add.sprite(0, Phaser.Math.Between(0, this.bg_height), "large_fish");
      //this.fish5.play("large_fish_2_left");
      this.fish5.setScale(2,2);


      this.fish = this.physics.add.group();
      this.fish.add(this.fish1);
      this.fish.add(this.fish2);
      this.fish.add(this.fish3);
      this.fish.add(this.fish4);
      this.fish.add(this.fish5);
      

  /*

      this.physics.add.collider(this.projectiles, this.powerUps, function(projectile, powerUp) {
        projectile.destroy();
      });
*/
      this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, undefined, this);
      this.physics.add.overlap(this.player, this.fish, this.checkPlayerBigger, undefined, this);

      var graphics = this.add.graphics();
      graphics.fillStyle(0x000000, 1);
      graphics.beginPath();
      graphics.moveTo(0, 0);
      graphics.lineTo(this.width, 0);
      graphics.lineTo(this.width, 20);
      graphics.lineTo(0, 20);
      graphics.lineTo(0, 0);
      graphics.closePath();
      graphics.fillPath();

      this.score = 0;


      //format the score
      var scoreFormated = this.zeroPad(this.score, 2);
      this.scoreLabel = this.add.bitmapText(this.mainCam.scrollX+10, this.mainCam.scrollY+5, "pixelFont", "SCORE " + scoreFormated , 50);

      this.pickupSound = this.sound.add("audio_pickup");

      //create music
      //this.music = this.sound.add("music");

      var musicConfig = {
        mute: false,
        volume: 1,
        rate: 1,
        detune: 0,
        seek: 0,
        loop: false,
        delay: 0
      }

      //this.music.play(musicConfig);

    }

  
    update() {


      if(this.score == 0){
        this.createInputBox();
      }

      if(!this.pause){
        
        this.movePlayerManager();
        this.movefishRight(this.fish1, 2);
        //this.movefishRight(this.fish2, 6);
        //this.movefishRight(this.fish3, 3);
        //this.movefishLeft(this.fish4, 6);
        //this.movefishLeft(this.fish5, 3);


        
        if (Phaser.Math.Distance.Between(this.player.x, this.player.y, this.fish2.x, this.fish2.y) < 400) { // Attempting to change direction of the fish when it's close to the player
          if (this.player.x < this.fish2.x) { // fish moves right if the player is behind it
            this.movefish2Right();
          }
          else if (this.player.x > this.fish2.x) { // fish moves left if the player is ahead
            this.movefish2Left();
          }
        }
        else {
          this.movefish2Right();
        }

        if (Phaser.Math.Distance.Between(this.player.x, this.player.y, this.fish3.x, this.fish3.y) < 400) { 
          if (this.player.x < this.fish3.x+50) { 
            this.movefish3Right();
          }
          else if (this.player.x > this.fish3.x) { 
            this.movefish3Left();
          }
        }
        else {
          this.movefish3Right();
        }

        if (Phaser.Math.Distance.Between(this.player.x, this.player.y, this.fish4.x, this.fish4.y) < 400) { 
          if (this.player.x < this.fish4.x) { 
            this.movefish4Right();
          }
          else if (this.player.x > this.fish4.x) { 
            this.movefish4Left();
          }
        }
        else {
          this.movefish4Left();
        }

        if (Phaser.Math.Distance.Between(this.player.x, this.player.y, this.fish5.x, this.fish5.y) < 400) { 
          if (this.player.x < this.fish5.x) { 
            this.movefish5Right();
          }
          else if (this.player.x > this.fish5.x) { 
            this.movefish5Left();
          }
        }
        else {
          this.movefish5Left();
        }
    }
    else{
      this.player.setVelocity(0);
    }

      this.scoreLabel.destroy();
      var scoreFormated = this.zeroPad(this.score, 2);
      this.scoreLabel = this.add.bitmapText(this.mainCam.scrollX+15, this.mainCam.scrollY+10, "pixelFont", "SCORE " + scoreFormated , 50);
    }

    pickPowerUp(player, powerUp){
      powerUp.disableBody(true, true);
      this.pickupSound.play();
    }

    zeroPad(number, size){
      var stringNumber = String(number);
      while(stringNumber.length < (size || 2)){
        stringNumber = "0" + stringNumber;
      }
      return stringNumber;
    }

    movePlayerManager(){
      this.player.setVelocity(0);

      if(this.cursorKeys.up?.isDown && this.cursorKeys.right?.isDown){
        this.player.setVelocityY(-gameSettings.playerSpeed/1.2);
        this.player.setVelocityX(gameSettings.playerSpeed/1.2)
        this.player.play("pl_up" + this.pl_model_key, true);
      }
      else if(this.cursorKeys.up?.isDown && this.cursorKeys.left?.isDown){
        this.player.setVelocityY(-gameSettings.playerSpeed/1.2);
        this.player.setVelocityX(-gameSettings.playerSpeed/1.2)
        this.player.play("pl_up" + this.pl_model_key, true);
      }
      else if(this.cursorKeys.down?.isDown && this.cursorKeys.left?.isDown){
        this.player.setVelocityY(gameSettings.playerSpeed/1.2);
        this.player.setVelocityX(-gameSettings.playerSpeed/1.2)
        this.player.play("pl_down" + this.pl_model_key, true);
      }
      else if(this.cursorKeys.down?.isDown && this.cursorKeys.right?.isDown){
        this.player.setVelocityY(gameSettings.playerSpeed/1.2);
        this.player.setVelocityX(gameSettings.playerSpeed/1.2)
        this.player.play("pl_down" + this.pl_model_key, true);
      }
      else if(this.cursorKeys.left?.isDown){
        this.player.setVelocityX(-gameSettings.playerSpeed);
        this.player.play("pl_left" + this.pl_model_key, true);
      }
      else if(this.cursorKeys.right?.isDown){
        this.player.setVelocityX(gameSettings.playerSpeed);
        this.player.play("pl_right" + this.pl_model_key, true);
      }
      else if(this.cursorKeys.up?.isDown){
        this.player.setVelocityY(-gameSettings.playerSpeed);
        this.player.play("pl_up" + this.pl_model_key, true);
      }
      else if(this.cursorKeys.down?.isDown){
        this.player.setVelocityY(gameSettings.playerSpeed);
        this.player.play("pl_down" + this.pl_model_key, true);
      }
    }
  

    destroyShip(pointer, gameObject) {
      gameObject.setTexture("explosion");
      gameObject.play("explode");
    }

    movefish2Right() {
      this.fish2.play("roundfish_2_right", true);
      this.movefishRight(this.fish2, 6);  
    }

    movefish2Left() {
      this.fish2.play("roundfish_2_left", true);
      this.movefishLeft(this.fish2, 6);
    }

    movefish3Right() {
      this.fish3.play("large_fish_2_right", true);
      this.movefishRight(this.fish3, 3);  
    }

    movefish3Left() {
      this.fish3.play("large_fish_2_left", true);
      this.movefishLeft(this.fish3, 3);
    }

    movefish4Right() {
      this.fish4.play("roundfish_2_right", true);
      this.movefishRight(this.fish4, 6);  
    }

    movefish4Left() {
      this.fish4.play("roundfish_2_left", true);
      this.movefishLeft(this.fish4, 6);
    }

    movefish5Right() {
      this.fish5.play("large_fish_2_right", true);
      this.movefishRight(this.fish5, 3);  
    }

    movefish5Left() {
      this.fish5.play("large_fish_2_left", true);
      this.movefishLeft(this.fish5, 3);
    }

    movefishRight(fish, speed) {
      fish.x += speed;
      if (fish.x > this.bg_width) {
        this.resetFishPosLeft(fish);
      }
    }

    movefishLeft(fish, speed) {
      fish.x -= speed;
      if (fish.x < 0) {
        this.resetFishPosRight(fish);
      }
    }

    moveFish(fish, speed) {
      fish.x += speed;
      if (fish.x > this.bg_width) {
        this.resetFishPos(fish);
      }
    }

    resetFishPosRight(fish) {
      var randomY = Phaser.Math.Between(0, this.bg_height);
      fish.x = this.bg_width;
      fish.y = randomY;
    }

    resetFishPosLeft(fish) {
      var rand = Phaser.Math.Between(0, 1); //TODO: for going left or right
      var randomY = Phaser.Math.Between(0, this.bg_height);
      fish.x = 0;
      fish.y = randomY;
    }

    resetFishPos(fish) {
      var randomY = Phaser.Math.Between(0, this.bg_height);
      fish.x = this.bg_width;
      fish.y = randomY;
    }


    checkPlayerBigger(player, fish) {     //checks if the player is bigger than the fish it collided with
      const fish_rec = this.getArea(fish.getBounds());
      const player_rec = this.getArea(player.getBounds());
      if(player_rec > fish_rec){
        this.resetFishPosRight(fish);
        this.score += 1;
        var scoreFormated = this.zeroPad(this.score, 2);
        this.scoreLabel.text = "SCORE " + scoreFormated;
        return true;
      }
      else if(this.player.alpha < 1){
        return false;
      }
      else{
        this.resetPlayer();
        return false;
      }
    }

    getArea(rec:Phaser.Geom.Rectangle){     //returns the area of a phaser rectangle
      const h = rec.height;
      const w = rec.width;
      return (h*w);
    }

    resetPlayer(){
      var x = this.bg_width/2;
      var y = this.bg_height/5;

      this.player.enableBody(true, x, y, true, true);
      this.mainCam.centerOn(this.bg_width/2, this.bg_height/2)

      //take 30 points from the player
      if(this.score <= 0){
        this.score -= 1;
        var scoreFormated = this.zeroPad(this.score, 2);
        this.scoreLabel.text = "SCORE " + scoreFormated;
      }
  
      //make the player transparent to indicate invulnerability
      this.player.alpha = 0.5;

      //move the ship from outside the screen to its original position
      var tween = this.tweens.add({
        targets: this.player,
        y: this.height - 64,
        ease: 'Power1',
        duration: 1500,
        repeat:0,
        onComplete: this.onTweenComplete,
        callbackScope: this
      });

      
    }
  
    onTweenComplete(){
      this.player.alpha = 1;
    }

    changeShark(){    //TODO add change shark method

    }


    createInputBox(){
      let context = this;
      //this.pause = true;

      if(this.dir_msg != null){
      this.dir_msg.destroy();
      }
      if(this.inputElement != null){
        this.inputElement.destroy();
        }


      this.dir_msg = this.add.text(this.mainCam.scrollX+this.width/2 - 175, this.mainCam.scrollY+this.height/4, 
        'Enter \'shark.color(white)\'', { color: 'white', fontSize: '20px '});

      this.inputElement = this.add.dom(this.mainCam.scrollX+this.width/2, 
        this.mainCam.scrollY+this.height/4+50).createFromCache('inputform');

      this.inputElement.addListener('click');

      this.inputElement.on('click', function (event) {

      if (event.target.name === 'playButton')
      {
          let inputText = <HTMLInputElement>context.inputElement.getChildByName('inputField');

          //  Have they entered anything?
          if (inputText.value == 'shark.color(white)')
          {
              //  Turn off the click events
              context.inputElement.removeListener('click');

              //  Hide the login element
              context.inputElement.setVisible(false);

              //  Populate the text with whatever they typed in
              //context.dir_msg.setText("The shark will now change apparence (in future version)");
              context.pl_model_key = "_wh";
              context.pause = false;
          }
          else{
            context.dir_msg.text = 'Please enter the following exactly as written: \'shark.color(white)\'';

                //  Flash the prompt
                  // this.scene.tweens.add({
                  //     targets: text,
                  //     alpha: 0.2,
                  //     duration: 250,
                  //     ease: 'Power3',
                  //     yoyo: true
                  // });
              }
      }

      });
      
    }

  

}




//------------------------------------------------------------------------------------
//legacy code to be removed or repurposed 



  /*

  
      this.input.on('gameobjectdown', this.destroyShip, this);

      // this.add.text(20, 20, "Playing game", {
      //   font: "25px Arial",
      //   fill: "yellow"
      // });
  
      


      this.powerUps = this.physics.add.group();
  
      var maxObjects = 4;
      for (var i = 0; i <= maxObjects; i++) {
        var powerUp = this.physics.add.sprite(16, 16, "power-up");
        this.powerUps.add(powerUp);
         powerUp.setRandomPosition(0, 0, this.width, this.height);
  
        // set random animation
        if (Math.random() > 0.5) {
          powerUp.play("red");
        } else {
          powerUp.play("gray");
        }
  
        // setVelocity
        powerUp.setVelocity(100, 100);
        powerUp.setCollideWorldBounds(true);
        powerUp.setBounce(1);
  
      }
     

      if(Phaser.Input.Keyboard.JustDown(this.spacebar)){
        if(this.player.active){
          this.shootBeam();
      }
      }
      for(var i = 0; i < this.projectiles.getChildren().length; i++){
        var beam = this.projectiles.getChildren()[i];
        beam.update();
      }

    hurtPlayer(player, enemy){
      this.resetShipPos(enemy);
      if(this.player.alpha < 1){
        return;
      }

      var explosion = new Explosion(this, player.x, player.y);
      player.disableBody(true, true);

      this.time.addEvent({
        delay: 1000,
        callback: this.resetPlayer,
        callbackScope: this,
        loop: false
      });
    }


*/
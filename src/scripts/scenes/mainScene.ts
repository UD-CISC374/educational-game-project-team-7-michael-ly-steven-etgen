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
  fish1_sp: number;
  fish2_sp: number;
  fish3_sp: number;
  fish4_sp: number;
  fish5_sp: number;
  fish1_dir: string;
  fish2_dir: string;
  fish3_dir: string;
  fish4_dir: string;
  fish5_dir: string;
  fish1_old_dir: string;
  fish2_old_dir: string;
  fish3_old_dir: string;
  fish4_old_dir: string;
  fish5_old_dir: string;
  inputElement: Phaser.GameObjects.DOMElement
  dir_msg: Phaser.GameObjects.Text;
  pl_model_key: string;
  pause: boolean;
  color_box_made: boolean;
  size_box_made: boolean;

    constructor() {
      super({ key: 'MainScene' });
      this.width = Number(config.scale?.width);
      this.height = Number(config.scale?.height);
      this.bg_width = BG_WIDTH;
      this.bg_height = BG_HEIGHT;
      this.pl_model_key = "_gr"
      this.pause = false;
      this.fish1_sp = 2;
      this.fish1_dir = "right";
      this.fish1_old_dir = "right";
      this.fish2_sp = 6;
      this.fish2_dir = "right";
      this.fish2_old_dir = "right";
      this.fish3_sp = 3;
      this.fish3_dir = "right";
      this.fish3_old_dir = "right";
      this.fish4_sp = -5;
      this.fish4_dir = "left";
      this.fish4_old_dir = "left";
      this.fish5_sp = -4;
      this.fish5_dir = "left";
      this.fish5_old_dir = "left";
      this.score = 0;
      this.color_box_made = false;
      this.size_box_made = false;
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
      this.fish2.play("roundfish_2_right");
      this.fish2.setScale(1.5,1.5);
      this.fish2.setInteractive();

      //this.fish2.setSize(32,32);

      this.fish3 = this.physics.add.sprite(0, Phaser.Math.Between(0, this.bg_height), "large_fish");
      this.fish3.play("large_fish_2_right");
      this.fish3.setInteractive();
      this.fish3.setScale(2,2);

      //this.fish3.setSize(24,24);

      this.fish4 = this.physics.add.sprite(this.bg_width, Phaser.Math.Between(0, this.bg_height), "roundfish");
      this.fish4.play("roundfish_2_left");
      this.fish4.setScale(1.5,1.5);


      this.fish5 = this.physics.add.sprite(this.bg_width, Phaser.Math.Between(0, this.bg_height), "large_fish");
      this.fish5.play("large_fish_2_left");
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


      if(this.score == 15 && this.size_box_made == false) {
        this.changeSharkSize();
        this.size_box_made = true;
      }
      else if(this.score % 5 == 0 && this.color_box_made == false && this.score != 0) {
        this.changeSharkColor();
        this.color_box_made = true;
      }



      if(!this.pause){
        
        this.movePlayerManager();

        this.fishMover();
      }
      else{
        this.player.setVelocity(0);
      }


        


        
        // if (Phaser.Math.Distance.Between(this.player.x, this.player.y, this.fish2.x, this.fish2.y) < 400) { // Attempting to change direction of the fish when it's close to the player
        //   if (this.player.x < this.fish2.x) { // fish moves right if the player is behind it
        //     this.fish1_dir = "right";
        //     this.fish1_sp = this.reverseSpeed(this.fish1_sp);
        //   }
        //   else if (this.player.x > this.fish2.x) { // fish moves left if the player is ahead
        //     this.fish1_dir = "left";
        //     this.fish1_sp = this.reverseSpeed(this.fish1_sp);
        //   }
        //   this.fish1Mover();
        // }


        // if (Phaser.Math.Distance.Between(this.player.x, this.player.y, this.fish3.x, this.fish3.y) < 400) { 
        //   if (this.player.x < this.fish3.x+50) { 
        //     this.movefish3Right();
        //   }
        //   else if (this.player.x > this.fish3.x) { 
        //     this.movefish3Left();
        //   }
        // }
        // else {
        //   this.movefish3Right();
        // }

        // if (Phaser.Math.Distance.Between(this.player.x, this.player.y, this.fish4.x, this.fish4.y) < 400) { 
        //   if (this.player.x < this.fish4.x) { 
        //     this.movefish4Right();
        //   }
        //   else if (this.player.x > this.fish4.x) { 
        //     this.movefish4Left();
        //   }
        // }
        // else {
        //   this.movefish4Left();
        // }

        // if (Phaser.Math.Distance.Between(this.player.x, this.player.y, this.fish5.x, this.fish5.y) < 400) { 
        //   if (this.player.x < this.fish5.x) { 
        //     this.movefish5Right();
        //   }
        //   else if (this.player.x > this.fish5.x) { 
        //     this.movefish5Left();
        //   }
        // }
        // else {
        //   this.movefish5Left();
        // }


      this.scoreLabel.destroy();
      var scoreFormated = this.zeroPad(this.score, 2);
      this.scoreLabel = this.add.bitmapText(this.mainCam.scrollX+15, this.mainCam.scrollY+10, "pixelFont", "SCORE " + scoreFormated , 50);
    
    
    }

    
  fish1Mover(){

    //checks the dir and changes the it if necessary for each fish
    let dir1 = this.moveFish(this.fish1, this.fish1_sp)
    if(dir1 != ""){
      this.fish1_dir = dir1;
      dir1 = "";
    }

    //changes the animation when the fish direction changes
    if(this.fish1_old_dir != this.fish1_dir){
      this.fish1_sp = this.reverseSpeed(this.fish1_sp);
      let anim = "sunfish_1_".concat(this.fish1_dir);
      this.fish1.play(anim);
      this.fish1_old_dir = this.fish1_dir;
    }

  }


  fish2Mover(){

    //checks the dir and changes the it if necessary for each fish
    let dir2 = this.moveFish(this.fish2, this.fish2_sp);
    if(dir2 != ""){
      this.fish2_dir = dir2;
      dir2 = "";
    }

    //changes the animation when the fish direction changes
    if(this.fish2_old_dir != this.fish2_dir){
      this.fish2_sp = this.reverseSpeed(this.fish2_sp);
      let anim = "roundfish_2_".concat(this.fish2_dir);
      this.fish2.play(anim);
      this.fish2_old_dir = this.fish2_dir;
    }

  }

  fish3Mover(){

    //checks the dir and changes the it if necessary for each fish
    let dir3 = this.moveFish(this.fish3, this.fish3_sp);
    if(dir3 != ""){
      this.fish3_dir = dir3;
      dir3 = "";
    }

    //changes the animation when the fish direction changes
    if(this.fish3_old_dir != this.fish3_dir){
      this.reverseSpeed(this.fish3_sp);
      let anim = "large_fish_2_".concat(this.fish3_dir);
      this.fish3.play(anim);
      this.fish3_old_dir = this.fish3_dir;
    }

  }

  fish4Mover(){

    //checks the dir and changes the it if necessary for each fish
    let dir4 = this.moveFish(this.fish4, this.fish4_sp);
    if(dir4 != ""){
      this.fish4_dir = dir4;
      dir4 = "";
    }

    //changes the animation when the fish direction changes
    if(this.fish4_old_dir != this.fish4_dir){
      this.fish4_sp = this.reverseSpeed(this.fish4_sp);
      let anim = "roundfish_2_".concat(this.fish4_dir);
      this.fish4.play(anim);
      this.fish4_old_dir = this.fish4_dir;
    }

  }

  fish5Mover(){

    //checks the dir and changes the it if necessary for each fish
    let dir5 = this.moveFish(this.fish5, this.fish5_sp);
    if(dir5 != ""){
      this.fish5_dir = dir5;
      dir5 = "";
    }

    //changes the animation when the fish direction changes
    if(this.fish5_old_dir != this.fish5_dir){
      this.fish5_sp = this.reverseSpeed(this.fish5_sp);
      let anim = "large_fish_2_".concat(this.fish5_dir);
      this.fish5.play(anim);
      this.fish5_old_dir = this.fish5_dir;
    }

  }
  
  fishMover() { //handles the movement and direction changes for all of the fish

    this.fish1Mover();
    this.fish2Mover();
    this.fish3Mover();
    this.fish4Mover();
    this.fish5Mover();
    
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

    moveFish(fish, speed):string {
      let dir = "";

      fish.x += speed;

      if (fish.x > this.bg_width || fish.x < 0) {
        var rand = Phaser.Math.Between(0, 1);

        if(rand == 0){
          this.resetFishPosRight(fish);
          dir = "right"
        }
        else{
          this.resetFishPosLeft(fish);
          dir = "left";
        }
      }

      return dir;


    }

    resetFishPosRight(fish) {
      var randomY = Phaser.Math.Between(0, this.bg_height);
      fish.x = 0;
      fish.y = randomY;
    }

    resetFishPosLeft(fish) {
      var randomY = Phaser.Math.Between(0, this.bg_height);
      fish.x = this.bg_width;
      fish.y = randomY;
    }

    reverseSpeed(speed){
      speed = speed * -1;
      return speed;
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
      if(this.score > 0){
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

    changeSharkSize(){    //TODO add change shark method
      let context = this;
      this.pause = true;

      if(this.dir_msg != null){
      this.dir_msg.destroy();
      }

      if(this.inputElement != null){
        this.inputElement.removeElement;
      }

      this.dir_msg = this.add.text(this.mainCam.scrollX+this.width/2 - 175, this.mainCam.scrollY+this.height/7, 
        'Enter \'shark.size(2)\'', { color: 'white', fontSize: '20px '});

      this.inputElement = this.add.dom(this.mainCam.scrollX+this.width/2, 
      this.mainCam.scrollY+this.height/4+50).createFromCache('sizeform');

      this.inputElement.addListener('click');


      this.inputElement.on('click', function (event) {

      if (event.target.name === 'methodButton')
      {
        console.log("inside event");
          let inputText = <HTMLInputElement>context.inputElement.getChildByName('inputField');

          //  Have they entered anything?
          if (inputText.value == 'shark.size(2)')
          {
              //  Turn off the click events
              context.inputElement.removeListener('click');

              //  Hide the login element
              context.inputElement.setVisible(false);

              //  Populate the text with whatever they typed in
              //context.dir_msg.setText("The shark will now change apparence (in future version)");

              if(context.dir_msg != null){    //destroy the message
                context.dir_msg.destroy();
              }
              context.player.setScale(3,3)   //change player size
              context.pause = false;        //unpause game
          }
          else{
            context.dir_msg.text = 'Please enter the following exactly as written: \'shark.size(2)\'';
              }
      }

      });
    }


    changeSharkColor(){
      let context = this;
      this.pause = true;

      if(this.dir_msg != null){
      this.dir_msg.destroy();
      }

      if(this.inputElement != null){
        this.inputElement.removeElement;
      }

      this.dir_msg = this.add.text(this.mainCam.scrollX+this.width/2 - 175, this.mainCam.scrollY+this.height/10, 
        'Enter \'shark.color(white)\'', { color: 'white', fontSize: '20px '});

      this.inputElement = this.add.dom(this.mainCam.scrollX+this.width/2, 
      this.mainCam.scrollY+this.height/4+50).createFromCache('colorform');

      this.inputElement.addListener('click');


      this.inputElement.on('click', function (event) {

      if (event.target.name === 'methodButton')
      {
        console.log("inside event");
          let inputText = <HTMLInputElement>context.inputElement.getChildByName('inputField');

          //  Have they entered anything?
          if (inputText.value == 'shark.color(white)' || inputText.value == 'shark.color(gray)' || 
          inputText.value == 'shark.color(black)' || inputText.value == 'shark.color(green)')
          {
              //  Turn off the click events
              context.inputElement.removeListener('click');
              //  Hide the login element
              context.inputElement.setVisible(false);
              //  Populate the text with whatever they typed in
              //context.dir_msg.setText("The shark will now change apparence (in future version)");
              if (inputText.value == 'shark.color(gray)'){
                context.pl_model_key = "_gr";
              }
              else if (inputText.value == 'shark.color(white)'){
                context.pl_model_key = "_wh";
              }
              else if (inputText.value == 'shark.color(black)'){
                context.pl_model_key = "_bl";
              }
              else if (inputText.value == 'shark.color(green)'){
                context.pl_model_key = "_grn";
              }

              if(context.dir_msg != null){    //destroy the message
                context.dir_msg.destroy();
              }
              context.player.play("pl_down" + context.pl_model_key, true);   //change player color
              context.pause = false;        //unpause game
          }
          else{
            context.dir_msg.text = 'Please enter the following in the form of: \'shark.color(white)\'';

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
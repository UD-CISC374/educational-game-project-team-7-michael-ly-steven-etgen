import {config} from '../game'
import {gameSettings} from '../game'
import {BG_WIDTH} from '../game'
import {BG_HEIGHT} from '../game'

export default class InstructScene2 extends Phaser.Scene {
    nextButton: Phaser.GameObjects.Sprite;
    background: Phaser.GameObjects.TileSprite;
    config: Phaser.Types.Core.GameConfig;
    powerUps: any;
    width: number;
    height: number;
    mainCam: Phaser.Cameras.Scene2D.Camera;
    player: Phaser.Physics.Arcade.Sprite;
    cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    bg_width: number;
    bg_height: number;
    bg_surface_height: number;
    pl_model_key: string;
    player_speed: number;
    fish1: Phaser.GameObjects.Sprite;
    fish2: Phaser.GameObjects.Sprite;
    fish3: Phaser.GameObjects.Sprite;
    fish: Phaser.Physics.Arcade.Group;

    constructor() {
        super({ key: 'InstructScene2' });
        this.width = Number(config.scale?.width);
        this.height = Number(config.scale?.height);
        this.bg_width = BG_WIDTH;
        this.bg_height = BG_HEIGHT;
        this.bg_surface_height = BG_HEIGHT-1850;
        this.pl_model_key = "_gr";
        this.player_speed = gameSettings.playerSpeed;
    }

    preload() {
        this.load.spritesheet("next", "./assets/images/next.png",{
            frameWidth: 208,
            frameHeight: 77
        });
    }

    create() {
        this.background = this.add.tileSprite(0, 0, 0, 0, "background");
        this.background.setOrigin(0, 0);
        this.background.setScrollFactor(1);

        this.add.text(this.bg_width/2-400, 600, 
            'Eat fish smaller than you to gain points! Avoid fish bigger \nthan you. If you attempt to eat them, you will lose points \nand respawn. \n*Hint: In the actual game, fish smaller than you will try to \nswim the other way if they get too lose.', 
            {fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', 
            fontSize: '40px' 
        });

        this.nextButton = this.add.sprite(this.bg_width/2, 900, "next").setInteractive();
        this.nextButton.on('pointerdown', () => {
            this.scene.start("InstructScene3");
        });
      
        this.nextButton.on('pointerover', () => {
            this.nextButton.setAlpha(1);
        });
      
        this.nextButton.on('pointerout', () => {
            this.nextButton.setAlpha(0.5);
        });

        this.physics.world.setBounds(0, 0, this.bg_width-200, this.bg_height)
        this.physics.world.setBoundsCollision();
      
        this.player = this.physics.add.sprite(this.bg_width/2, this.bg_surface_height/2, "player");
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.player.setCollideWorldBounds(true);
        this.player.setScale(2,2);

        this.mainCam = this.cameras.main.startFollow(this.player);
        this.cameras.main.setDeadzone(this.width-this.player.width, this.height-this.player.height - 30);
        this.background.tilePositionX = this.mainCam.scrollX * .3;

        this.fish1 = this.physics.add.sprite(200, Phaser.Math.Between(0, this.bg_surface_height-200), "sunfish");
        this.fish1.play("sunfish_1_right");
        this.fish1.setInteractive();
        this.fish1.setScale(3.5,3.5);

        this.fish2 = this.physics.add.sprite(200, Phaser.Math.Between(0, this.bg_surface_height-200), "roundfish");
        this.fish2.play("roundfish_2_right");
        this.fish2.setScale(1.5,1.5);
        this.fish2.setInteractive();

        this.fish3 = this.physics.add.sprite(200, Phaser.Math.Between(0, this.bg_surface_height-200), "large_fish");
        this.fish3.play("large_fish_2_right");
        this.fish3.setInteractive();
        this.fish3.setScale(2,2);

        this.fish = this.physics.add.group();
        this.fish.add(this.fish1);
        this.fish.add(this.fish2);
        this.fish.add(this.fish3);

        this.physics.add.overlap(this.player, this.fish, this.checkPlayerBigger, undefined, this);
    }

    update() {
        this.movePlayerManager();
        this.movefishRight(this.fish1, 2);
        this.movefishRight(this.fish2, 6);
        this.movefishRight(this.fish3, 3);
    }

    movePlayerManager(){
        this.player.setVelocity(0);
  
        if(this.cursorKeys.up?.isDown && this.cursorKeys.right?.isDown){
          this.player.setVelocityY(-this.player_speed/1.2);
          this.player.setVelocityX(this.player_speed/1.2)
          this.player.play("pl_up" + this.pl_model_key, true);
        }
        else if(this.cursorKeys.up?.isDown && this.cursorKeys.left?.isDown){
          this.player.setVelocityY(-this.player_speed/1.2);
          this.player.setVelocityX(-this.player_speed/1.2)
          this.player.play("pl_up" + this.pl_model_key, true);
        }
        else if(this.cursorKeys.down?.isDown && this.cursorKeys.left?.isDown){
          this.player.setVelocityY(this.player_speed/1.2);
          this.player.setVelocityX(-this.player_speed/1.2)
          this.player.play("pl_down" + this.pl_model_key, true);
        }
        else if(this.cursorKeys.down?.isDown && this.cursorKeys.right?.isDown){
          this.player.setVelocityY(this.player_speed/1.2);
          this.player.setVelocityX(this.player_speed/1.2)
          this.player.play("pl_down" + this.pl_model_key, true);
        }
        else if(this.cursorKeys.left?.isDown){
          this.player.setVelocityX(-this.player_speed);
          this.player.play("pl_left" + this.pl_model_key, true);
        }
        else if(this.cursorKeys.right?.isDown){
          this.player.setVelocityX(this.player_speed);
          this.player.play("pl_right" + this.pl_model_key, true);
        }
        else if(this.cursorKeys.up?.isDown){
          this.player.setVelocityY(-this.player_speed);
          this.player.play("pl_up" + this.pl_model_key, true);
        }
        else if(this.cursorKeys.down?.isDown){
          this.player.setVelocityY(this.player_speed);
          this.player.play("pl_down" + this.pl_model_key, true);
        }
      }

      resetPlayer(){
        var x = this.bg_width/2;
        var y = this.bg_surface_height/5;
  
        this.player.enableBody(true, x, y, true, true);
        this.mainCam.centerOn(this.bg_width/2, this.bg_surface_height/2);
    
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

      checkPlayerBigger(player, fish) {     //checks if the player is bigger than the fish it collided with
        const fish_rec = this.getArea(fish.getBounds());
        const player_rec = this.getArea(player.getBounds());
        if(player_rec > fish_rec){
          this.resetFishPos(fish);
          this.sound.play("bite");
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

      movefishRight(fish, speed) {
        fish.x += speed;
        if (fish.x > this.bg_width) {
          this.resetFishPos(fish);
        }
      }

      resetFishPos(fish) {
        var randomY = Phaser.Math.Between(0, this.bg_surface_height-200);
        fish.x = 0;
        fish.y = randomY;
      }
}
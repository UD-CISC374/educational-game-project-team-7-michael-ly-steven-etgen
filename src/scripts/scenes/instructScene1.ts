import {config} from '../game'
import {gameSettings} from '../game'
import {BG_WIDTH} from '../game'
import {BG_HEIGHT} from '../game'

export default class InstructScene1 extends Phaser.Scene {
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

    constructor() {
        super({ key: 'InstructScene1' });
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

        this.add.text(this.bg_width/2 - 250, 600, 
            'Use arrow keys to move around!', 
            {fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', 
            fontSize: '40px' 
        });

        this.nextButton = this.add.sprite(this.bg_width/2, 800, "next").setInteractive();
        this.nextButton.on('pointerdown', () => {
            this.scene.start("InstructScene2");
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
    }

    update() {
        this.movePlayerManager();
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
}
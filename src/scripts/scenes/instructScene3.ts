import {config} from '../game'
import {gameSettings} from '../game'
import {BG_WIDTH} from '../game'
import {BG_HEIGHT} from '../game'

export default class InstructScene3 extends Phaser.Scene {
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
    inputElement: Phaser.GameObjects.DOMElement
    dir_msg: Phaser.GameObjects.Text;
    pause: boolean;

    constructor() {
        super({ key: 'InstructScene3' });
        this.width = Number(config.scale?.width);
        this.height = Number(config.scale?.height);
        this.bg_width = BG_WIDTH;
        this.bg_height = BG_HEIGHT;
        this.bg_surface_height = BG_HEIGHT-1850;
        this.pl_model_key = "_gr";
        this.player_speed = gameSettings.playerSpeed;
        this.pause = false;
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

        this.add.text(this.bg_width/2-500, 1200, 
            'After you gain enough points, you will be prompted with \nan input box as shown above! You can call methods to \nchange attributes and customize your shark. This will allow you to \npractice calling methods. \n\n*Note: color is simple to personalize the looks of the shark. You can also \nchange the size and speed of the shark.\nWin the game by becoming the apex predator of the ocean!', 
            {fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', 
            fontSize: '40px' 
        });

        this.nextButton = this.add.sprite(this.bg_width/2, 1650, "next").setInteractive();
        this.nextButton.on('pointerdown', () => {
            this.scene.start("PreloadScene");
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
        
        this.changeSharkColor();
    }

    movePlayerManager() {
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
          'Enter \'shark.setColor(white)\'', { color: 'white', fontSize: '20px '});
  
        this.inputElement = this.add.dom(this.mainCam.scrollX+this.width/2, 
        this.mainCam.scrollY+this.height/4+50).createFromCache('colorform');
  
        this.inputElement.addListener('click');
  
  
        this.inputElement.on('click', function (event) {
  
        if (event.target.name === 'methodButton')
        {
            let inputText = <HTMLInputElement>context.inputElement.getChildByName('inputField');
  
            //  Have they entered anything?
            if (inputText.value == 'shark.setColor(white)' || inputText.value == 'shark.setColor(gray)' || 
            inputText.value == 'shark.setColor(black)' || inputText.value == 'shark.setColor(green)')
            {
                //  Turn off the click events
                context.inputElement.removeListener('click');
                //  Hide the login element
                context.inputElement.setVisible(false);
                //  Populate the text with whatever they typed in
                //context.dir_msg.setText("The shark will now change apparence (in future version)");
                if (inputText.value == 'shark.setColor(gray)'){
                  context.pl_model_key = "_gr";
                }
                else if (inputText.value == 'shark.setColor(white)'){
                  context.pl_model_key = "_wh";
                }
                else if (inputText.value == 'shark.setColor(black)'){
                  context.pl_model_key = "_bl";
                }
                else if (inputText.value == 'shark.setColor(green)'){
                  context.pl_model_key = "_grn";
                }
  
                if(context.dir_msg != null){    //destroy the message
                  context.dir_msg.destroy();
                }
                context.player.play("pl_down" + context.pl_model_key, true);   //change player color
                context.pause = false;        //unpause game
            }
            else {
              context.dir_msg.text = 'Please enter the following in the form of: \'shark.setColor(white)\'';
            }
          }
        }); 
      }
}
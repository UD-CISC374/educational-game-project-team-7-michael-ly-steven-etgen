import { config } from "../game";

export default class PreloadScene extends Phaser.Scene {
  gameButton: Phaser.GameObjects.Sprite;
  gameText: Phaser.GameObjects.Text;
  width: number;
  height: number;
  splash: Phaser.GameObjects.TileSprite;

    constructor() {
    super({ key: 'PreloadScene' });
    this.width = Number(config.scale?.width);
    this.height = Number(config.scale?.height)
  }

  preload(){
    this.load.image("background", "./assets/images/background.png");

    this.load.html("inputform", "./assets/text/inputform.html")
    
    //load the spritesheet
    this.load.spritesheet("player", "./assets/spritesheets/shark_sprites.png",{
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.spritesheet("play1", "./assets/images/play1.png",{
      frameWidth: 733,
      frameHeight: 358
    });
    this.load.spritesheet("play2", "./assets/images/play2.png",{
      frameWidth: 733,
      frameHeight: 358
    });
    this.load.spritesheet("splash", "./assets/images/splash.png",{
      frameWidth: 2820,
      frameHeight: 2000
    });
    this.load.spritesheet("fish1", "./assets/spritesheets/fish1.png",{
      frameWidth: 390,
      frameHeight: 182
    });
    this.load.spritesheet("fish2", "./assets/spritesheets/fish2.png",{
      frameWidth: 364,
      frameHeight: 208
    });
    this.load.spritesheet("large_fish", "./assets/spritesheets/fish_spritesheet_1.png",{
      frameWidth: 48,
      frameHeight: 48
    });
    this.load.spritesheet("med_fish", "./assets/spritesheets/fish_spritesheet_2.png",{
      frameWidth: 48,
      frameHeight: 48
    });
    this.load.spritesheet("small_fish", "./assets/spritesheets/fish_spritesheet_3.png",{
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("roundfish", "./assets/spritesheets/fish_spritesheet_4.png",{
      frameWidth: 48,
      frameHeight: 48
    });
    this.load.spritesheet("sunfish", "./assets/spritesheets/fish_spritesheet_5.png",{
      frameWidth: 52,
      frameHeight: 96
    });

    this.load.bitmapFont("pixelFont", "./assets/font/font.png", "./assets/font/font.xml");

    this.load.audio("audio_pickup", ["./assets/sounds/pickup.ogg", "./assets/sounds/pickup.mp3"]);
  }

  create() {
    this.add.text(20,20, "Loading...", {fill: "black"});


    //Player animations
    this.anims.create({
      key: "pl_right_gr",
      frames: this.anims.generateFrameNumbers("player", {
        start: 24,
        end: 26
      }),
      frameRate: 10,
      repeat: -1,
    });this.anims.create({
      key: "pl_left_gr",
      frames: this.anims.generateFrameNumbers("player", {
        start: 12,
        end: 14
      }),
      frameRate: 10,
      repeat: -1,
    });this.anims.create({
      key: "pl_up_gr",
      frames: this.anims.generateFrameNumbers("player", {
        start: 36,
        end: 38
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "pl_down_gr",
      frames: this.anims.generateFrameNumbers("player", {
        start: 0,
        end: 2
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "pl_right_wh",
      frames: this.anims.generateFrameNumbers("player", {
        start: 72,
        end: 74
      }),
      frameRate: 10,
      repeat: -1,
    });this.anims.create({
      key: "pl_left_wh",
      frames: this.anims.generateFrameNumbers("player", {
        start: 60,
        end: 62
      }),
      frameRate: 10,
      repeat: -1,
    });this.anims.create({
      key: "pl_up_wh",
      frames: this.anims.generateFrameNumbers("player", {
        start: 84,
        end: 86
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "pl_down_wh",
      frames: this.anims.generateFrameNumbers("player", {
        start: 48,
        end: 50
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Fish animations
    this.anims.create({
      key: "fish1_anim",
      frames: this.anims.generateFrameNumbers("fish1", {
        start: 0,
        end: 7
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "fish2_anim",
      frames: this.anims.generateFrameNumbers("fish2", {
        start: 0,
        end: 7
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "sunfish_1_left",
      frames: this.anims.generateFrameNumbers("sunfish", {
        start: 12,
        end: 14
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "sunfish_1_right",
      frames: this.anims.generateFrameNumbers("sunfish", {
        start: 24,
        end: 26
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "roundfish_2_left",
      frames: this.anims.generateFrameNumbers("roundfish", {
        start: 15,
        end: 17
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "roundfish_2_right",
      frames: this.anims.generateFrameNumbers("roundfish", {
        start: 27,
        end: 29
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "large_fish_2_left",
      frames: this.anims.generateFrameNumbers("large_fish", {
        start: 15,
        end: 17
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "large_fish_2_right",
      frames: this.anims.generateFrameNumbers("large_fish", {
        start: 27,
        end: 29
      }),
      frameRate: 10,
      repeat: -1
    });

    this.splash = this.add.tileSprite(this.width/2, this.height/2, 3000, 1500, "splash");

    this.gameButton = this.add.sprite(100, 200, "play1").setInteractive();
    this.centerButton(this.gameButton, 1);
    
    
    this.gameButton.on('pointerdown', () => this.clickButton());

    this.input.on('pointerover', function (event, gameObjects) {
      gameObjects[0].setTexture("play2");
    });
      
    this.input.on('pointerout', function (event, gameObjects) {
      gameObjects[0].setTexture("play1");
    });
            
      //this.scene.start('MainScene');

      //TODO: Add a real help menu
      this.add.text(400, 200,
        'Directions:\nUse the arrow keys to control the shark. Collect fish that you are bigger than \nto gain points, but don\'t try to eat fish that is bigger than you are\! \n Collect 5 points to gain access to your first method. \nPlay through the game to learn about methods in programming!', { color: 'black', fontSize: '20px '});
  }


  centerButton (gameObject, offset = 0) {
    Phaser.Display.Align.In.Center(
      gameObject,
      this.add.zone(this.width/2, this.height/2 - offset * 100, this.width, this.height)
    );
  }

  public clickButton() {
    this.scene.start('MainScene');
  }

}

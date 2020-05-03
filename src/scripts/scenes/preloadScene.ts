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

    this.load.html("colorform", "./assets/text/colorform.html")
    this.load.html("sizeform", "./assets/text/sizeform.html")
    this.load.html("speedform", "./assets/text/speedform.html")

    
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
    this.load.spritesheet("sea_floor", "/assets/images/sea_floor.png",{
      frameWidth: 2160,
      frameHeight: 500,
    });
    this.load.spritesheet("megalodon", "./assets/spritesheets/megalodon.png", {
      frameWidth: 152,
      frameHeight: 144
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
    this.anims.create({
      key: "pl_right_bl",
      frames: this.anims.generateFrameNumbers("player", {
        start: 81,
        end: 83
      }),
      frameRate: 10,
      repeat: -1,
    });this.anims.create({
      key: "pl_left_bl",
      frames: this.anims.generateFrameNumbers("player", {
        start: 69,
        end: 71
      }),
      frameRate: 10,
      repeat: -1,
    });this.anims.create({
      key: "pl_up_bl",
      frames: this.anims.generateFrameNumbers("player", {
        start: 93,
        end: 95
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "pl_down_bl",
      frames: this.anims.generateFrameNumbers("player", {
        start: 57,
        end: 59
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "pl_right_grn",
      frames: this.anims.generateFrameNumbers("player", {
        start: 33,
        end: 35
      }),
      frameRate: 10,
      repeat: -1,
    });this.anims.create({
      key: "pl_left_grn",
      frames: this.anims.generateFrameNumbers("player", {
        start: 21,
        end: 23
      }),
      frameRate: 10,
      repeat: -1,
    });this.anims.create({
      key: "pl_up_grn",
      frames: this.anims.generateFrameNumbers("player", {
        start: 45,
        end: 47
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "pl_down_grn",
      frames: this.anims.generateFrameNumbers("player", {
        start: 9,
        end: 11
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
    this.anims.create({
      key: "megalodon_right",
      frames: this.anims.generateFrameNumbers("megalodon", {
        start: 6,
        end: 8
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "megalodon_left",
      frames: this.anims.generateFrameNumbers("megalodon", {
        start: 3,
        end: 5
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
        'Directions:\nUse the arrow keys to control the shark. Collect fish that you are bigger than \nto gain points, but don\'t try to eat fish that is bigger than you are\! \nCollect 5 points to gain access to your first method. \nAt 15 points, you can change your size!  \nPlay through the game to learn about methods in programming!', { color: 'black', fontSize: '20px '});
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

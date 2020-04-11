import 'phaser';
import MainScene from './scenes/mainScene';
import PreloadScene from './scenes/preloadScene';
import GameConfig = Phaser.Types.Core.GameConfig;
export {config}
export {gameSettings}

const DEFAULT_WIDTH: number = 1500;
const DEFAULT_HEIGHT : number = 1500;


const config: GameConfig = {
    backgroundColor: '#ffffff',
    scale: {
        parent: 'phaser-game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT
    },
    scene: [PreloadScene, MainScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            //gravity: { y: 400 }

        }
    }
};

const gameSettings = {
    playerSpeed: 600,
  }

window.addEventListener('load', () => {
    window['game'] = new Phaser.Game(config);
});

//

import 'phaser';
import MainScene from '../scripts/scenes/mainScene';
import PreloadScene from '../scripts/scenes/preloadScene';
import GameConfig = Phaser.Types.Core.GameConfig;
import InstructScene1 from './scenes/instructScene1';
import InstructScene2 from './scenes/instructScene2';
import InstructScene3 from './scenes/instructScene3';
export {config}
export {gameSettings}
export {BG_WIDTH}
export {BG_HEIGHT}


const DEFAULT_WIDTH: number = 1500;
const DEFAULT_HEIGHT : number = 1500;
const BG_WIDTH: number = 2820;
const BG_HEIGHT : number = 4000;


const config: GameConfig = {
    backgroundColor: '#ffffff',
    scale: {
        parent: 'phaser-game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT
    },
    scene: [PreloadScene, MainScene, InstructScene1, InstructScene2, InstructScene3],
    dom: {
        createContainer: true
    },
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

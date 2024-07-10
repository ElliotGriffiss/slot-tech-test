import * as PIXI from "pixi.js";
import { renderer } from "./renderer.js";
import { assetLoader } from "./assetLoader.js";

import { symbolStore } from "./reels/symbolStore.js";
import { ReelManager } from "./reels/reelsManager.js";
import { timerManager } from "./utils/timermanager.js";

import { Button } from "./button.js";
import { Clouds } from "./clouds/clouds";
import { Credit } from "./credit/credit";


/**
 * Base entry point for the game
 * 
 * @class
 */
class Core {
    constructor() {
        this._credit = 25;
        this._symbolIDs = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        this._winValues = [30, 25, 20, 15, 10, 5, 2, 1, 0.5];

        void this._create();
    }

    /**
     * load all assets required for the game
     * 
     * @async
     */
    async loadAssets() {
        assetLoader.addToQueue({ alias: 'background', src: "./resource/@2x/gameBG_opt.png"});
        assetLoader.addToQueue({ alias: 'cloud1', src: "./resource/@2x/cloud1_opt.png"});
        assetLoader.addToQueue({ alias: 'cloud2', src: "./resource/@2x/cloud2_opt.png"});
        assetLoader.addToQueue({ alias: 'mask', src: "./resource/@2x/mask_opt.jpg"});
        assetLoader.addToQueue({ alias: 'reelSquare', src: "./resource/@2x/reelSquare.png"});
        assetLoader.addToQueue({ src: "./resource/@2x/controlPanel0_opt.json"});
        assetLoader.addToQueue({ alias: 'ace', src: "./resource/@2x/symbols/aceWin0_opt.json"});
        assetLoader.addToQueue({ alias: 'h2', src: "./resource/@2x/symbols/h2Win0_opt.json"});
        assetLoader.addToQueue({ alias: 'h3', src: "./resource/@2x/symbols/h3Win0_opt.json"});
        assetLoader.addToQueue({ alias: 'h4', src: "./resource/@2x/symbols/h4Win0_opt.json"});
        assetLoader.addToQueue({ alias: 'jack', src: "./resource/@2x/symbols/jackWin0_opt.json"});
        assetLoader.addToQueue({ alias: 'king', src: "./resource/@2x/symbols/kingWin0_opt.json"});
        assetLoader.addToQueue({ alias: 'nine', src: "./resource/@2x/symbols/nineWin0_opt.json"});
        assetLoader.addToQueue({ alias: 'queen', src: "./resource/@2x/symbols/queenWin0_opt.json"});
        assetLoader.addToQueue({ alias: 'ten', src: "./resource/@2x/symbols/tenWin0_opt.json"});
        await assetLoader.loadQueue();
    }

    /**
     * Create the renderer instance and initialise everything ready to play the game
     * 
     * @async
     * @private
     */
    async _create() {
        renderer.initialise({
            antialias: false,
            backgroundAlpha: 1,
            backgroundColour: '#000000',
            gameContainerDiv: document.getElementById("gameContainer"),
            width: 1024,
            height: 576
        });
        renderer.start();
        timerManager.init();
        await this.loadAssets();
        this._createObjects(); 
    }

    /**
     * Create all game objecs ready to use
     * 
     * @async
     * @private
     */
    async _createObjects() {

        const graphics = new PIXI.Graphics();
        graphics.beginFill(0x1099bb);
        graphics.drawRect(0, 0, 1024, 300);
        graphics.endFill();
        renderer.addChild(graphics);

        const background = PIXI.Sprite.from("background");
        renderer.addChild(background);

        const clouds = new Clouds();
        renderer.addChild(clouds.native);

        symbolStore.createSymbols([
            {id: 0, name: "h2"},
            {id: 1, name: "h3"},
            {id: 2, name: "h4"},
            {id: 3, name: "ace"},
            {id: 4, name: "king"},
            {id: 5, name: "queen"},
            {id: 6, name: "jack"},
            {id: 7, name: "ten"},
            {id: 8, name: "nine"}
        ],
        3,
        3);

        const container = new PIXI.Container("reelSquares");
        container.x = 324;
        container.y = 95;
        renderer.addChild(container);
        let width = 125;
        let height = 105;
        for (let i = 0; i < 3; i++) {
            for( let j = 0; j < 3; j++) {
                const symbolBack = PIXI.Sprite.from("reelSquare");
                container.addChild(symbolBack);
                symbolBack.x = i * width;
                symbolBack.y = j * height;
            }
        }

        this._reelManager = new ReelManager(3, 3, 125, 105);
        renderer.addChild(this._reelManager.native);

        this._spinButton = new Button("playActive", "playCall", "playNonactive", () => {
            this._onSpinButtonPressed();
        });
        this._spinButton.x = 475;
        this._spinButton.y = 440;
        renderer.addChild(this._spinButton.native);

        this._creditPanel = new Credit();
        this._creditPanel.setCredit(this._credit);
        renderer.addChild(this._creditPanel.native);
    }

    /**
     * Handles Spin Button Pressed Logic.
     *
     * @private
     */
     _onSpinButtonPressed() {
         if (this._credit >= 1 ) {
             this._credit -= 1;
             this._creditPanel.setCredit(this._credit);
            void this._playGame();
         }
    }

    /**
     * Runs through the game.
     *
     * @private
     * @async
     */
    async _playGame() {
        this._spinButton.isActive = false;
        this._reelManager.startSpin();
        await timerManager.startTimer(2000);
        await this._reelManager.stopSpin();

        // Get the indexes of all the symbols as a 2D array.
        let finalSymbols = this._reelManager.getAllVisibleSymbolIDs();
        const wins = [];

        // Foreach possible symbolID.
        this._symbolIDs.forEach((id)=> {
            const potentialWin = [];

            for (let i = 0; i < finalSymbols.length; i++) {
                const index = finalSymbols[i].indexOf(id);

                if (index > -1) {
                    potentialWin.push(index);
                }
            }

            if (potentialWin.length > 2) {
                wins.push(potentialWin);
            }
        });

        // iterate over the wins and play the symbol animations.
        for (let i = 0; i < wins.length; i++) {
            let winningSymbolID = 0;

            wins[i].map((value, index) => {
               const symbol = this._reelManager.getSymbolAtPosition(index, value);
               symbol.play();

                winningSymbolID = symbol.id;
            });

            const winIndex = this._symbolIDs.indexOf(winningSymbolID);
            this._credit += this._winValues[winIndex];
            this._creditPanel.setCredit(this._credit);

            // wait for the animations to play before playing the next set, if there are multiple wins.
            await new Promise(resolve => setTimeout(resolve, 700));
        }

        // assuming stake is 1.
        if (this._credit >= 1) {
            this._spinButton.isActive = true;
        }
    }
}

window.startup = () => {
    const game = new Core();
};
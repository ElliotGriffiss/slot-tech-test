import * as PIXI from "pixi.js";
import { Base } from "../base.js";

/**
 * Credit
 *
 * @class
 * @extends Base
 */
export class Credit extends Base {
    constructor() {
        super();

        this._create();
    }

    /**
     * creates the credit panel.
     *
     * @private
     */
    _create() {
        this._native = new PIXI.Container();
        this.x = 950;
        this.y = 500;

        const panelBackground = PIXI.Sprite.from("panelBackground");
        panelBackground.anchor.set(0.5);

        this._text = new PIXI.Text("£10", {
            fill: "#ffffff"
        });
        this._text.anchor.set(0.5);

        this._native.addChild(panelBackground, this._text);
    }

    /**
     * Sets the credit text.
     *
     * @param {number} credit - The updated credit we want to set.
     */
    setCredit(credit) {
        this._text.text = "£"+ credit;
    }
}
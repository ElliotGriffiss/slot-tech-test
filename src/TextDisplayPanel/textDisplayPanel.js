import * as PIXI from "pixi.js";
import { Base } from "../base.js";

/**
 * Credit
 *
 * @class
 * @extends Base
 */
export class TextDisplayPanel extends Base {
    /**
     *
     * @param {string} titleText - the title text for this panel.
     */
    constructor(titleText) {
        super();

        this._create(titleText);
    }

    /**
     * creates the TextDisplayPanel panel.
     *
     * @param {string} titleText - the title text for this panel.
     * @private
     */
    _create(titleText) {
        this._native = new PIXI.Container();

        const panelBackground = PIXI.Sprite.from("redPanel");
        panelBackground.anchor.set(0.5);

        const panelTitleText = new PIXI.Text(titleText, {
            fill: "#ffffff",
            fontSize: 21,
            fontWeight: "bold",
            strokeThickness: 3
        });
        panelTitleText.anchor.set(0.5);
        panelTitleText.y = -30;

        this._text = new PIXI.Text("£10", {
            fill: "#ffffff",
            fontSize: 21
        });
        this._text.anchor.set(0.5);
        this._text.y = -3;

        this._native.addChild(panelBackground, panelTitleText, this._text);
    }

    /**
     * Sets the TextDisplayPanel text.
     *
     * @param {number} value - The updated value we want to set.
     */
    setText(value) {
        this._text.text = "£"+ value.toFixed(2);
    }
}
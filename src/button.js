import { Base } from "./base.js";
import * as PIXI from "pixi.js";

/**
 * Basic button class creates a sprite object and adds interaction callback
 * 
 * @class
 */
export class Button extends Base {
    /**
     * 
     * @param {string} active - image name or alias from assets already loaded
     * @param {function} onClick - call back function when clicked
     */
    constructor(active, pressed, inactive, onClick) {
        super();
        this._create(active, pressed, inactive, onClick);
    }

    /**
     * create the button object
     * 
     * @param {string} active - image name or alias from assets already loaded for the active sprite
     * @param {string} pressed - image name or alias from assets already loaded for the pressed sprite
     * @param {string} inactive - image name or alias from assets already loaded for the inactive sprite
     * @param {function} onClick - call back function when clicked
     * @private
     */
    _create(active, pressed, inactive, onClick) {
        this._native = new PIXI.Container();
        this._native.eventMode = 'static';
        this._native.cursor = 'pointer';
        this._buttonPayload = onClick;

        this._activeSprite = PIXI.Sprite.from(active);
        this._pressedSprite = PIXI.Sprite.from(pressed);
        this._inactiveSprite = PIXI.Sprite.from(inactive);

        this._pressedSprite.visible = false;
        this._inactiveSprite.visible = false;

        this._native.addChild(this._activeSprite, this._pressedSprite, this._inactiveSprite);

        this._native.on("pointerup", this._onButtonReleased, this);
        this._native.on("pointerdown", this._onButtonPressed, this);
        this._native.on("pointerout", this._cancel, this);

        this._isActive = true;
    }

    /**
     * Sets the buttons active state.
     *
     * @param {boolean} active - the buttons active state.
     */
    set isActive(active) {
        this._isActive = active;

        this._activeSprite.visible = active;
        this._inactiveSprite.visible = !active;

        (this._isActive) ? this.cursor = 'Pointer' : this.cursor = 'default';
    }

    /**
     * Handle on button released event.
     */
     _onButtonReleased() {
        if (this._isActive) {
            this._activeSprite.visible = true;
            this._pressedSprite.visible = false;
            this._buttonPayload();
        }
    }

    /**
     * Handle on button pressed event.
     */
     _onButtonPressed() {
        if (this._isActive) {
            this._activeSprite.visible = false;
            this._pressedSprite.visible = true;
        }
    }

    /**
     * Cancels the current button press.
     */
     _cancel() {
        if (this._isActive) {
            this._activeSprite.visible = true;
            this._pressedSprite.visible = false;
        }
    }

}
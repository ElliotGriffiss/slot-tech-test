import * as PIXI from "pixi.js";
import { Base } from "../base.js";
import { Easings, Tween } from "../utils/tween.js";

/**
 * Clouds
 *
 * @class
 * @extends Base
 */
export class Clouds extends Base {
    constructor() {
        super();

        this._create();
    }

    /**
     * creates the clouds and animates them.
     *
     * @private
     */
    _create() {
        this._native = new PIXI.Container();

        this._cloud1 = PIXI.Sprite.from("cloud1");
        this._cloud2 = PIXI.Sprite.from("cloud2");
        this._cloud3 = PIXI.Sprite.from("cloud1");
        this._cloud4 = PIXI.Sprite.from("cloud2");

        Tween.fromTo(this._cloud1, 80000, {x: -400}, {x: 1080, repeat: -1});
        Tween.fromTo(this._cloud2, 80000, {x: -400}, {x: 1080, repeat: -1, delay: 20});
        Tween.fromTo(this._cloud3, 80000, {x: -400}, {x: 1080, repeat: -1, delay: 40});
        Tween.fromTo(this._cloud4, 80000, {x: -400}, {x: 1080, repeat: -1, delay: 60});

        this._native.addChild(this._cloud1, this._cloud2, this._cloud3);
    }
}
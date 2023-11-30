import { Color, Vector3 } from "three";
import { MyDisplay } from "../core/myDisplay";
import { Tween } from "../core/tween";
import { Util } from "../libs/util";
import { Func } from "../core/func";
import { HSL } from "../libs/hsl";
import { Val } from "../libs/val";

// -----------------------------------------
//
// -----------------------------------------
export class Item extends MyDisplay {

  private _baseCol: Vector3 = new Vector3()

  private _showRate: Val = new Val(0)
  private _text: string = '11/30 HELLO Sketch 433'

  constructor(opt:any) {
    super(opt)

    this.useGPU(this.el)
    this.show()
  }

  public show():void {
    this._baseCol.x = Util.random(0, 1)

    Tween.a(this._showRate, {
      val:[0, 1]
    }, 3, 0, Tween.Power3EaseInOut, null, null, () => {
      Tween.wait(1, () => {
        this.show()
      })
    })
  }

  private _makeShadow(ang: number, color: Color, interval: number):string {
    let radius = 0;
    const num = Func.val(50, 100)

    let res = '';
    for(var i = 0; i <= num; i++) {
      const col = color.clone()
      col.offsetHSL(Util.map(i, 0, Util.mix(1, 0.25, this._showRate.val), 0, num), 0, Util.map(i, 0.5, -0.5, 0, num - 1))

      let rad = Util.radian(ang)
      let x = ~~(Math.sin(rad * 1) * radius) * (i % 2 == 0 ? 1 : -1);
      let y = ~~(Math.cos(rad * 1) * radius) * (i % 2 == 0 ? 1 : -1);
      res += x + 'px ' + y + 'px 0px ' + col.getStyle();
      if(i != num) {
        res += ', ';
      }
      radius += interval;
    }

    return res;
  }

  private _updateText():void {
    const r = ~~(Util.mix(0, this._text.length + 1, this._showRate.val))
    this.el.innerHTML = this._text.substring(0, r)
  }

  protected _update():void {
    super._update();

    const sw = Func.sw()
    this._updateText()

    const fontSize = sw * 0.09

    const hsl = new HSL()
    hsl.s = 1
    hsl.l = 0.5
    hsl.h = this._baseCol.x
    const col = new Color().setHSL(hsl.h, hsl.s, hsl.l)

    const ang = Util.mix(-360 * 5, 45, this._showRate.val)
    const it = Util.mix(4, 0, this._showRate.val)
    const txtCol = new Color(0xffffff)
    const txtShadow = this._makeShadow(ang, col, it)

    Tween.set(this.el, {
      textShadow:txtShadow,
      fontSize: fontSize + 'px',
      color: txtCol.getStyle()
    })
  }
}








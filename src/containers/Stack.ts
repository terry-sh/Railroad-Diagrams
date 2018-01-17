import SvgNode, { ComplexContainerNode } from "Node"
import Diagram from "diagrams/Diagram"
import Path from "Path"
import Config from "config"

import { wrapString, determineGaps } from "utils"

export default class Stack extends ComplexContainerNode {
  needsSpace: boolean

  constructor(...items: Array<SvgNode>) {
    super("g")

    if (items.length === 0) {
      throw new RangeError("Stack() must have at least one child.")
    }

    this.items = items.map(wrapString)
    this.width = Math.max.apply(null, this.items.map(e =>
      e.width + ((e as any).needsSpace ? 20 : 0)
    ))
    //if(this.items[0].needsSpace) this.width -= 10;
    //if(this.items[this.items.length-1].needsSpace) this.width -= 10;
    if (this.items.length > 1) {
      this.width += Config.arcDiameter
    }
    this.needsSpace = true
    this.up = this.items[0].up
    this.down = this.items[this.items.length - 1].down

    this.height = 0
    let last = this.items.length - 1
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i]
      this.height += item.height
      if (i > 0) {
        this.height += Math.max(Config.arcDiameter, item.up + Config.verticalSeparation);
      }
      if (i < last) {
        this.height += Math.max(Config.arcDiameter, item.down + Config.verticalSeparation);
      }
    }

    if (Config.isDebug) {
      this.attrs["data-updown"] = this.up + " " + this.height + " " + this.down
      this.attrs["data-type"] = "stack"
    }
  }

  format(x: number, y: number, width: number): Stack {
    var gaps = determineGaps(width, this.width)
    new Path(x, y).h(gaps[0]).addTo(this)
    x += gaps[0]
    let xInitial = x
    if (this.items.length > 1) {
      new Path(x, y).h(Config.arcRadius).addTo(this)
      x += Config.arcRadius
    }

    for (let i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      var innerWidth = this.width - (this.items.length > 1 ? Config.arcDiameter : 0);
      item.format(x, y, innerWidth).addTo(this);
      x += innerWidth;
      y += item.height;

      if (i !== this.items.length - 1) {
        new Path(x, y)
          .arc("ne").down(Math.max(0, item.down + Config.verticalSeparation - Config.arcDiameter))
          .arc("es").left(innerWidth)
          .arc("nw").down(Math.max(0, this.items[i + 1].up + Config.verticalSeparation - Config.arcDiameter))
          .arc("ws").addTo(this)

        y += Math.max(item.down + Config.verticalSeparation, Config.arcDiameter) +
          Math.max(
            this.items[i + 1].up + Config.verticalSeparation,
            Config.arcDiameter)
        // y += Math.max(Config.arcRadius*4, item.down + Config.verticalSeparation*2 + this.items[i+1].up)
        x = xInitial + Config.arcRadius
      }

    }

    if (this.items.length > 1) {
      new Path(x, y).h(Config.arcRadius).addTo(this)
      x += Config.arcRadius;
    }
    new Path(x, y).h(gaps[1]).addTo(this)

    return this
  }
}

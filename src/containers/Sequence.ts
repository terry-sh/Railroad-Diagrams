import SvgNode, { ComplexContainerNode } from "Node"
import Diagram from "diagrams/Diagram"
import Path from "Path"
import Config from "config"

import { wrapString, determineGaps } from "utils"

export default class Sequence extends ComplexContainerNode {
  needsSpace: boolean

  constructor(...items: Array<SvgNode>) {
    super("g")

    this.items = items.map(wrapString)
    this.needsSpace = true
    let numberOfItems = this.items.length

    this.up = this.down = this.height = this.width = 0
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i]
      this.width += item.width + ((item as any).needsSpace ? 20 : 0)
      this.up = Math.max(this.up, item.up - this.height)
      this.height += item.height
      this.down = Math.max(this.down - item.height, item.down)
    }

    if ((this.items[0] as any).needsSpace)
      this.width -= 10
    if ((this.items[this.items.length - 1] as any).needsSpace)
      this.width -= 10

    if (Config.isDebug) {
      this.attrs["data-updown"] = this.up + " " + this.height + " " + this.down
      this.attrs["data-type"] = "sequence"
    }
  }

  format(x: number, y: number, width: number): Sequence {
    // Hook up the two sides if this is narrower than its stated width.
    var gaps = determineGaps(width, this.width);
    new Path(x, y).h(gaps[0]).addTo(this);
    new Path(x + gaps[0] + this.width, y + this.height).h(gaps[1]).addTo(this);
    x += gaps[0];

    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i]

      if ((item as any).needsSpace && i > 0) {
        new Path(x, y).h(10).addTo(this)
        x += 10
      }
      item.format(x, y, item.width).addTo(this);
      x += item.width
      y += item.height
      if ((item as any).needsSpace && i < this.items.length - 1) {
        new Path(x, y).h(10).addTo(this)
        x += 10
      }
    }
    return this
  }

}

import SvgNode from "@/Node"
import Diagram from "@/diagrams/Diagram"
import Path from "@/Path"
import Sequence from "@/containers/Sequence"
import Config from "config"

import { determineGaps, sum, wrapString } from "@/utils"

export default class OptionalSequence extends Sequence {
  isOptional: boolean

  constructor(...items: Array<SvgNode>) {
    if (items.length === 0) {
      throw new RangeError("OptionalSequence() must have at least one child.")
    }

    if (items[0] instanceof OptionalSequence) {
      // copy(items[0])
    }

    if (items.length === 1) {
      super(items[0])
      this.isOptional = false
    } else {
      this.isOptional = true

      let arc = Config.arcRadius
      this.items = items.map(wrapString)
      this.needsSpace = false
      this.width = 0
      this.up = 0
      this.height = sum(this.items, x => x.height)
      this.down = this.items[0].down

      let heightSoFar = 0
      for (let i = 0; i < this.items.length; i++) {
        let item = this.items[i]
        this.up = Math.max(this.up, Math.max(arc * 2, item.up + Config.verticalSeparation) - heightSoFar)
        heightSoFar += item.height
        if (i > 0) {
          this.down = Math.max(
            this.height + this.down,
            heightSoFar + Math.max(arc * 2, item.down + Config.verticalSeparation)) - this.height
        }
        let itemWidth = ((item as any).needsSpace ? 10 : 0) + item.width
        if (i == 0) {
          this.width += arc + Math.max(itemWidth, arc)
        } else {
          this.width += arc * 2 + Math.max(itemWidth, arc) + arc
        }
      }

      if (Config.isDebug) {
        this.attrs["data-updown"] = this.up + " " + this.height + " " + this.down
        this.attrs["data-type"] = "optseq"
      }
    }

  }

  format(x: number, y: number, width: number): OptionalSequence {
    if (!this.isOptional)
      return super.format(x, y, width) as OptionalSequence

    let arc = Config.arcRadius
    let gaps = determineGaps(width, this.width)
    new Path(x, y).right(gaps[0]).addTo(this)
    new Path(x + gaps[0] + this.width, y + this.height).right(gaps[1]).addTo(this)
    x += gaps[0]
    let upperLineY = y - this.up
    let last = this.items.length - 1
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i]
      let itemSpace = ((item as any).needsSpace ? 10 : 0)
      let itemWidth = item.width + itemSpace
      if (i == 0) {
        // Upper skip
        new Path(x, y)
          .arc("se")
          .up(y - upperLineY - arc * 2)
          .arc("wn")
          .right(itemWidth - arc)
          .arc("ne")
          .down(y + item.height - upperLineY - arc * 2)
          .arc("ws")
          .addTo(this)
        // Straight line
        new Path(x, y)
          .right(itemSpace + arc)
          .addTo(this)
        item.format(x + itemSpace + arc, y, item.width).addTo(this)
        x += itemWidth + arc
        y += item.height
        // x ends on the far side of the first element,
        // where the next element's skip needs to begin
      } else if (i < last) {
        // Upper skip
        new Path(x, upperLineY)
          .right(arc * 2 + Math.max(itemWidth, arc) + arc)
          .arc("ne")
          .down(y - upperLineY + item.height - arc * 2)
          .arc("ws")
          .addTo(this)
        // Straight line
        new Path(x, y)
          .right(arc * 2)
          .addTo(this)
        item.format(x + arc * 2, y, item.width).addTo(this)
        new Path(x + item.width + arc * 2, y + item.height)
          .right(itemSpace + arc)
          .addTo(this)
        // Lower skip
        this.addLowerSkipPath(x, y,
          item.height + Math.max(item.down + Config.verticalSeparation, arc * 2) - arc * 2,
          itemWidth - arc,
          item.down + Config.verticalSeparation - arc * 2
        )
        x += arc * 2 + Math.max(itemWidth, arc) + arc
        y += item.height
      } else {
        // Straight line
        new Path(x, y).right(arc * 2).addTo(this)
        item.format(x + arc * 2, y, item.width).addTo(this)
        new Path(x + arc * 2 + item.width, y + item.height)
          .right(itemSpace + arc)
          .addTo(this)
        // Lower skip
        this.addLowerSkipPath(x, y,
          item.height + Math.max(item.down + Config.verticalSeparation, arc * 2) - arc * 2,
          itemWidth - arc,
          item.down + Config.verticalSeparation - arc * 2
        )
      }
    }
    return this
  }

  addLowerSkipPath(x: number, y: number, down: number, right: number, up: number) {
    new Path(x, y)
      .arc("ne").down(down)
      .arc("ws").right(right)
      .arc("se").up(up)
      .arc("wn").addTo(this)
  }

}

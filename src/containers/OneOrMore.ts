import SvgNode, { ContainerNode } from "@/Node"
import Diagram from "@/diagrams/Diagram"
import Skip from "@/leaves/Skip"
import Path from "@/Path"
import Config from "@/config"

import { determineGaps, wrapString } from "@/utils"

export default class OneOrMore extends ContainerNode {
  item: SvgNode
  rep: SvgNode
  needsSpace: boolean

  constructor(item: SvgNode, rep: SvgNode) {
    super("g")

    rep = rep || (new Skip())

    this.item = wrapString(item)
    this.rep = wrapString(rep)
    this.width = Math.max(this.item.width, this.rep.width) + Config.arcDiameter
    this.height = this.item.height
    this.up = this.item.up
    this.down = Math.max(
      Config.arcDiameter,
      this.item.down + Config.verticalSeparation + this.rep.up + this.rep.height + this.rep.down)
    if (Config.isDebug) {
      this.attrs["data-updown"] = this.up + " " + this.height + " " + this.down
      this.attrs["data-type"] = "oneormore"
    }
  }

  format(x: number, y: number, width: number): OneOrMore {
    // Hook up the two sides if this is narrower than its stated width.
    var gaps = determineGaps(width, this.width)
    new Path(x, y).h(gaps[0]).addTo(this)
    new Path(x + gaps[0] + this.width, y + this.height).h(gaps[1]).addTo(this)
    x += gaps[0]

    // Draw item
    new Path(x, y).right(Config.arcRadius).addTo(this)
    this.item.format(x + Config.arcRadius, y, this.width - Config.arcDiameter).addTo(this)
    new Path(x + this.width - Config.arcRadius, y + this.height).right(Config.arcRadius).addTo(this)

    // Draw repeat arc
    var distanceFromY = Math.max(Config.arcDiameter, this.item.height + this.item.down + Config.verticalSeparation + this.rep.up)
    new Path(x + Config.arcRadius, y).arc("nw").down(distanceFromY - Config.arcDiameter).arc("ws").addTo(this)
    this.rep.format(x + Config.arcRadius, y + distanceFromY, this.width - Config.arcDiameter).addTo(this)
    new Path(x + this.width - Config.arcRadius, y + distanceFromY + this.rep.height).arc("se").up(distanceFromY - Config.arcDiameter + this.rep.height - this.item.height).arc("en").addTo(this)

    return this
  }

}

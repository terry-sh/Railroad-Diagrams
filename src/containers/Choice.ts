import { unnull, wrapString, determineGaps } from "@/utils"
import SvgNode, { ComplexContainerNode } from "@/Node"
import Diagram from "@/diagrams/Diagram"
import Path from "@/Path"
import Start from "@/leaves/Start"
import End from "@/leaves/End"
import Config from "config"

export default class Choice extends ComplexContainerNode {
  formatted: boolean
  normal: number

  constructor(normal: number, ...items: Array<SvgNode>) {
    super("g")

    if (typeof normal !== "number" || normal !== Math.floor(normal)) {
      throw new TypeError("The first argument of Choice() must be an integer.")
    } else if (normal < 0 || normal >= items.length) {
      throw new RangeError("The first argument of Choice() must be an index for one of the items.")
    } else {
      this.normal = normal
    }
    let first = 0
    let last = items.length - 1
    this.items = items.map(wrapString)
    this.width = Math.max.apply(null, this.items.map(el => el.width)) + Config.arcRadius * 4
    this.height = this.items[normal].height
    this.up = this.items[first].up

    for (let i = first; i < normal; i++) {
      let arcs
      if (i == normal - 1)
        arcs = Config.arcDiameter
      else
        arcs = Config.arcRadius

      this.up += Math.max(arcs, this.items[i].height + this.items[i].down + Config.verticalSeparation + this.items[i + 1].up)
    }

    this.down = this.items[last].down
    for (let i = normal + 1; i <= last; i++) {
      let arcs: number
      if (i == normal + 1)
        arcs = Config.arcDiameter
      else
        arcs = Config.arcRadius

      this.down += Math.max(
        arcs,
        this.items[i - 1].height + this.items[i - 1].down + Config.verticalSeparation + this.items[i].up
      )
    }

    this.down -= this.items[normal].height // already counted in Choice.height
    if (Config.isDebug) {
      this.attrs["data-updown"] = this.up + " " + this.height + " " + this.down
      this.attrs["data-type"] = "choice"
    }
  }

  format(x: number, y: number, width: number): Choice {
    // Hook up the two sides if this is narrower than its stated width.
    let gaps = determineGaps(width, this.width)
    new Path(x, y).h(gaps[0]).addTo(this)
    new Path(x + gaps[0] + this.width, y + this.height).h(gaps[1]).addTo(this)
    x += gaps[0]

    let last = this.items.length - 1
    let innerWidth = this.width - Config.arcRadius * 4

    // Do the elements that curve above
    for (let i = this.normal - 1; i >= 0; i--) {
      let item = this.items[i]

      let distanceFromY: number = 0
      if (i == this.normal - 1) {
        distanceFromY = Math.max(
          Config.arcDiameter,
          this.items[this.normal].up + Config.verticalSeparation + item.down + item.height
        )
      }
      new Path(x, y)
        .arc("se")
        .up(distanceFromY - Config.arcDiameter)
        .arc("wn").addTo(this)
      item.format(x + Config.arcDiameter, y - distanceFromY, innerWidth).addTo(this)
      new Path(x + Config.arcDiameter + innerWidth, y - distanceFromY + item.height)
        .arc("ne")
        .down(distanceFromY - item.height + this.height - Config.arcDiameter)
        .arc("ws").addTo(this)
      distanceFromY += Math.max(Config.arcRadius, item.up + Config.verticalSeparation + (i == 0 ? 0 : this.items[i - 1].down + this.items[i - 1].height))
    }

    // Do the straight-line path.
    new Path(x, y).right(Config.arcDiameter).addTo(this)
    this.items[this.normal].format(x + Config.arcDiameter, y, innerWidth).addTo(this)
    new Path(x + Config.arcDiameter + innerWidth, y + this.height).right(Config.arcDiameter).addTo(this)

    // Do the elements that curve below
    for (let i = this.normal + 1; i <= last; i++) {
      let item = this.items[i]
      let distanceFromY: number = 0
      if (i == this.normal + 1) {
        distanceFromY = Math.max(
          Config.arcDiameter,
          this.height + this.items[this.normal].down + Config.verticalSeparation + item.up
        )
      }
      new Path(x, y)
        .arc("ne")
        .down(distanceFromY - Config.arcDiameter)
        .arc("ws").addTo(this)
      item.format(x + Config.arcDiameter, y + distanceFromY, innerWidth).addTo(this)
      new Path(x + Config.arcDiameter + innerWidth, y + distanceFromY + item.height)
        .arc("se")
        .up(distanceFromY - Config.arcDiameter + item.height - this.height)
        .arc("wn").addTo(this)
      distanceFromY += Math.max(
        Config.arcRadius,
        item.height + item.down + Config.verticalSeparation + (i == last ? 0 : this.items[i + 1].up))
    }

    return this
  }

}

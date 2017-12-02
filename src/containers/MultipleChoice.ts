import { unnull, wrapString } from "@/utils"
import SvgNode, { ComplexContainerNode } from "@/Node"
import Path from "@/Path"
import Diagram from "@/diagrams/Diagram"
import { determineGaps, max } from "@/utils"
import Config from "@/config"

class MultipleChoice extends ComplexContainerNode {
  innerWidth: number
  normal: number
  type: string
  needsSpace: boolean = true

  constructor(normal: number, type: string, ...items: Array<SvgNode>) {
    super("g")

    if (typeof normal !== "number" || normal !== Math.floor(normal)) {
      throw new TypeError("The first argument of MultipleChoice() must be an integer.")
    } else if (normal < 0 || normal >= items.length) {
      throw new RangeError("The first argument of MultipleChoice() must be an index for one of the items.")
    } else {
      this.normal = normal
    }

    if (type != "any" && type != "all") {
      throw new SyntaxError("The second argument of MultipleChoice must be 'any' or 'all'.")
    } else {
      this.type = type
    }

    this.needsSpace = true
    this.items = items.map(wrapString)
    this.innerWidth = max(this.items, function (x) { return x.width })
    this.width = 30 + Config.arcRadius + this.innerWidth + Config.arcRadius + 20
    this.up = this.items[0].up
    this.down = this.items[this.items.length - 1].down
    this.height = this.items[normal].height
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i]
      let minimum: number
      if (i == normal - 1 || i == normal + 1) {
        minimum = 10 + Config.arcRadius
      } else {
        minimum = Config.arcRadius
      }
      if (i < normal) {
        this.up += Math.max(minimum, item.height + item.down + Config.verticalSeparation + this.items[i + 1].up);
      } else if (i > normal) {
        this.down += Math.max(minimum, item.up + Config.verticalSeparation + this.items[i - 1].down + this.items[i - 1].height);
      }
    }
    this.down -= this.items[normal].height; // already counted in this.height
    if (Config.isDebug) {
      this.attrs["data-updown"] = this.up + " " + this.height + " " + this.down
      this.attrs["data-type"] = "multiplechoice"
    }
  }

  format(x: number, y: number, width: number): MultipleChoice {
    let gaps = determineGaps(width, this.width)
    new Path(x, y).right(gaps[0]).addTo(this)
    new Path(x + gaps[0] + this.width, y + this.height).right(gaps[1]).addTo(this)
    x += gaps[0]

    let normal = this.items[this.normal]

    // Do the elements that curve above
    for (let i = this.normal - 1; i >= 0; i--) {
      let item = this.items[i]
      let distanceFromY = 0
      if (i == this.normal - 1) {
        distanceFromY = Math.max(
          10 + Config.arcRadius,
          normal.up + Config.verticalSeparation + item.down + item.height)
      }

      new Path(x + 30, y)
        .up(distanceFromY - Config.arcRadius)
        .arc("wn").addTo(this)

      item.format(
        x + 30 + Config.arcRadius,
        y - distanceFromY, this.innerWidth
      ).addTo(this)

      new Path(x + 30 + Config.arcRadius + this.innerWidth, y - distanceFromY + item.height)
        .arc("ne")
        .down(distanceFromY - item.height + this.height - Config.arcRadius - 10)
        .addTo(this)

      if (i != 0) {
        distanceFromY += Math.max(
          Config.arcRadius,
          item.up + Config.verticalSeparation + this.items[i - 1].down + this.items[i - 1].height
        )
      }
    }

    new Path(x + 30, y).right(Config.arcRadius).addTo(this)
    normal.format(x + 30 + Config.arcRadius, y, this.innerWidth).addTo(this)
    new Path(x + 30 + Config.arcRadius + this.innerWidth, y + this.height).right(Config.arcRadius).addTo(this)

    for (let i = this.normal + 1; i < this.items.length; i++) {
      let item = this.items[i]

      let distanceFromY = 0
      if (i == this.normal + 1) {
        distanceFromY = Math.max(10 + Config.arcRadius, normal.height + normal.down + Config.verticalSeparation + item.up)
      }

      new Path(x + 30, y)
        .down(distanceFromY - Config.arcRadius)
        .arc("ws")
        .addTo(this)
      item.format(x + 30 + Config.arcRadius, y + distanceFromY, this.innerWidth).addTo(this)

      new Path(x + 30 + Config.arcRadius + this.innerWidth, y + distanceFromY + item.height)
        .arc("se")
        .up(distanceFromY - Config.arcRadius + item.height - normal.height)
        .addTo(this)

      if (i != this.items.length - 1) {
        distanceFromY += Math.max(
          Config.arcRadius,
          item.height + item.down + Config.verticalSeparation + this.items[i + 1].up)
      }
    }

    let text = new SvgNode("g", {
      "class": "diagram-text"
    }).addTo(this)

    new SvgNode("title", {}, (this.type == "any" ? "take one or more branches, once each, in any order" : "take all branches, once each, in any order")).addTo(text)

    new SvgNode("path", {
      "d": `M ${x + 30} ${y - 10} h -26 a 4 4 0 0 0 -4 4 v 12 a 4 4 0 0 0 4 4 h 26 z`,
      "class": "diagram-text"
    }).addTo(text)

    new SvgNode("text", {
      "x": x + 15,
      "y": y + 4,
      "class": "diagram-text"
    }, (this.type == "any" ? "1+" : "all")).addTo(text)

    new SvgNode("path", {
      "d": `M ${x + this.width - 20} ${y - 10} h 16 a 4 4 0 0 1 4 4 v 12 a 4 4 0 0 1 -4 4 h -16 z`,
      "class": "diagram-text"
    }).addTo(text)

    new SvgNode("path", {
      "d": `M ${x + this.width - 13} ${y - 2} a 4 4 0 1 0 6 -1 m 2.75 -1 h -4 v 4 m 0 -3 h 2`,
      "style": "stroke-width: 1.75"
    }).addTo(text)

    return this
  }

}

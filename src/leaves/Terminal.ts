import SvgNode, { TextLeafNode } from "@/Node"
import Diagram from "@/diagrams/Diagram"
import Path from "@/Path"
import { determineGaps } from "@/utils"
import Config from "config"

export default class Terminal extends TextLeafNode {
  needsSpace: boolean = true

  constructor(text: string, href?: string) {
    super("g", { "class": "terminal" })

    this.text = text
    this.href = href
    this.width = text.length * 8 + 20 /* Assume that each char is .5em, and that the em is 16px */
    this.height = 0
    this.up = 11
    this.down = 11
    if (Config.isDebug) {
      this.attrs["data-updown"] = this.up + " " + this.height + " " + this.down
      this.attrs["data-type"] = "terminal"
    }
  }

  format(x: number, y: number, width: number): Terminal {
    // Hook up the two sides if this is narrower than its stated width.
    let gaps = determineGaps(width, this.width)
    new Path(x, y).h(gaps[0]).addTo(this)
    new Path(x + gaps[0] + this.width, y).h(gaps[1]).addTo(this)
    x += gaps[0]

    new SvgNode("rect", {
      x: x,
      y: y - 11,
      width: this.width,
      height: this.up + this.down,
      rx: 10,
      ry: 10
    }).addTo(this)

    let text = new SvgNode("text", {
      x: x + this.width / 2,
      y: y + 4
    }, this.text)

    if (this.href) {
      new SvgNode("a", {
        "xlink:href": this.href
      }, [text]).addTo(this)
    } else {
      text.addTo(this)
    }
    return this
  }

}

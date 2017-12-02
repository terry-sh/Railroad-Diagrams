import SvgNode, { TextLeafNode } from "@/Node"
import Diagram from "@/diagrams/Diagram"

import Path from "@/Path"
import { determineGaps } from "@/utils"
import Config from "config";

export default class Comment extends TextLeafNode {
  needsSpace: boolean = true

  constructor(text: string, href: string) {
    super("g")

    this.text = text
    this.href = href
    this.width = text.length * 7 + 10
    this.height = 0
    this.up = 11
    this.down = 11
    if (Config.isDebug) {
      this.attrs["data-updown"] = this.up + " " + this.height + " " + this.down
      this.attrs["data-type"] = "comment"
    }
  }

  format(x: number, y: number, width: number) {
    // Hook up the two sides if this is narrower than its stated width.
    let gaps = determineGaps(width, this.width)
    new Path(x, y).h(gaps[0]).addTo(this)
    new Path(x + gaps[0] + this.width, y + this.height).h(gaps[1]).addTo(this)
    x += gaps[0]

    let text = new SvgNode("text", {
      x: x + this.width / 2,
      y: y + 5, class: "comment"
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

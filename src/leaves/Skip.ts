import { LeafNode } from "@/Node"
import Path from "@/Path"
import Diagram from "@/diagrams/Diagram"
import { unnull, wrapString } from "@/utils"
import Config from "config"

export default class Skip extends LeafNode {

  constructor() {
    super("g")

    this.width = 0
    this.height = 0
    this.up = 0
    this.down = 0

    if (Config.isDebug) {
      this.attrs["data-updown"] = this.up + " " + this.height + " " + this.down
      this.attrs["data-type"] = "skip"
    }
  }

  format(x: number, y: number, width: number): Skip {
    new Path(x, y).right(width).addTo(this)
    return this
  }

}

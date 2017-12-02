import { LeafNode } from "@/Node"
import Diagram from "@/diagrams/Diagram"
import Path from "@/Path"
import Config from "config";

export default class End extends LeafNode {
  type: string

  constructor(type?: string) {
    super("path")

    this.width = 20
    this.height = 0
    this.up = 10
    this.down = 10
    this.type = type || "simple"

    if (Config.isDebug) {
      this.attrs["data-updown"] = `${this.up} ${this.height} ${this.down}`
      this.attrs["data-type"] = "end"
    }
  }

  format(x: number, y: number) {
    if (this.type === "complex") {
      this.attrs.d = `M ${x} ${y} h 20 m 0 -10 v 20`
    } else {
      this.attrs.d = `M ${x} ${y} h 20 m -10 -10 v 20 m 10 -20 v 20`
    }

    return this
  }

}

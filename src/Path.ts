import { AbstractNode } from "Node"
import Diagram from "diagrams/Diagram"
import Config from "config"

export default class Path extends AbstractNode {

  constructor(x: number, y: number) {
    super("path")

    this.attrs.d = `M${x} ${y}`
  }

  m(x: number, y: number) {
    this.attrs.d += `m${x} ${y}`
    return this
  }

  h(val: number): Path {
    this.attrs.d += "h" + val
    return this
  }

  right(val: number): Path {
    return this.h(Math.max(0, val))
  }

  left(val): Path {
    return this.h(-Math.max(0, val))
  }

  v(val): Path {
    this.attrs.d += "v" + val
    return this
  }

  down(val: number): Path {
    return this.v(Math.max(0, val))
  }

  up(val: number): Path {
    return this.v(-Math.max(0, val))
  }

  arc(sweep): Path {
    let x = Config.arcRadius
    let y = Config.arcRadius

    if (sweep[0] === "e" || sweep[1] === "w") {
      x *= -1
    }

    if (sweep[0] === "s" || sweep[1] === "n") {
      y *= -1
    }

    let cw: number
    if (sweep === "ne" || sweep === "es" || sweep === "sw" || sweep === "wn") {
      cw = 1
    } else {
      cw = 0
    }

    this.attrs.d += `a${Config.arcRadius} ${Config.arcRadius} 0 0 ${cw} ${x} ${y}`
    return this
  }

  format(): Path {
    // All paths in this library start/end horizontally.
    // The extra .5 ensures a minor overlap, so there's no seams in bad rasterizers.
    this.attrs.d += "h.5"
    return this
  }

}

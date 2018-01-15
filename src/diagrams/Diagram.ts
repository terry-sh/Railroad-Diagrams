import { unnull, wrapString } from "utils"
import SvgNode, { ComplexContainerNode } from "Node"
import Path from "Path"
import Start from "leaves/Start"
import End from "leaves/End"
import Config from "config"

export default class Diagram extends ComplexContainerNode {
  formatted: boolean

  constructor(...items: Array<SvgNode>) {
    super("svg", {
      class: Config.diagramClass
    })

    this.items = items.map(wrapString)
    this.items.unshift(new Start())
    this.items.push(new End())

    this.up = this.down = this.height = this.width = 0
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i]
      this.width += item.width + ((item as any).needsSpace ? 20 : 0)

      this.up = Math.max(this.up, item.up - this.height)
      this.height += item.height
      this.down = Math.max(this.down - item.height, item.down)
    }

    this.formatted = false
  }

  addNamespace() {
    this.attrs["xmlns"] = "http://www.w3.org/2000/svg"
  }

  format(paddingt?: number, paddingr?: number, paddingb?: number, paddingl?: number) {
    paddingt = unnull(paddingt, 20)
    paddingr = unnull(paddingr, paddingt, 20)
    paddingb = unnull(paddingb, paddingt, 20)
    paddingl = unnull(paddingl, paddingr, 20)

    let x = paddingl
    let y = paddingt

    y += this.up
    let g = new SvgNode("g",
      Config.strokeOddPixelLength ?
        { transform: "translate(.5 .5)" } :
        {}
    )

    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i]
      if ((item as any).needsSpace) {
        new Path(x, y).h(10).addTo(g)
        x += 10
      }

      item.format(x, y, item.width).addTo(g)
      x += item.width
      y += item.height

      if ((item as any).needsSpace) {
        new Path(x, y).h(10).addTo(g)
        x += 10
      }
    }
    this.attrs.width = this.width + paddingl + paddingr
    this.attrs.height = this.up + this.height + this.down + paddingt + paddingb
    this.attrs.viewBox = "0 0 " + this.attrs.width + " " + this.attrs.height
    g.addTo(this)
    this.formatted = true

    return this
  }

  addTo(parent) {
    if (!parent) {
      let scriptTag = document.getElementsByTagName("script")
      let finalTag = scriptTag[(scriptTag as any).length - 1]
      parent = finalTag.parentNode
    }
    return super.addTo(parent)
  }

  toSVG() {
    if (!this.formatted) {
      super.format()
    }
    return super.toSVG()
  }

  toString(): string {
    if (!this.formatted) {
      this.format()
    }
    return super.toString()
  }

}

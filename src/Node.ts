import {
  unnull,
  escapeString,
  SVG
} from "@/utils"

export type Attributes = {
  d?: any
  width?: number
  height?: number
  viewBox?: string
  string: any
}

export class AbstractNode {
  tagName: string
  attrs: Attributes
  children: Array<any>

  get attrString(): string {
    return Object.keys(this.attrs).map(e =>
      `${e}=" ${(this.attrs[e] + "").replace(/&/g, "&amp;").replace(/"/g, "&quot;")}"`
    ).join("")
  }

  constructor(tagName: string, attrs?, text?) {
    if (text) {
      this.children = text
    } else {
      this.children = []
    }
    this.tagName = tagName
    this.attrs = unnull(attrs, {})
  }

  // Virtual
  format(...args: Array<any>/* x, y, width */): AbstractNode {
    return null
  }

  addTo(parent) {
    if (parent instanceof SvgNode) {
      parent.children.push(this);
      return this
    }

    let svg = this.toSVG()
    parent.appendChild(svg)
    return svg
  }

  toSVG(): SVGElement {
    var el = SVG(this.tagName, this.attrs)

    if (typeof this.children === "string") {
      el.textContent = this.children
    } else {
      this.children.forEach((e) => {
        el.appendChild(e.toSVG())
      })
    }
    return el
  }

  toString(extras?: string) {
    let str = `<${this.tagName}${this.attrString}>`

    var group = this.tagName == "g" || this.tagName == "svg"
    if (group)
      str += "\n"

    if (typeof this.children == "string") {
      str += escapeString(this.children)
    } else {
      this.children.forEach(e => { str += e })
    }

    str += `</${this.tagName}>\n`
    return str
  }

}

export default class SvgNode extends AbstractNode {
  up: number = 0
  down: number = 0
  width: number = 0
  height: number = 0

  constructor(tagName: string, attrs?, text?) {
    super(tagName, attrs, text)
  }
}

/**
 * @class Container class
 */
export class ContainerNode extends SvgNode {
}

export class ComplexContainerNode extends ContainerNode {
  items: Array<SvgNode>
}

/**
 * @class Leaf class
 */
export class LeafNode extends SvgNode {}

export class TextLeafNode extends LeafNode {
  text: string
  href: string
}

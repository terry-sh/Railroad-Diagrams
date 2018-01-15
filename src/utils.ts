import Terminal from "leaves/Terminal"
import SvgNode, { Attributes } from "Node"
import Config from "config"

export function unnull(...args): any {
  return args.reduce((sofar, x) => sofar !== undefined ? sofar : x)
}

export function determineGaps(outer: number, inner: number): [number, number] {
  var diff = outer - inner
  switch (Config.internalAlignment) {
    case "left":
      return [0, diff]
    case "right":
      return [diff, 0]
    case "center":
    default:
      return [diff / 2, diff / 2]
  }
}

export function wrapString(value: string | SvgNode): SvgNode {
  if (typeof value === "string") {
    return new Terminal(value)
  } else {
    return value
  }
}

export function sum(iter: Array<any>, func = x => x): number {
  return iter.map(func).reduce((a, b) => a + b, 0)
}

export function max(iter: Array<any>, func = x => x): number {
  return Math.max.apply(null, iter.map(func))
}

export function SVG(name: string, attrs: Attributes, text?: string): SVGElement {
  attrs = attrs || ({} as { string: any })
  text = text || ""

  let el = document.createElementNS("http://www.w3.org/2000/svg", name)
  for (let attr in attrs) {
    if (attr === "xlink:href")
      el.setAttributeNS("http://www.w3.org/1999/xlink", "href", attrs[attr])
    else
      el.setAttribute(attr, attrs[attr])
  }
  el.textContent = text
  return el
}

export function escapeString(string): string {
  // Escape markdown and HTML special characters
  return string.replace(/[*_\`\[\]<&]/g, (charString) => "&#" + charString.charCodeAt(0) + ";")
}

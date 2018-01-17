import Diagram from "diagrams/Diagram"
import Start from "leaves/Start"
import End from "leaves/End"
import SvgNode from "Node"

export default class ComplexDiagram extends Diagram {

  constructor(...items: Array<SvgNode>) {
    super(...items)

    this.items.shift()
    this.items.pop()
    this.items.unshift(new Start("complex"))
    this.items.push(new End("complex"))
  }
}

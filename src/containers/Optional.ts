import Choice from "containers/Choice"
import Skip from "leaves/Skip"
import SvgNode from "Node"

export default class Optional extends Choice {

  constructor(item: SvgNode, skip?: string) {
    if (skip === undefined) {
      super(1, new Skip(), item)      
    } else if (skip === "skip") {
      super(0, new Skip(), item)      
    } else {
      throw "Unknown value for Optional()'s 'skip' argument."
    }
  }

}

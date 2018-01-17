import Optional from "containers/Optional"
import OneOrMore from "containers/OneOrMore"
import SvgNode from "Node"

class ZeroOrMore extends Optional {

  constructor(item: SvgNode, rep: SvgNode, skip?: string) {
    super(new OneOrMore(item, rep), skip)
  }

}

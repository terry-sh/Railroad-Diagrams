// diagrams
import Diagram from "diagrams/Diagram"
import ComplexDiagram from "diagrams/ComplexDiagram"

// containers
import Sequence from "containers/Sequence"
import Stack from "containers/Stack"
import OptionalSequence from "containers/OptionalSequence"
import Choice from "containers/Choice"
import MultipleChoice from "containers/MultipleChoice"
import Optional from "containers/Optional"
import OneOrMore from "containers/OneOrMore"
import ZeroOrMore from "containers/ZeroOrMore"

// leaves
import Terminal from "leaves/Terminal"
import NonTerminal from "leaves/NonTerminal"
import Comment from "leaves/Comment"
import Skip from "leaves/Skip"

/** export */
declare var define: any
declare var exports: any

(function() {
  let root: any
  if (typeof define === "function" && define.amd) {
    // AMD. Register as an anonymous module.
    root = {}
    define([], function () {
      return root
    })
  } else if (typeof exports === "object") {
    // CommonJS for node
    root = exports
  } else {
    // Browser globals (root is window)
    root = this
  }
  
  /*
  These are the names that the internal classes are exported as.
  If you would like different names, adjust them here.
  */
  let components = {
    Diagram, ComplexDiagram, Sequence, Stack, OptionalSequence,
    Choice, MultipleChoice, Optional, OneOrMore,
    ZeroOrMore, Terminal, NonTerminal, Comment, Skip
  }

  /*
  Object.keys(components).forEach((attr) => {
    root[attr] = components[attr]
  })
  */

  root.Railroad = components
})()

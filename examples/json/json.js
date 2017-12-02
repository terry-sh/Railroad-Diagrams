// var style = require("./style.css")
var fs = require("fs")

// leaves
var Diagram = require("railroad-diagrams").Diagram
var ComplexDiagram = require("railroad-diagrams").ComplexDiagram

var Terminal = require("railroad-diagrams").Terminal
var NonTerminal = require("railroad-diagrams").NonTerminal
var Skip = require("railroad-diagrams").Skip
var Comment = require("railroad-diagrams").Comment

// containers
var Sequence = require("railroad-diagrams").Sequence
var Choice = require("railroad-diagrams").Choice
var Optional = require("railroad-diagrams").Optional
var OneOrMore = require("railroad-diagrams").OneOrMore
var ZeroOrMore = require("railroad-diagrams").ZeroOrMore

const style = fs.readFileSync("../style.css.xml")
function formatSvg(content) {
  return "<svg xmlns=\"http://www.w3.org/2000/svg\">\n"+
   style +
   content +
  "\n</svg>"
}

// object
var jsonObject = ComplexDiagram(
  "{",
  ZeroOrMore(
    Sequence(
      NonTerminal("string"),
      ":",
      NonTerminal("value")
    ),
    ","
  ),
  "}"
)
jsonObject.format(4) // padding
fs.writeFileSync('json-object.svg', formatSvg(jsonObject.toString()))

// array
var jsonArray = ComplexDiagram(
  "[",
  ZeroOrMore(
    NonTerminal("value"),
    ","
  ),
  "]"
)
jsonArray.format(4) // padding
fs.writeFileSync('json-array.svg', formatSvg(jsonArray.toString()))

// value
var jsonValue = ComplexDiagram(
  Choice(0,
    NonTerminal("string"),
    NonTerminal("number"),
    NonTerminal("object"),
    NonTerminal("array"),
    Terminal("true"),
    Terminal("false"),
    Terminal("null")
  )
)
jsonValue.format(4) // padding
fs.writeFileSync('json-value.svg', formatSvg(jsonValue.toString()))

// string
var jsonString = Diagram(
  Terminal("\""),
  ZeroOrMore(
    Choice(0,
      NonTerminal("Any UNICODE character except `\"`  or `\\` or control character"),
      Sequence(
        "\\",
        Choice(0,
          "\"", //quotation mark
          "\\", // reverse solidus
          "/",  // solidus
          "b",  // backsapce
          "f",  // formfeed
          "n",  // newline
          "r",  // carriage return
          "t",  // horizontal tab
          Sequence("u", NonTerminal("4 hexadecimal digits"))
        )
      )
    )
  ),
  Terminal("\"")
)
jsonString.format(4) // padding
fs.writeFileSync('json-string.svg', formatSvg(jsonString.toString()))


// RegExp:
// /^-?(?:0|[1-9]\d*)(?:\.\d\d*)?[eE][+-]?\d\d*$/
// number
var jsonNumber = Diagram(
  Choice(0,
    Skip(),
    Terminal("-")
  ),
  Choice(0,
    "0",
    Sequence(
      NonTerminal("digit 1-9"),
      Choice(1,
        Skip(),
        OneOrMore(
          NonTerminal("digit")
        )
      )
    )
  ),
  Choice(1,
    Skip(),
    Sequence(
      ".",
      OneOrMore(NonTerminal("digit"))
    )
  ),
  Choice(0,
    Skip(),
    Sequence(
      Choice(0, "e", "E"),
      Choice(1, "+", Skip(), "-"),
      OneOrMore(NonTerminal("digit"))
    )
  )
)
jsonNumber.format(4) // padding
fs.writeFileSync('json-number.svg', formatSvg(jsonNumber.toString()))

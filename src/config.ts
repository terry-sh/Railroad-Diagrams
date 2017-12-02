
export default class Config {

  static isDebug: boolean = true

  static verticalSeparation: number = 8

  static arcRadius: number = 10

  static diagramClass: string = "railroad-diagram"

  static strokeOddPixelLength: boolean = true

  static internalAlignment: string = "center"

  static get arcDiameter(): number {
    return this.arcRadius * 2
  }

}

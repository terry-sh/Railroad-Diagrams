export const DEFAULT_CLASSNAME = "railroad-diagram"

export class Config {
  get arcDiameter(): number {
    return this.arcRadius * 2
  }

  constructor(
    public isDebug: boolean,
    public verticalSeparation: number,
    public arcRadius: number,
    public diagramClass: string,
    public strokeOddPixelLength: boolean,
    public internalAlignment: "center" | "left" | "right",
  ) { }

}

export default new Config(true, 8, 10, DEFAULT_CLASSNAME, true, "center")

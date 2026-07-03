import { Logger, ILogObjMeta, ISettingsParam, ILogObj } from "tslog";

export class CustomLogger<ILogObj> extends Logger<ILogObj> {
  constructor(settings?: ISettingsParam<ILogObj>, logObj?: ILogObj) {
    super(settings, logObj);
  }

  public success(...args: unknown[]): (ILogObj & ILogObjMeta) | undefined {
    return super.log(0, "SUCCESS", ...args);
  }
}

const logger = new CustomLogger<ILogObj>({
  type: "pretty",
  prettyLogTemplate: "{{logLevelName}}\t{{fileNameWithLine}}\t",
  prettyLogStyles: {
    logLevelName: {
      "*": ["bold", "black", "bgWhiteBright", "dim"],
      SILLY: ["bold", "white"],
      TRACE: ["bold", "whiteBright"],
      DEBUG: ["bold", "green"],
      SUCCESS: ["bold", "greenBright"],
      INFO: ["bold", "blue"],
      WARN: ["bold", "yellow"],
      ERROR: ["bold", "red"],
      FATAL: ["bold", "redBright"],
    },
    filePathWithLine: "dim",
  },
} as ISettingsParam<ILogObj>);

export default logger;

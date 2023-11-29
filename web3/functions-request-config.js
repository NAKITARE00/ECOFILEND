import fs from "fs";
import {
    Location,
    ReturnType,
    CodeLanguage,
} from "@chainlink/functions-toolkit";

export const requestConfig = {
    source: fs.readFileSync("./source.js").toString(),

    codeLocation: Location.Inline,

    secrets: { apiKey: process.env.IQAIRAPI },

    secretsLocation: Location.DONHosted,

    args: ["Miami", "Florida", "USA"],

    codeLanguage: CodeLanguage.JavaScript,

    expectedReturnType: ReturnType.uint256,
}
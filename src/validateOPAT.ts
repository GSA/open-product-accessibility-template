// src/validateOPAT.ts

import Ajv from "ajv";
import { ValidatorResult } from "./ValidatorResult";

export function validateOPAT(data: unknown, schema: string): ValidatorResult {
  const ajv = new Ajv({
    allErrors: true,
    schemas: [require("../schema/opat-1.0.0.json")],
  });

  const validate = ajv.getSchema(schema);
  if (validate) {
    const valid = validate(data);
    if (valid) return { result: true, message: "Valid!" };
    else
      return {
        result: false,
        message: "Invalid: " + ajv.errorsText(validate.errors),
      };
  }
  return { result: false, message: "Invalid: schema is not valid" };
}

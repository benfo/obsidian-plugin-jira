import Ajv, { Schema } from "ajv";

export type ValidationError = { field: string; message: string };

export type ValidationResults = { valid: boolean; errors?: ValidationError[] };

export function jsonSchemaValidator<T>(
  data: T,
  schema: Schema
): ValidationResults {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (valid) {
    return { valid: true };
  }

  return {
    valid: false,
    errors: validate.errors
      ? validate.errors.map((error) => ({
          field: error.instancePath.substring(1),
          message: error.message ?? "",
        }))
      : [],
  };
}

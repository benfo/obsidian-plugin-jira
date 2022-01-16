import Ajv, { Schema } from "ajv";
import { parseYaml } from "obsidian";
import { createContext, FunctionalComponent } from "preact";
import { useContext, useMemo } from "preact/hooks";

export const MarkdownCodeBlockContext = createContext<string>(undefined);

export const MarkdownCodeBlockProvider: FunctionalComponent<{
  source: string;
}> = ({ children, source }) => {
  return (
    <MarkdownCodeBlockContext.Provider value={source} children={children} />
  );
};

export const useMarkdownCodeBlock = () => {
  const context = useContext(MarkdownCodeBlockContext);
  if (!context) {
    throw new Error(
      "useMarkdownCodeBlock can only be used inside MarkdownCodeBlockProvider"
    );
  }

  return context;
};

type CodeBlockData<T> = {
  data: T;
  valid: boolean;
  errors?: { field: string; message: string }[];
};

const jiraCodeBlockSchema: Schema = {
  type: "object",
  properties: {
    jql: { type: "string" },
    display: { type: "string", enum: ["table", "ul", "ol"] },
    fields: { type: "array", items: { type: "string" } },
  },
  required: ["jql"],
  additionalProperties: false,
};

export function useMarkdownCodeBlockYaml<T>(initial: T): CodeBlockData<T> {
  const source = useMarkdownCodeBlock();
  const settings = useMemo<CodeBlockData<T>>(() => {
    const codeBlockData = parseYaml(source);

    let parsedSettings = JSON.parse(JSON.stringify(initial));
    if (codeBlockData) {
      for (const key in codeBlockData) {
        if (Object.prototype.hasOwnProperty.call(codeBlockData, key)) {
          parsedSettings[key] = codeBlockData[key];
        }
      }
    }
    const ajv = new Ajv();
    const validate = ajv.compile(jiraCodeBlockSchema);
    const valid = validate(codeBlockData);
    if (!valid) console.log("Code block validation errors.", validate.errors);
    const data: CodeBlockData<T> = {
      data: parsedSettings,
      errors: validate.errors?.map((error) => {
        return { field: error.instancePath.substring(1), message: error.message };
      }),
      valid: valid,
    };
    return data;
  }, [source]);

  return settings;
}

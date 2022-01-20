import { FunctionComponent } from "preact";
import { withHttpClient } from "../components";
import { IssueFields } from "../../api";
import { useMarkdownCodeBlock } from "../../preact";
import Alert from "../components/Alert";
import { Schema } from "ajv";
import { parseYaml } from "obsidian";
import { jsonSchemaValidator } from "../../validation";
import IssuesDisplay from "./IssuesDisplay";

export type BlockDisplay = "ol" | "ul" | "table" | "json" | string;

export type JiraCodeBlock = {
  jql?: string;
  display: BlockDisplay;
  fields?: (keyof IssueFields)[];
};

const jiraCodeBlockSchema: Readonly<Schema> = {
  type: "object",
  properties: {
    jql: { type: "string" },
    display: { type: "string", enum: ["table", "ul", "ol", "json"] },
    fields: { type: "array", items: { type: "string" } },
  },
  required: ["jql"],
  additionalProperties: false,
};

const CodeBlockIssuesList = () => {
  const { valid, data, errors } = useMarkdownCodeBlock<JiraCodeBlock>({
    deserializer: (yaml) => parseYaml(yaml),
    validator: (value) => jsonSchemaValidator(value, jiraCodeBlockSchema),
  });

  if (!data) {
    return (
      <Alert variant="error">
        <Alert.Heading>Code Block Error</Alert.Heading>
        The code block must not be empty
      </Alert>
    );
  }

  if (!valid) {
    return (
      <Alert variant="error">
        <Alert.Heading>Code Block Error</Alert.Heading>
        {errors
          ?.map((error) =>
            [error.field, error.message].filter((v) => !!v).join(": ")
          )
          .join("\n")}
      </Alert>
    );
  }

  return <IssuesDisplay codeBlock={data} />;
};

export default withHttpClient(CodeBlockIssuesList);

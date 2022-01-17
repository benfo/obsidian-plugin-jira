import dayjs from "dayjs";
import { FunctionComponent } from "preact";
import { withHttpClient } from "./components";
import { Issue, IssueFields, SearchResults } from "../api";
import { useMarkdownCodeBlockYaml } from "../preact";
import { useQuery } from "../stores/queryStore";
import { useJiraApi } from "../tools";
import Alert from "./components/Alert";

type BlockDisplay = "ol" | "ul" | "table" | string;

type JiraCodeBlock = {
  jql?: string;
  display: BlockDisplay;
  fields?: (keyof IssueFields)[];
};
const BlockSettingsDefault: JiraCodeBlock = {
  display: "table",
  fields: ["summary"],
};

const ListDisplay: FunctionComponent<{
  results: SearchResults;
  display: BlockDisplay;
}> = ({ results, display }) => {
  const TagName = display;
  return (
    <TagName>
      {results.issues.map((i) => (
        <li>{i.fields.summary}</li>
      ))}
    </TagName>
  );
};

const FieldRenderer: FunctionComponent<{
  issue: Issue;
  field: keyof IssueFields;
}> = ({ issue, field }) => {
  switch (field) {
    case "assignee":
    case "reporter":
      return <>{issue.fields[field].displayName}</>;
    case "comment":
      return <>{issue.fields.comment}</>;
    case "summary":
      return <>{issue.fields.summary}</>;
    case "priority":
      return <>{issue.fields.priority.name}</>;
    case "created":
    case "updated":
      return <>{dayjs(issue.fields[field]).format("DD/MMM/YYYY")}</>;
    default:
      return <>{JSON.stringify(issue.fields[field])}</>;
  }
};

const TableDisplay: FunctionComponent<{
  results: SearchResults;
  baseURL: string;
  blockSettings: JiraCodeBlock;
}> = ({ results, baseURL, blockSettings }) => {
  const issueURL = new URL("browse", baseURL);
  return (
    <table>
      <thead>
        <tr>
          <th style={{ whiteSpace: "nowrap" }}>Key</th>
          {blockSettings.fields?.map((field) => {
            const displayName = results.names ? results.names[field] : field;
            return <th>{displayName ?? `${field}`}</th>;
          })}
        </tr>
      </thead>

      <tbody>
        {results.issues.map((issue) => (
          <tr>
            <td style="white-space:nowrap;">
              <a
                class="external-link"
                href={`${issueURL.toString()}/${issue.key}`}
              >
                {issue.key}
              </a>
            </td>
            {blockSettings.fields?.map((field) => (
              <td>
                <FieldRenderer issue={issue} field={field} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const CodeBlockIssuesList: FunctionComponent = () => {
  const {
    data: codeBlockData,
    valid: codeBlockValid,
    errors: codeBlockErrors,
  } = useMarkdownCodeBlockYaml<JiraCodeBlock>(BlockSettingsDefault);
  const api = useJiraApi();
  const { data, error: queryError } = useQuery(
    [codeBlockData.jql, ...codeBlockData.fields],
    () => {
      if (codeBlockValid) {
        return api.issues.search({
          jql: codeBlockData.jql,
          fields: codeBlockData.fields,
        });
      }
    },
    { enabled: codeBlockValid }
  );

  if (!codeBlockValid) {
    return (
      <Alert variant="error">
        <Alert.Heading>Code Block Error</Alert.Heading>
        {codeBlockErrors
          .map((error) =>
            [error.field, error.message].filter((v) => !!v).join(": ")
          )
          .join("\n")}
      </Alert>
    );
  }

  if (queryError) {
    return (
      <Alert variant="error">
        <Alert.Heading>Error</Alert.Heading>
        {queryError.toString()}
      </Alert>
    );
  }

  if (!data) {
    return (
      <Alert variant="secondary">
        <Alert.Heading>Loading</Alert.Heading>Please wait while fetching data...
      </Alert>
    );
  }

  if (data.warningMessages) {
    <Alert.Heading>Error</Alert.Heading>;
    return <Alert variant="error">{data.warningMessages.join("\n")}</Alert>;
  }
  if (data.errorMessages) {
    <Alert.Heading>Error</Alert.Heading>;
    return <Alert variant="error">{data.errorMessages.join("\n")}</Alert>;
  }

  if (codeBlockData.display === "ol" || codeBlockData.display === "ul") {
    return <ListDisplay results={data} display={codeBlockData.display} />;
  }

  if (codeBlockData.display === "table") {
    return (
      <TableDisplay
        results={data}
        baseURL={api.baseURL}
        blockSettings={codeBlockData}
      />
    );
  }

  return (
    <p>
      <pre>display: {codeBlockData.display}</pre> not supported
    </p>
  );
};

export default withHttpClient(CodeBlockIssuesList);

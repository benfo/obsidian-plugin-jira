import { FunctionComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { withHttpClient } from ".";
import { Issue, IssueFields, SearchResults } from "../../api";
import { useMarkdownCodeBlockYaml } from "../../preact";
import { useQuery } from "../../stores/queryStore";
import { useJiraApi } from "../../tools";
import Alert from "./Alert";

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
      return <>{issue.fields.assignee.displayName}</>;
    case "reporter":
      return <>{issue.fields.reporter.displayName}</>;
    case "summary":
    default:
      return <>{issue.fields[field]}</>;
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
          {blockSettings.fields?.map((field) => (
            <th style={{ textTransform: "capitalize" }}>{field}</th>
          ))}
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
  const codeBlock =
    useMarkdownCodeBlockYaml<JiraCodeBlock>(BlockSettingsDefault);
  const api = useJiraApi();
  const { data, error } = useQuery([codeBlock.jql, ...codeBlock.fields], () => {
    return api.issues.search({
      jql: codeBlock.jql,
      fields: codeBlock.fields,
    });
  });
  // const [data, setData] = useState<SearchResults | undefined>(undefined);
  // useEffect(() => {
  //   api.issues
  //     .search({
  //       jql: codeBlock.jql,
  //       fields: codeBlock.fields,
  //     })
  //     .then((data) => setData(data));
  // }, []);

  if (error) {
    return <span>{error.toString()}</span>;
  }

  if (!data) {
    return (
      <Alert variant="secondary">
        <Alert.Heading>Loading</Alert.Heading>Please wait while fetching data...
      </Alert>
    );
  }

  if (data.warningMessages) {
    return <span>{data.warningMessages.join("\n")}</span>;
  }
  if (data.errorMessages) {
    return <span>{data.errorMessages.join("\n")}</span>;
  }

  if (codeBlock.display === "ol" || codeBlock.display === "ul") {
    return <ListDisplay results={data} display={codeBlock.display} />;
  }

  if (codeBlock.display === "table") {
    return (
      <TableDisplay
        results={data}
        baseURL={api.baseURL}
        blockSettings={codeBlock}
      />
    );
  }

  return (
    <p>
      <pre>display: {codeBlock.display}</pre> not supported
    </p>
  );
};

export default withHttpClient(CodeBlockIssuesList);

import { FunctionComponent } from "preact";
import { withHttpClient } from ".";
import { SearchResults } from "../../api";
import { useQuery } from "../../stores/queryStore";
import { useJiraApi, useMarkdownCodeBlockYaml } from "../../tools";

type BlockDisplay = "ol" | "ul" | "table" | string;

type BlockSettings = {
  jql?: string;
  display: BlockDisplay;
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

const TableDisplay: FunctionComponent<{
  results: SearchResults;
  baseURL: string;
}> = ({ results, baseURL }) => {
  const issueURL = new URL("browse", baseURL);
  return (
    <table>
      <thead>
        <tr>
          <th style="white-space:nowrap;">Key</th>
          <th>Summary</th>
        </tr>
      </thead>

      <tbody>
        {results.issues.map((i) => (
          <tr>
            <td style="white-space:nowrap;">
              <a class="external-link" href={`${issueURL.toString()}/${i.key}`}>{i.key}</a>
            </td>
            <td>{i.fields.summary}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const CodeBlockIssuesList: FunctionComponent = () => {
  const codeBlock = useMarkdownCodeBlockYaml<BlockSettings>({
    display: "table",
  });
  const api = useJiraApi();
  const { data, error } = useQuery(codeBlock.jql, () =>
    api.issues.search(codeBlock.jql)
  );

  if (error) {
    return <span>{error.toString()}</span>;
  }

  if (!data) {
    return <span>Loading...</span>;
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
    return <TableDisplay results={data} baseURL={api.baseURL} />;
  }

  return (
    <div>
      <pre>as: {codeBlock.display}</pre> not supported
    </div>
  );
};

export default withHttpClient(CodeBlockIssuesList);

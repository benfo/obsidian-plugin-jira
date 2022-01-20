import { SearchResults } from "../../api";
import { JiraCodeBlock } from "./CodeBlockIssuesList";
import FieldRenderer from "./FieldRenderer";
import IssueLink from "./IssueLink";

type TableDisplayProps = {
  results: SearchResults;
  baseURL: string;
  blockSettings: JiraCodeBlock;
};

const TableDisplay = ({
  results,
  baseURL,
  blockSettings,
}: TableDisplayProps) => {
  return (
    <table>
      <thead>
        <tr>
          <th style={{ whiteSpace: "nowrap" }}>Key</th>
          {blockSettings.fields?.map((field: string) => {
            const displayName = results.names ? results.names[field] : field;
            return <th>{displayName ?? `${field}`}</th>;
          })}
        </tr>
      </thead>

      <tbody>
        {results.issues.map((issue) => (
          <tr>
            <td style={{ whiteSpace: "nowrap" }}>
              <IssueLink issue={issue} baseURL={baseURL} />
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

export default TableDisplay;

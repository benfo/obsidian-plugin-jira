import { SearchResults, useJiraApi } from "../../api";
import FieldRenderer from "./FieldRenderer";
import IssueLink from "./IssueLink";

type ListDisplayProps = {
  results: SearchResults;
  display: "ol" | "ul";
};

const ListDisplay = ({ results, display }: ListDisplayProps) => {
  const api = useJiraApi();

  const TagName = display;
  return (
    <TagName>
      {results.issues.map((issue) => (
        <li>
          <IssueLink issue={issue} baseURL={api.baseURL} />
          {" - "}
          <FieldRenderer issue={issue} field="summary"></FieldRenderer>
        </li>
      ))}
    </TagName>
  );
};

export default ListDisplay;

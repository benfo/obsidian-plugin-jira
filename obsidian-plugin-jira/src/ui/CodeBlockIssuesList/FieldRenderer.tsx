import dayjs from "dayjs";
import { FunctionComponent } from "preact";
import { Issue, IssueFields } from "../../api";

type FieldRendererProps = {
  issue: Issue;
  field: keyof IssueFields;
};

const FieldRenderer = ({ issue, field }: FieldRendererProps) => {
  switch (field) {
    case "assignee":
    case "reporter":
    case "creator":
      return <>{issue.fields[field]?.displayName}</>;
    case "comment":
      return <>{issue.fields.comment}</>;
    case "summary":
      return <>{issue.fields.summary}</>;
    case "priority":
      return <>{issue.fields.priority?.name}</>;
    case "created":
    case "updated":
      return <>{dayjs(issue.fields[field]).format("DD/MMM/YYYY")}</>;
    case "timetracking":
      return <>{issue.fields.timetracking?.timeSpent}</>;
    case "issuetype":
      return <>{issue.fields.issuetype?.name}</>;
    case "status":
      return <>{issue.fields.status.name}</>;

    default:
      return <pre>{JSON.stringify(issue.fields[field], null, 2)}</pre>;
  }
};

export default FieldRenderer;

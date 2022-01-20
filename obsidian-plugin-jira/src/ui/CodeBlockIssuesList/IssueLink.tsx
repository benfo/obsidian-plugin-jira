import { Issue } from "../../api";
import { ExternalLink } from "../components";

type IssueLinkProps = {
  issue: Issue;
  baseURL: string;
};

const IssueLink = ({ issue, baseURL }: IssueLinkProps) => {
  const url = new URL("browse", baseURL);
  return (
    <ExternalLink href={`${url.toString()}/${issue.key}`}>
      {issue.key}
    </ExternalLink>
  );
};

export default IssueLink;

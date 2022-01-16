import log, { Logger } from "loglevel";
import { JiraApi } from "..";

export type WarningMessages = {
  warningMessages?: string[];
  errorMessages?: string[];
};

export type SearchResults = {
  expand: string;
  issues: Issue[];
  maxResults: number;
  startAt: number;
  total: number;
} & WarningMessages;

export type Issue = {
  expand: string;
  id: string;
  self: string;
  key: string;
  fields: IssueFields;
};

export type Account = {
  self: string;
  accountId: string;
  emailAddress: string;
  displayName: string;
  active: boolean;
  timeZone: string;
  accountType: string;
  avatarUrls: Map<string, string>;
};

export type IssueFields = {
  summary?: string;
  comment?: string;
  assignee?: Account;
  reporter?: Account;
};

export class IssuesEndpoint {
  constructor(private jiraApi: JiraApi, private logger: Logger) {}

  async search(options: { jql: string; fields?: (keyof IssueFields)[] }) {
    this.logger.debug("Calling issues.search", options);
    const result = await this.jiraApi.client.get<SearchResults>(
      "/rest/api/3/search",
      {
        data: {
          validateQuery: "warn",
          fields: options.fields?.join(","),
          jql: options.jql,
        },
      }
    );
    return result;
  }
}

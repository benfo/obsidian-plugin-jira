import { JiraApi } from "..";
import { IHttpClient } from "../../http/HttpClient";

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

export type IssueFields = {
  summary?: string;
};

export class IssuesEndpoint {
  constructor(private jiraApi: JiraApi) {}

  async search(jql: string) {
    const result = await this.jiraApi.client.get<SearchResults>(
      "/rest/api/3/search",
      {
        data: {
          validateQuery: "warn",
          fields: "summary,comment",
          jql: jql,
        },
      }
    );
    return result;
  }
}

import { Logger } from "loglevel";
import { JiraApi } from "..";

export type WarningMessages = {
  warningMessages?: string[];
  errorMessages?: string[];
};

export type SearchResults = {
  expand: string;
  issues: Issue[];
  names?: Record<string, string>;
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

export type Comment = {
  author: Account;
  body: any; //TODO: this is a complicated structure and will have to see if there is a parser for it
  created: string;
  id: string;
  jsdPublish: boolean;
  self: string;
  updateAuthor: Account;
  updated: string;
};

export type CommentField = {
  comments: Comment[];
  maxResults: number;
  self: string;
  startAt: number;
  total: number;
};

export type Priority = {
  iconUrl: string;
  id: string;
  name: string;
  self: string;
};

export type TimeTracking = {
  remainingEstimate: string;
  remainingEstimateSeconds: number;
  timeSpent: string;
  timeSpentSeconds: number;
};

export type IssueType = {
  self: string;
  id: string;
  description: string;
  iconUrl: string;
  name: string;
  subtask: boolean;
  hierarchyLevel: number;
  avatarId?: number;
};
export type Status = {
  self: string;
  description: string;
  iconUrl: string;
  name: string;
  id: string;
  statusCategory: {
    self: string;
    id: number;
    key: string;
    colorName: string;
    name: string;
  };
};
export type IssueFields = {
  summary?: string;
  comment?: string;
  assignee?: Account;
  reporter?: Account;
  creator?: Account;
  priority?: Priority;
  updated?: string;
  created?: string;
  timetracking?: TimeTracking;
  issuetype?: IssueType;
  status: Status;
};

type seachOptions = { jql?: string; fields?: (keyof IssueFields)[] };

export class IssuesEndpoint {
  constructor(private jiraApi: JiraApi, private logger: Logger) {}

  async search(options: seachOptions) {
    this.logger.debug("Calling issues.search", options);

    const result = await this.jiraApi.client.get<SearchResults>(
      "/rest/api/3/search",
      {
        data: {
          validateQuery: "warn",
          fields: options.fields?.join(","),
          jql: options.jql,
          expand: "names",
        },
      }
    );
    return result;
  }
}

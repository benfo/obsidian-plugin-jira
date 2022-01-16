import log from "loglevel";
import { IHttpClient } from "../http/HttpClient";
import { IssuesEndpoint } from "./endpoints/IssuesEndpoint";

export const logger = log.getLogger("JiraApi");

export default class JiraApi {
  public readonly issues: IssuesEndpoint;
  public readonly baseURL: string;

  constructor(public client: IHttpClient) {
    this.baseURL = client.options.baseURL;
    this.issues = new IssuesEndpoint(this, logger);
  }
}

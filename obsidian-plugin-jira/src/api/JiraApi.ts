import { getLogger } from "loglevel";
import { IHttpClient } from "../http/HttpClient";
import { IssuesEndpoint } from "./endpoints/IssuesEndpoint";

export const logger = getLogger("JiraApi");

export default class JiraApi {
  public readonly issues: IssuesEndpoint;
  public readonly baseURL: string;

  constructor(public client: IHttpClient) {
    if (!client.options?.baseURL) {
      throw new Error("JiraApi requires a baseURL");
    }

    this.baseURL = client.options?.baseURL;
    this.issues = new IssuesEndpoint(this, logger);
  }
}

import { encode } from "js-base64";
import { request, RequestParam } from "obsidian";
import { DefaultHttpClientOptions } from ".";
import { HttpClientOptions, IHttpClient } from "./HttpClient";

export default class ObsidianHttpClient implements IHttpClient {
  constructor(readonly options?: Partial<HttpClientOptions>) {}

  get<T>(url: string, options: Partial<HttpClientOptions>): Promise<T> {
    return this.request<T>({ ...options, method: "GET", url });
  }

  async request<T>(options: Partial<HttpClientOptions>): Promise<T> {
    const ops = { ...DefaultHttpClientOptions, ...this.options, ...options };
    const url = ops.baseURL
      ? new URL(options.url, ops.baseURL)
      : new URL(options.url);
    if (ops.data) {
      const params = new URLSearchParams(JSON.parse(JSON.stringify(ops.data)));
      url.search = params.toString();
    }

    let headers = { ...ops.headers };
    if (ops.auth) {
      headers.Authorization = `Basic ${encode(
        `${ops.auth.username}:${ops.auth.password}`
      )}`;
    }

    const requestParam: RequestParam = {
      url: url.toString(),
      method: ops.method,
      headers,
    };

    try {
      const result = await request(requestParam);
      return JSON.parse(result) as T;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

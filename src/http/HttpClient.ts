export type PlainObject = {
  [key: string]: any;
};

export type HttpMethods = "GET" | "POST" | "PUT" | "DELETE";
export type HttpHeaderNames = "Authorization" | "Accept" | "Content-Type";
export type HttpHeaders = Record<string, string> & {
  [Values in HttpHeaderNames]?: string;
};

export type HttpClientOptions = {
  baseURL: string;
  url: string;
  headers: HttpHeaders;
  method: HttpMethods;
  auth: {
    username: string;
    password: string;
  };
  data: string[][] | Record<string, string> | string;
};

export const DefaultHttpClientOptions: Partial<HttpClientOptions> = {
  headers: {
    "Content-Type": "application/json",
  },
};

export interface IHttpClient {
  readonly options?: Partial<HttpClientOptions>;
  get<T>(url: string, options: Partial<HttpClientOptions>): Promise<T>;
  request<T>(options: Partial<HttpClientOptions>): Promise<T>;
}

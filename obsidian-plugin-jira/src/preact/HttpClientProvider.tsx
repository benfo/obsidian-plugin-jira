import { createContext, FunctionalComponent } from "preact";
import { useContext } from "preact/hooks";
import { IHttpClient } from "../http/HttpClient";

export const HttpClientContext = createContext<IHttpClient | undefined>(
  undefined
);

export const HttpClientProvider: FunctionalComponent<{
  client: IHttpClient;
}> = ({ children, client }) => {
  return <HttpClientContext.Provider value={client} children={children} />;
};

export const useHttpClient = () => {
  const client = useContext(HttpClientContext);
  if (!client) {
    throw new Error("useHttpClient can only be used inside HttpClientProvider");
  }

  return client;
};

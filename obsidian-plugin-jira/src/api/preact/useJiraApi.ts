import { useHttpClient } from "../../preact/HttpClientProvider";
import { JiraApi } from "..";
import { useRef } from "preact/hooks";

const useJiraApi = () => {
  const client = useHttpClient();
  const apiRef = useRef<JiraApi>();
  if (!apiRef.current) {
    apiRef.current = new JiraApi(client);
  }
  return apiRef.current;
};

export default useJiraApi;

import { useHttpClient } from "../http/HttpClientProvider";
import { JiraApi } from "../api";

const useJiraApi = () => {
  const client = useHttpClient();
  return new JiraApi(client);
};

export default useJiraApi;

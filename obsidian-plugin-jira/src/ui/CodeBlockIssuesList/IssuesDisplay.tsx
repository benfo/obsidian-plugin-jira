import { useStore } from "@nanostores/preact";
import { actionFor, mapTemplate } from "nanostores";
import { FunctionComponent } from "preact";
import { useEffect } from "preact/hooks";
import { SearchResults, useJiraApi } from "../../api";
import Alert from "../components/Alert";
import { JiraCodeBlock } from "./CodeBlockIssuesList";
import JsonDisplay from "./JsonDisplay";
import ListDisplay from "./ListDisplay";
import TableDisplay from "./TableDisplay";

export function generateKey(keys: string[]) {
  return keys.sort().join("-");
}

type SearchResultValue<T> = {
  id: string;
  status?: "loading" | "success" | "error";
  data?: T;
};
const SearchResult = mapTemplate<SearchResultValue<SearchResults>>();
const performSearch = actionFor(
  SearchResult,
  "performSearch",
  async (store, searchFn: () => Promise<any>) => {
    if (store.get().status) {
      return;
    }

    store.setKey("status", "loading");
    const data = await searchFn();
    store.setKey("data", data);
    store.setKey("status", "success");
  }
);

type IssueDisplayProps = {
  codeBlock: JiraCodeBlock;
};

const IssuesDisplay = ({ codeBlock }: IssueDisplayProps) => {
  const key = generateKey([...(codeBlock.fields ?? []), codeBlock.jql ?? ""]);
  const result = SearchResult(key);
  const resultStore = useStore(result);
  const api = useJiraApi();

  useEffect(() => {
    performSearch(result, () =>
      api.issues.search({ jql: codeBlock.jql, fields: codeBlock.fields })
    );
  }, [key]);

  if (!resultStore.data) {
    return (
      <Alert variant="secondary">
        <Alert.Heading>Loading</Alert.Heading>
        Please wait while fetching data...
      </Alert>
    );
  }

  if (resultStore.data.warningMessages) {
    return (
      <Alert variant="error">
        <Alert.Heading>Error</Alert.Heading>;
        {resultStore.data.warningMessages.join("\n")}
      </Alert>
    );
  }
  if (resultStore.data.errorMessages) {
    return (
      <Alert variant="error">
        <Alert.Heading>Error</Alert.Heading>;
        {resultStore.data.errorMessages.join("\n")}
      </Alert>
    );
  }

  if (codeBlock.display === "ol" || codeBlock.display === "ul") {
    return (
      <ListDisplay results={resultStore.data} display={codeBlock.display} />
    );
  }

  if (codeBlock.display === "table") {
    return (
      <TableDisplay
        results={resultStore.data}
        baseURL={api.baseURL}
        blockSettings={codeBlock}
      />
    );
  }

  if (codeBlock.display === "json") {
    return <JsonDisplay results={resultStore.data} />;
  }

  return (
    <Alert variant="error">
      <Alert.Heading>Error</Alert.Heading> display: {codeBlock.display} not
      supported
    </Alert>
  );
};

export default IssuesDisplay;

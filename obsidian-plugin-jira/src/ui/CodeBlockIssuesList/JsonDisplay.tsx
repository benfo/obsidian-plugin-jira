import { FunctionComponent } from "preact";
import { SearchResults } from "../../api";
import { loadPrism } from "obsidian";
import { useEffect, useState } from "preact/hooks";

type JsonDisplayProps = {
  results: SearchResults;
};

const JsonDisplay = ({ results }: JsonDisplayProps) => {
  const json = JSON.stringify(results.issues, null, 2);
  const [code, setCode] = useState(json);

  const highlightCode = async () => {
    const Prism = await loadPrism();
    setCode(Prism.highlight(json, Prism.languages.json, "json"));
  };

  useEffect(() => {
    highlightCode();
  }, [results]);

  return (
    <pre className="language-json">
      <code
        className="language-json"
        dangerouslySetInnerHTML={{ __html: code }}
      ></code>
    </pre>
  );
};

export default JsonDisplay;

import { parseYaml } from "obsidian";
import { createContext, FunctionalComponent } from "preact";
import { useContext, useMemo } from "preact/hooks";

export const MarkdownCodeBlockContext = createContext<string>(undefined);

export const MarkdownCodeBlockProvider: FunctionalComponent<{
  source: string;
}> = ({ children, source }) => {
  return (
    <MarkdownCodeBlockContext.Provider value={source} children={children} />
  );
};

export const useMarkdownCodeBlock = () => {
  const context = useContext(MarkdownCodeBlockContext);
  if (!context) {
    throw new Error(
      "useMarkdownCodeBlock can only be used inside MarkdownCodeBlockProvider"
    );
  }

  return context;
};

export function useMarkdownCodeBlockYaml<S>(initial: S) {
  const source = useMarkdownCodeBlock();
  const settings = useMemo(() => {
    const yaml = parseYaml(source);
    let parsedSettings = JSON.parse(JSON.stringify(initial));
    if (yaml) {
      for (const key in yaml) {
        if (Object.prototype.hasOwnProperty.call(yaml, key)) {
          parsedSettings[key] = yaml[key];
        }
      }
    }
    return parsedSettings;
  }, [source]);

  return settings;
}

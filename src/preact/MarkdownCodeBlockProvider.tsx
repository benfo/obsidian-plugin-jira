import { createContext, FunctionalComponent } from "preact";
import { useContext, useMemo } from "preact/hooks";
import { ValidationError, ValidationResults } from "../validation";

export const MarkdownCodeBlockContext = createContext<string | undefined>(
  undefined
);

export const MarkdownCodeBlockProvider: FunctionalComponent<{
  source: string;
}> = ({ children, source }) => {
  return (
    <MarkdownCodeBlockContext.Provider value={source} children={children} />
  );
};

type parserOptions<T> = {
  deserializer: (value: string) => T;
  validator?: (value: T) => ValidationResults;
};

type codeBlockType<T> = {
  valid: boolean;
  data?: T;
  errors?: ValidationError[];
};

export function useMarkdownCodeBlock<T>(
  options: parserOptions<T>
): codeBlockType<T> {
  const source = useContext(MarkdownCodeBlockContext);
  if (source === undefined) {
    throw new Error(
      "useMarkdownCodeBlock can only be used inside MarkdownCodeBlockProvider"
    );
  }

  const state = useMemo<codeBlockType<T>>(() => {
    try {
      const data = options.deserializer(source);

      const validator: (value: T) => ValidationResults = options.validator
        ? options.validator
        : (_value: T) => ({
            valid: true,
          });

      var validationResults = validator(data);
      return { data, ...validationResults };
    } catch (error) {
      if (error instanceof Error) {
        return {
          valid: false,
          errors: [{ field: error.name, message: error.message }],
        };
      } else {
        return {
          valid: false,
          errors: [
            {
              field: "",
              message:
                "An unknown error has occured while parsing the code block.",
            },
          ],
        };
      }
    }
  }, [source]);

  return state;
}

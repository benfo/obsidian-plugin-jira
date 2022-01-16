import { Plugin } from "obsidian";
import { createContext, FunctionalComponent } from "preact";
import { useContext } from "preact/hooks";

export const PluginContext = createContext<Plugin>(undefined);

export const PluginProvider: FunctionalComponent<{ plugin: Plugin }> = ({
  children,
  plugin,
}) => {
  return <PluginContext.Provider value={plugin} children={children} />;
};

export function usePlugin<T extends Plugin>() {
  const plugin = useContext(PluginContext);
  if (plugin === null) {
    throw "usePlugin can only be used inside a PluginProvider";
  }
  return plugin as T;
}

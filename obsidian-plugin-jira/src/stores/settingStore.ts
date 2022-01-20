import log from "loglevel";
import { Plugin } from "obsidian";
import { map } from "nanostores";
import { DefaultHttpClientOptions } from "../http";

export type JiraPluginSettings = {
  username: string;
  password: string;
  baseURL: string;
};

export const settingsStore = map<JiraPluginSettings>();

export const persistenceManager = async (plugin: Plugin) => {
  const data = await plugin.loadData();
  log.debug("Settings loaded");
  settingsStore.set(data);

  return settingsStore.subscribe(async (store, changedKey) => {
    if (changedKey) {
      log.debug("Saving changed settings");

      await plugin.saveData(store);
    }
  });
};

export const syncHttpClientDefaults = () => {
  return settingsStore.subscribe((store) => {
    log.debug("Updating http client settings");
    DefaultHttpClientOptions.auth = {
      password: store.password,
      username: store.username,
    };
    DefaultHttpClientOptions.baseURL = store.baseURL;
  });
};

export class SettingsManager {
  private subscriptions: Array<() => void> = [];

  constructor(private plugin: Plugin) {
    this.load();
  }

  async load() {
    this.subscriptions.push(await persistenceManager(this.plugin));
    this.subscriptions.push(syncHttpClientDefaults());
  }
  unload() {
    this.subscriptions.forEach((unsubscribe) => unsubscribe());
  }
}

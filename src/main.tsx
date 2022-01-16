import CodeBlockIssuesList from "./ui/CodeBlockIssuesList";
import SettingsTab from "./ui/SettingsTab";
import log from "loglevel";
import { SettingsManager } from "./stores/settingStore";
import { PreactPlugin } from "./preact";

// Set up logging
const defaultLogLevel = process.env.BUILD === "prod" ? "info" : "debug";
log.setDefaultLevel(defaultLogLevel);
log.getLogger("queryStore").setDefaultLevel(defaultLogLevel);
log.getLogger("JiraApi").setDefaultLevel(defaultLogLevel);
log.getLogger("ObsidianHttpClient").setDefaultLevel(defaultLogLevel);

export default class JiraPlugin extends PreactPlugin {
  settingsManager: SettingsManager;

  async onload() {
    log.info("Loading Jira plugin");

    this.settingsManager = new SettingsManager(this);

    this.registerPreactMarkdownCodeBlockProcessor(
      "jira",
      <CodeBlockIssuesList />
    );

    this.addSettingTab(new SettingsTab(this.app, this));
  }

  unload(): void {
    this.settingsManager.unload();
    log.info("Unloading Jira plugin");
  }
}

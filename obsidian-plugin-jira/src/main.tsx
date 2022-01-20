import SettingsTab from "./ui/SettingsTab";
import { getLogger } from "loglevel";
import { SettingsManager } from "./stores/settingStore";
import { PreactPlugin } from "./preact";
import CodeBlockIssuesList from "./ui/CodeBlockIssuesList/CodeBlockIssuesList";
import { setLogLevels } from "./logging";

const logger = getLogger("JiraPlugin");

export default class JiraPlugin extends PreactPlugin {
  settingsManager?: SettingsManager;
  async onload() {
    setLogLevels();

    logger.info("Loading Jira plugin");

    this.settingsManager = new SettingsManager(this);

    this.registerPreactMarkdownCodeBlockProcessor(
      "jira",
      <CodeBlockIssuesList />
    );

    this.addSettingTab(new SettingsTab(this.app, this));
  }

  unload(): void {
    this.settingsManager?.unload();
    logger.info("Unloading Jira plugin");
  }
}

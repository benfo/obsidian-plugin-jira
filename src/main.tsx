import { Plugin } from "obsidian";
import CodeBlockIssuesList from "./ui/components/CodeBlockIssuesList";
import MarkdownRenderChildPreact from "./renderer/MarkdownRenderChildPreact";
import SettingsTab from "./ui/SettingsTab";
import log from "loglevel";
import { SettingsManager } from "./stores/settingStore";
import { renderModal } from "./renderer/ModalRenderer";
import { usePlugin } from "./tools";

export default class JiraPlugin extends Plugin {
  settingsManager: SettingsManager;

  async onload() {
    const defaultLogLevel = process.env.BUILD === "prod" ? "info" : "debug";
    log.setDefaultLevel(defaultLogLevel);
    log.info("Loading Jira plugin");

    this.settingsManager = new SettingsManager(this);

    this.registerMarkdownCodeBlockProcessor("jira", (source, el, ctx) => {
      ctx.addChild(
        new MarkdownRenderChildPreact(el, source, () => <CodeBlockIssuesList />)
      );
    });

    this.addSettingTab(new SettingsTab(this.app, this));
  }

  unload(): void {
    this.settingsManager.unload();
    log.info("Unloading Jira plugin");
  }
}

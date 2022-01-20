import { PluginSettingTab, Setting } from "obsidian";
import { settingsStore } from "../stores/settingStore";

export default class SettingsTab extends PluginSettingTab {
  display() {
    let { containerEl } = this;
    containerEl.empty();

    new Setting(this.containerEl)
      .setName("Base URL")
      .setDesc("The base URL")
      .addText((text) => {
        text.setPlaceholder("Base URL");
        text.setValue(settingsStore.get().baseURL);
        text.onChange((value) => {
          settingsStore.setKey("baseURL", value);
        });
      });
    new Setting(this.containerEl)
      .setName("Username")
      .setDesc("Jira username")
      .addText((text) => {
        text.setPlaceholder("Username");
        text.setValue(settingsStore.get().username);
        text.onChange((value) => {
          settingsStore.setKey("username", value);
        });
      });
    new Setting(this.containerEl)
      .setName("Password")
      .setDesc("Jira password")
      .addText((text) => {
        text.setPlaceholder("Password");
        text.setValue(settingsStore.get().password);
        text.onChange((value) => {
          settingsStore.setKey("password", value);
        });
      });
  }
}

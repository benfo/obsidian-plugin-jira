import { App, Plugin, Modal } from "obsidian";
import { ComponentChild, render } from "preact";
import { PluginProvider } from "../tools";

export default class ModalRenderer extends Modal {
  constructor(vnode: ComponentChild, title: string, plugin: Plugin) {
    super(plugin.app);

    this.titleEl.innerText = title;
    render(<PluginProvider plugin={plugin} children={vnode} />, this.contentEl);

    this.open();
  }

  onClose(): void {
    render(null, this.containerEl);
  }
}

export const renderModal = (
  vnode: ComponentChild,
  title: string,
  plugin: Plugin
) => {
  new ModalRenderer(vnode, title, plugin);
};

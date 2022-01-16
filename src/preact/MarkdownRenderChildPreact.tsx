import { ComponentChild, render } from "preact";
import {
  MarkdownPostProcessorContext,
  MarkdownRenderChild,
  Plugin,
} from "obsidian";
import { PluginProvider } from "./PluginProvider";
import { MarkdownCodeBlockProvider } from "./MarkdownCodeBlockProvider";

export default class MarkdownRenderChildPreact extends MarkdownRenderChild {
  constructor(
    private plugin: Plugin,
    private source: string,
    el: HTMLElement,
    private ctx: MarkdownPostProcessorContext,
    private vnode: ComponentChild
  ) {
    super(el);
  }
  onload(): void {
    render(
      <PluginProvider plugin={this.plugin}>
        <MarkdownCodeBlockProvider source={this.source} children={this.vnode} />
      </PluginProvider>,
      this.containerEl
    );
  }

  unload(): void {
    render(null, this.containerEl);
  }
}

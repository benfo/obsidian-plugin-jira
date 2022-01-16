import { MarkdownPostProcessorContext, Plugin } from "obsidian";
import { ComponentChild } from "preact";
import MarkdownRenderChildPreact from "./MarkdownRenderChildPreact";

export default class PreactPlugin extends Plugin {
  registerPreactMarkdownCodeBlockProcessor(language: string, vnode: ComponentChild) {
    return super.registerMarkdownCodeBlockProcessor(
      language,
      (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
        ctx.addChild(
          new MarkdownRenderChildPreact(this, source, el, ctx, vnode)
        );
      }
    );
  }
}

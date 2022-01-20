import { MarkdownPostProcessorContext, Plugin } from "obsidian";
import { ComponentChild, FunctionComponent } from "preact";
import MarkdownRenderChildPreact from "./MarkdownRenderChildPreact";

export default class PreactPlugin extends Plugin {
  registerPreactMarkdownCodeBlockProcessor(
    language: string,
    vnode: ComponentChild
  ) {
    return this.registerMarkdownCodeBlockProcessor(
      language,
      (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
        ctx.addChild(
          new MarkdownRenderChildPreact(this, source, el, ctx, vnode)
        );
      }
    );
  }
}

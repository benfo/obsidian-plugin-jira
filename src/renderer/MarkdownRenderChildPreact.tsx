import {
  FunctionComponent,
  render,
} from "preact";
import { MarkdownRenderChild } from "obsidian";
import { MarkdownCodeBlockProvider } from "../tools";


export default class MarkdownRenderChildPreact extends MarkdownRenderChild {
  constructor(
    containerEl: HTMLElement,
    private source: string,
    private Component: FunctionComponent
  ) {
    super(containerEl);
  }
  onload(): void {
    render(
      <MarkdownCodeBlockProvider source={this.source}>
        <this.Component />
      </MarkdownCodeBlockProvider>,
      this.containerEl
    );
  }

  unload(): void {
    render(null, this.containerEl);
  }
}

import {
  defaultHidableSyntaxExtensions,
  escapeMarkdownExtension,
} from './hide';
import { emojiMarkdownExtension } from './fold/emoji';
import { defaultFoldableSyntaxExtensions } from './fold';
import {
  additionalMarkdownSyntaxTags,
  syntaxHighlightPlugin,
  themePlugin,
} from './syntaxHighlighting';
import { clickLinkExtension } from './clickLink';
import {
  codeBlockDecorationsExtension,
  codeFenceTheme,
} from './codeFenceExtension';

export {
  foldDecorationExtension,
  foldableSyntaxFacet,
  selectAllDecorationsOnSelectExtension,
} from './fold/core';
export { eventHandlersWithClass } from './utils';

export const prosemarkMarkdownExtensions = [
  additionalMarkdownSyntaxTags,
  escapeMarkdownExtension,
  emojiMarkdownExtension,
];

export const prosemarkExtensions = [
  themePlugin,
  syntaxHighlightPlugin,
  defaultHidableSyntaxExtensions,
  defaultFoldableSyntaxExtensions,
  clickLinkExtension,
  codeBlockDecorationsExtension,
  codeFenceTheme,
];

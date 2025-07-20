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

export {
  foldDecorationExtension,
  foldableSyntaxFacet,
  selectAllDecorationsOnSelectExtension,
} from './fold/core';
export { eventHandlersWithClass, justPluginSpec } from './utils';

export const hypermdMarkdownExtensions = [
  additionalMarkdownSyntaxTags,
  escapeMarkdownExtension,
  emojiMarkdownExtension,
];

export const hypermdExtensions = [
  themePlugin,
  syntaxHighlightPlugin,
  defaultHidableSyntaxExtensions,
  defaultFoldableSyntaxExtensions,
];

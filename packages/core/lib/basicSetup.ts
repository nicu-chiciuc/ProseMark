import { keymap, dropCursor, EditorView } from '@codemirror/view';
import { type Extension } from '@codemirror/state';
import {
  defaultHighlightStyle,
  syntaxHighlighting,
  indentOnInput,
  bracketMatching,
  foldGutter,
  foldKeymap,
} from '@codemirror/language';
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from '@codemirror/commands';
import { searchKeymap } from '@codemirror/search';
import {
  autocompletion,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap,
} from '@codemirror/autocomplete';
import { lintKeymap } from '@codemirror/lint';
import { defaultHideExtensions, escapeMarkdownSyntaxExtension } from './hide';
import {
  blockQuoteExtension,
  emojiExtension,
  emojiMarkdownSyntaxExtension,
  bulletListExtension,
  horizonalRuleExtension,
  imageExtension,
  taskExtension,
} from './fold';
import { clickLinkExtension } from './clickLink';
import {
  codeBlockDecorationsExtension,
  codeFenceTheme,
} from './codeFenceExtension';
import {
  additionalMarkdownSyntaxTags,
  baseSyntaxHighlights,
  baseTheme,
  lightTheme,
} from './syntaxHighlighting';

export const prosemarkMarkdownSyntaxExtensions = [
  additionalMarkdownSyntaxTags,
  escapeMarkdownSyntaxExtension,
  emojiMarkdownSyntaxExtension,
];

export const defaultFoldableSyntaxExtensions = [
  blockQuoteExtension,
  bulletListExtension,
  taskExtension,
  imageExtension,
  emojiExtension,
  horizonalRuleExtension,
];

export const prosemarkBasicSetup = (): Extension => [
  // Basic CodeMirror Setup
  history(),
  dropCursor(),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
    ...foldKeymap,
    ...completionKeymap,
    ...lintKeymap,
    indentWithTab,
  ]),
  foldGutter(),
  EditorView.lineWrapping,

  // ProseMark Setup
  defaultHideExtensions,
  defaultFoldableSyntaxExtensions,
  clickLinkExtension,
  codeBlockDecorationsExtension,
];

export const prosemarkBaseThemeSetup = (): Extension => [
  baseSyntaxHighlights,
  baseTheme,
  codeFenceTheme,
];

export const prosemarkLightThemeSetup = (): Extension => lightTheme;

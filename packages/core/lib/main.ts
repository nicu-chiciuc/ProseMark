import {
  HighlightStyle,
  syntaxHighlighting,
  type TagStyle,
} from '@codemirror/language';
import { EditorView } from 'codemirror';
import { styleTags, Tag, tags } from '@lezer/highlight';
import {
  defaultHidableSyntaxExtensions,
  escapeMarkdownExtension,
} from './hide';
import { markdownTags } from './markdownTags';
import { emojiMarkdownExtension } from './fold/emoji';
import { defaultFoldableSyntaxExtensions } from './fold';

export {
  foldDecorationExtension,
  foldableSyntaxFacet,
  selectAllDecorationsOnSelectExtension,
} from './fold/core';
export { eventHandlersWithClass, justPluginSpec } from './utils';

const themePlugin = EditorView.theme({
  '.cm-content': {
    fontFamily: 'var(--font)',
    fontSize: '0.9rem',
  },
  '&.cm-focused': {
    outline: 'none',
  },
  '.cm-inline-code': {
    fontFamily: 'monospace',
    padding: '0.2rem',
    backgroundColor: 'grey',
    borderRadius: '0.2rem',
  },
  '.cm-rendered-link': {
    textDecoration: 'underline',
  },
  '.cm-list-mark': {
    color: 'grey',
  },
});

export const hypermdMarkdownExtensions = [
  {
    // Define new nodes with tags here
    defineNodes: [],
    props: [
      // Override tags here
      styleTags({
        HeaderMark: markdownTags.headerMark,
        InlineCode: markdownTags.inlineCode,
        URL: markdownTags.linkURL,
        ListMark: markdownTags.listMark,
      }),
    ],
  },
  escapeMarkdownExtension,
  emojiMarkdownExtension,
];

const headingTagStyles = (fontSizes: (string | null)[]): TagStyle[] =>
  fontSizes.map((fontSize, i) => ({
    tag: tags[`heading${(i + 1).toString()}` as keyof typeof tags] as Tag,
    fontSize,
    fontWeight: 'bold',
    textDecoration: 'none !important',
  }));

const syntaxPlugin = syntaxHighlighting(
  HighlightStyle.define([
    {
      tag: [tags.processingInstruction, tags.labelName],
      class: 'text-slate-400',
    },
    {
      tag: markdownTags.headerMark,
      color: 'lightskyblue',
      textDecoration: 'none !important',
    },
    ...headingTagStyles(['1.6em', '1.4em', '1.2em', null, null, null]),
    {
      tag: tags.strong,
      fontWeight: 'bold',
    },
    {
      tag: tags.emphasis,
      fontStyle: 'italic',
    },
    {
      tag: tags.strikethrough,
      textDecoration: 'line-through',
    },
    {
      tag: markdownTags.linkURL,
      textDecoration: 'underline',
    },
    {
      tag: markdownTags.escapeMark,
      color: 'grey',
    },
    {
      tag: tags.comment,
      color: 'grey',
    },
    {
      tag: markdownTags.listMark,
      class: 'cm-list-mark',
    },
  ]),
);

export const hypermdExtensions = [
  themePlugin,
  syntaxPlugin,
  defaultHidableSyntaxExtensions,
  defaultFoldableSyntaxExtensions,
];

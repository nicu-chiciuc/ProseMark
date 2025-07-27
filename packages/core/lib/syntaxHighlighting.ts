import { EditorView } from '@codemirror/view';
import { styleTags, Tag, tags } from '@lezer/highlight';
import { markdownTags } from './markdownTags';
import {
  HighlightStyle,
  syntaxHighlighting,
  type TagStyle,
} from '@codemirror/language';

export const additionalMarkdownSyntaxTags = {
  // Define new nodes with tags here
  defineNodes: [],
  props: [
    // Override tags here
    styleTags({
      HeaderMark: markdownTags.headerMark,
      FencedCode: markdownTags.fencedCode,
      InlineCode: markdownTags.inlineCode,
      URL: markdownTags.linkURL,
      ListMark: markdownTags.listMark,
    }),
  ],
};

const headingTagStyles = (fontSizes: (string | null)[]): TagStyle[] =>
  fontSizes.map((fontSize, i) => ({
    tag: tags[`heading${(i + 1).toString()}` as keyof typeof tags] as Tag,
    fontSize,
    fontWeight: 'bold',
    textDecoration: 'none !important',
  }));

export const baseSyntaxHighlights = syntaxHighlighting(
  HighlightStyle.define([
    ...headingTagStyles(['1.6em', '1.4em', '1.2em', null, null, null]),
    {
      tag: markdownTags.headerMark,
      color: 'var(--pm-header-mark-color)',
    },
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
      tag: tags.comment,
      color: 'var(--pm-muted-color)',
    },
    {
      tag: markdownTags.listMark,
      color: 'var(--pm-muted-color)',
    },
    {
      tag: markdownTags.escapeMark,
      color: 'var(--pm-muted-color)',
    },
    {
      tag: markdownTags.inlineCode,
      fontFamily: 'monospace',
      padding: '0.2rem',
      borderRadius: '0.4rem',
      fontSize: '0.8rem',
      backgroundColor: 'var(--pm-code-background-color)',
    },
  ]),
);

export const baseTheme = EditorView.theme({
  '.cm-content': {
    fontFamily: 'var(--font)',
    fontSize: '0.9rem',
  },
  '&.cm-focused': {
    outline: 'none',
  },
  '.cm-gutters': {
    backgroundColor: 'transparent',
    border: 'none',
  },
  '.cm-rendered-link': {
    textDecoration: 'underline',
    cursor: 'pointer',
    color: 'var(--pm-link-color)',
  },
  '.cm-rendered-list-mark': {
    color: 'var(--pm-muted-color)',
    margin: '0 0.2em',
  },
  '.cm-blockquote-vertical-line': {
    display: 'inline-block',
    width: '4px',
    marginRight: '4px',
    marginLeft: '4px',
    height: '1.4em',
    verticalAlign: 'bottom',
    backgroundColor: 'var(--pm-blockquote-vertical-line-background-color)',
  },
});

export const lightTheme = EditorView.theme({
  '.cm-content': {
    '--pm-header-mark-color': 'oklch(82.8% 0.111 230.318)',
    '--pm-link-color': 'oklch(58.8% 0.158 241.966)',
    '--pm-muted-color': 'oklch(37.2% 0.044 257.287)',
    '--pm-code-background-color': 'oklch(92.9% 0.013 255.508)',
    '--pm-code-btn-background-color': 'oklch(86.9% 0.022 252.894)',
    '--pm-code-btn-hover-background-color': 'oklch(70.4% 0.04 256.788)',
    '--pm-blockquote-vertical-line-background-color':
      'oklch(70.4% 0.04 256.788)',
  },
});

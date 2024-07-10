import {
  HighlightStyle,
  syntaxHighlighting,
  syntaxTree,
} from '@codemirror/language';
import {
  Decoration,
  DecorationSet,
  ViewPlugin,
  ViewUpdate,
} from '@codemirror/view';
import { EditorState, Range, RangeSet, RangeValue } from '@codemirror/state';
import { EditorView } from 'codemirror';
import { Tag, styleTags, tags } from '@lezer/highlight';
import { defaultHideSyntaxPlugin, escapeExtension } from './hide';
import { markdownTags } from './markdownTags';

export interface RangeLike {
  from: number;
  to: number;
}

export function rangeTouchesRange<T extends RangeLike, V extends RangeLike>(
  a: T,
  b: V,
) {
  return a.from <= b.to && b.from <= a.to;
}

function rangeSetIncludes<V extends RangeValue>(
  from: number,
  to: number,
  set: RangeSet<V>,
) {
  let touches = false;
  set.between(from, to, () => {
    touches = true;
    return false;
  });
  return touches;
}

function traverseTree(view: EditorView) {
  let widgets: Range<Decoration>[] = [];
  for (let { from, to } of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from,
      to,
      enter: (node) => {
        if (
          view.state.selection.ranges.some((range) =>
            rangeTouchesRange(node, range),
          )
        ) {
          console.log(node.name);
        }

        if (node.name === 'InlineCode') {
          widgets.push(
            Decoration.mark({ class: 'cm-inline-code' }).range(
              node.from,
              node.to,
            ),
          );
        } else if (node.name.startsWith('ATXHeading')) {
          if (
            view.state.selection.ranges.some((range) =>
              rangeTouchesRange(node, range),
            )
          ) {
            return;
          }

          let headerMark = node.node.firstChild?.cursor()!;
          console.assert(headerMark.name === 'HeaderMark');
          widgets.push(
            Decoration.mark({ class: 'cm-hidden-token' }).range(
              headerMark.from,
              Math.min(headerMark.to + 1, node.to),
            ),
          );
        }
      },
    });
  }
  return Decoration.set(widgets);
}

const traverseTreePlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = traverseTree(view);
    }

    update(update: ViewUpdate) {
      if (
        update.selectionSet ||
        update.docChanged ||
        update.viewportChanged ||
        syntaxTree(update.startState) != syntaxTree(update.state)
      )
        this.decorations = traverseTree(update.view);
    }
  },
  {
    decorations: (v) => v.decorations,

    eventHandlers: {
      mousedown: (e, view) => {
        let target = e.target as HTMLElement;
        // TODO: finish click handler
      },
    },
    // provide: (p) => [
    //   EditorState.changeFilter.of((tr) => {
    //     console.log(tr.selection);
    //     return true;
    //   }),
    // ],
  },
);

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
});

export const markdownExtensions = [
  {
    // Define new nodes with tags here
    defineNodes: [],
    props: [
      // Override tags here
      styleTags({
        HeaderMark: markdownTags.headerMark,
        InlineCode: markdownTags.inlineCode,
        URL: markdownTags.linkURL,
      }),
    ],
  },
  escapeExtension,
];

const syntaxPlugin = syntaxHighlighting(
  HighlightStyle.define([
    {
      tag: [tags.processingInstruction, tags.labelName],
      class: 'text-slate-400',
    },
    {
      tag: markdownTags.headerMark,
      color: 'lightskyblue',
    },
    {
      tag: tags.heading1,
      fontSize: '1.6em',
      fontWeight: 'bold',
    },
    {
      tag: tags.heading2,
      fontSize: '1.4em',
      fontWeight: 'bold',
    },
    {
      tag: tags.heading3,
      fontSize: '1.2em',
      fontWeight: 'bold',
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
      tag: markdownTags.linkURL,
      textDecoration: 'underline',
    },
    {
      tag: markdownTags.escapeMark,
      color: 'grey',
    },
  ]),
);

export const hypermdPlugin = [
  themePlugin,
  syntaxPlugin,
  defaultHideSyntaxPlugin,
];

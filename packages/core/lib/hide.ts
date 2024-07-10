import { Decoration, DecorationSet, EditorView } from '@codemirror/view';
import { EditorState, Facet, Range, StateField } from '@codemirror/state';
import { syntaxTree } from '@codemirror/language';
import { SyntaxNodeRef } from '@lezer/common';
import { RangeLike, rangeTouchesRange } from './main';
import { MarkdownConfig } from '@lezer/markdown';
import { markdownTags } from './markdownTags';
import { stateWORDAt } from './utils';

const hideTheme = EditorView.theme({
  '.cm-hidden-token': {
    fontSize: '0px',
  },
});

export const hideInlineDecoration = Decoration.mark({
  class: 'cm-hidden-token',
});
export const hideBlockDecoration = Decoration.replace({
  block: true,
});
export const renderedLinkDecoration = Decoration.mark({
  class: 'cm-rendered-link', // not styled by HyperMD, but available for the user
});

const buildDecorations = (state: EditorState) => {
  let decorations: Range<Decoration>[] = [];
  const specs = state.facet(hidableSyntaxFacet);
  syntaxTree(state).iterate({
    enter: (node) => {
      // If the selection overlaps with the node, don't hide it
      if (
        state.selection.ranges.some((range) => rangeTouchesRange(node, range))
      ) {
        return;
      }

      for (const spec of specs) {
        // Check spec
        if (spec.nodeName instanceof Function) {
          if (!spec.nodeName(node.type.name)) {
            continue;
          }
        } else if (spec.nodeName instanceof Array) {
          if (!spec.nodeName.includes(node.type.name)) {
            continue;
          }
        } else if (node.type.name !== spec.nodeName) {
          continue;
        }

        // Check custom show zone
        if (spec.showZone) {
          const res = spec.showZone(state, node);
          if (
            state.selection.ranges.some((range) =>
              rangeTouchesRange(res, range),
            )
          ) {
            return;
          }
        }

        // Hide node using one of the provided methods
        if (spec.onHide) {
          const res = spec.onHide(state, node);
          if (res instanceof Array) {
            decorations.push(...res);
          } else if (res) {
            decorations.push(res);
          }
        }
        if (spec.subNodeNameToHide) {
          let names: string[];
          if (!Array.isArray(spec.subNodeNameToHide)) {
            names = [spec.subNodeNameToHide];
          } else {
            names = spec.subNodeNameToHide;
          }

          let cursor = node.node.cursor();
          cursor.firstChild();
          cursor.iterate((node) => {
            if (names.includes(node.type.name)) {
              decorations.push(
                (spec.block ? hideBlockDecoration : hideInlineDecoration).range(
                  node.from,
                  node.to,
                ),
              );
            }
          });
        }
      }
    },
  });
  return Decoration.set(decorations, true);
};

const hideExtension = StateField.define<DecorationSet>({
  create(state) {
    return buildDecorations(state);
  },

  update(deco, tr) {
    if (tr.docChanged || tr.selection) {
      return buildDecorations(tr.state);
    }
    return deco.map(tr.changes);
  },
  provide: (f) => [EditorView.decorations.from(f), hideTheme],
});

export type HidableSyntaxSpec = {
  nodeName: string | string[] | ((nodeName: string) => boolean);
  subNodeNameToHide?: string | string[];
  onHide?: (
    state: EditorState,
    node: SyntaxNodeRef,
  ) => Range<Decoration> | Range<Decoration>[] | void;
  block?: boolean;
  showZone?: (state: EditorState, node: SyntaxNodeRef) => RangeLike;
};

export const hidableSyntaxFacet = Facet.define<
  HidableSyntaxSpec,
  HidableSyntaxSpec[]
>({
  combine(value: readonly HidableSyntaxSpec[]) {
    return [...value];
  },
  enables: hideExtension,
});

const defaultHideSpecs: HidableSyntaxSpec[] = [
  {
    nodeName: (name) => name.startsWith('ATXHeading'),
    onHide: (_view, node) => {
      const headerMark = node.node.firstChild!;
      return hideInlineDecoration.range(
        headerMark.from,
        Math.min(headerMark.to + 1, node.to),
      );
    },
  },
  {
    nodeName: (name) => name.startsWith('SetextHeading'),
    subNodeNameToHide: 'HeaderMark',
    block: true,
  },
  {
    nodeName: ['StrongEmphasis', 'Emphasis'],
    subNodeNameToHide: 'EmphasisMark',
  },
  {
    nodeName: 'InlineCode',
    subNodeNameToHide: 'CodeMark',
  },
  {
    nodeName: 'Link',
    subNodeNameToHide: ['LinkMark', 'URL'],
    onHide: (_state, node) => {
      return renderedLinkDecoration.range(node.from, node.to);
    },
  },
  {
    nodeName: 'Strikethrough',
    subNodeNameToHide: 'StrikethroughMark',
  },
  {
    nodeName: 'Escape',
    subNodeNameToHide: 'EscapeMark',
    showZone: (state, node) => {
      const WORDAt = stateWORDAt(state, node.from);
      if (WORDAt && WORDAt.to > node.from + 1) return WORDAt;
      return state.doc.lineAt(node.from);
    },
  },
];

export const defaultHideSyntaxPlugin = defaultHideSpecs.map((spec) =>
  hidableSyntaxFacet.of(spec),
);

export const escapeExtension: MarkdownConfig = {
  defineNodes: [
    {
      name: 'EscapeMark',
      style: markdownTags.escapeMark,
    },
  ],
  parseInline: [
    {
      name: 'EscapeMark',
      parse: (cx, next, pos) => {
        if (next !== 92 /* \ */) return -1;
        return cx.addElement(
          cx.elt('Escape', pos, pos + 2, [cx.elt('EscapeMark', pos, pos + 1)]),
        );
      },
      before: 'Escape',
    },
  ],
};

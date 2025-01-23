import {
  type EditorState,
  StateField,
  type Range,
  Facet,
} from '@codemirror/state';
import {
  type DOMEventHandlers,
  Decoration,
  type DecorationSet,
  EditorView,
} from '@codemirror/view';
import { type RangeLike, selectionTouchesRange } from '../utils';
import type { SyntaxNodeRef } from '@lezer/common';
import { syntaxTree } from '@codemirror/language';

const buildDecorations = (state: EditorState) => {
  const decorations: Range<Decoration>[] = [];
  const specs = state.facet(foldableSyntaxFacet);
  syntaxTree(state).iterate({
    enter: (node) => {
      if (selectionTouchesRange(state.selection.ranges, node)) return;

      for (const spec of specs) {
        // Generate Path
        const lineage = [];
        let node_: SyntaxNodeRef | null = node;
        while (node_) {
          lineage.push(node_.name);
          node_ = node_.node.parent;
        }
        const path = lineage.reverse().join('/');

        // Check node path
        if (spec.nodePath instanceof Function) {
          if (!spec.nodePath(path)) {
            continue;
          }
        } else if (spec.nodePath instanceof Array) {
          if (!spec.nodePath.some((testPath) => path.endsWith(testPath))) {
            continue;
          }
        } else if (!path.endsWith(spec.nodePath)) {
          continue;
        }

        // Check custom unfold zone
        if (spec.unfoldZone) {
          if (
            selectionTouchesRange(
              state.selection.ranges,
              spec.unfoldZone(state, node),
            )
          ) {
            return;
          }
        }

        // Run folding logic
        if (spec.onFold) {
          const res = spec.onFold(state, node);
          if (res instanceof Array) {
            decorations.push(...res);
          } else if (res) {
            decorations.push(res);
          }
        }
      }
    },
  });
  return Decoration.set(decorations, true);
};

export const foldDecorationExtension = StateField.define<DecorationSet>({
  create(state) {
    return buildDecorations(state);
  },

  update(deco, tr) {
    if (tr.docChanged || tr.selection) {
      return buildDecorations(tr.state);
    }
    return deco.map(tr.changes);
  },
  provide: (f) => [EditorView.decorations.from(f)],
});

export const foldExtension = [
  foldDecorationExtension,
  // Print clicked on decoration
  // justPluginSpec({
  //   eventHandlers: {
  //     mousedown: (e, view) => {
  //       const target = e.target as HTMLElement;
  //       const pos = view.posAtDOM(target);
  //       view.state
  //         .field(foldDecorationExtension)
  //         .between(pos, pos, (from, to, decoration) => {
  //           console.log(decoration.spec.widget);
  //         });
  //       return false;
  //     },
  //   },
  // }),
];

export interface FoldableSyntaxSpec {
  nodePath: string | string[] | ((nodeName: string) => boolean);
  onFold?: (
    state: EditorState,
    node: SyntaxNodeRef,
  ) => Range<Decoration> | Range<Decoration>[] | undefined;
  unfoldZone?: (state: EditorState, node: SyntaxNodeRef) => RangeLike;
  eventHandlers?: DOMEventHandlers<void>;
}

export const foldableSyntaxFacet = Facet.define<
  FoldableSyntaxSpec,
  FoldableSyntaxSpec[]
>({
  combine(value: readonly FoldableSyntaxSpec[]) {
    return [...value];
  },
  enables: foldExtension,
});

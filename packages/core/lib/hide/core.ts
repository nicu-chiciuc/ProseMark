import { Decoration, DecorationSet, EditorView } from '@codemirror/view';
import { EditorState, Facet, Range, StateField } from '@codemirror/state';
import { syntaxTree } from '@codemirror/language';
import { SyntaxNodeRef } from '@lezer/common';
import { RangeLike, rangeTouchesRange } from '../utils';

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
        if (spec.unhideZone) {
          const res = spec.unhideZone(state, node);
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
          console.assert(cursor.firstChild(), 'A hide node must have children');
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
  unhideZone?: (state: EditorState, node: SyntaxNodeRef) => RangeLike;
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

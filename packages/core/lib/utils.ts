import {
  CharCategory,
  EditorSelection,
  EditorState,
  SelectionRange,
  findClusterBreak,
} from '@codemirror/state';
import {
  DOMEventHandlers,
  DOMEventMap,
  PluginSpec,
  ViewPlugin,
} from '@codemirror/view';
import { TreeCursor } from '@lezer/common';
import { EditorView } from 'codemirror';

/* This is a reference to vim's WORD: a "word" including any non-whitespace character */
export function stateWORDAt(
  state: EditorState,
  pos: number,
): SelectionRange | null {
  let { text, from, length } = state.doc.lineAt(pos);
  let cat = state.charCategorizer(pos);
  let start = pos - from,
    end = pos - from;
  while (start > 0) {
    let prev = findClusterBreak(text, start, false);
    if (cat(text.slice(prev, start)) === CharCategory.Space) break;
    start = prev;
  }
  while (end < length) {
    let next = findClusterBreak(text, end);
    if (cat(text.slice(end, next)) === CharCategory.Space) break;
    end = next;
  }
  return start == end ? null : EditorSelection.range(start + from, end + from);
}

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

export function selectionTouchesRange<V extends RangeLike>(
  selection: readonly SelectionRange[],
  b: V,
) {
  return selection.some((range) => rangeTouchesRange(range, b));
}

// function rangeSetIncludes<V extends RangeValue>(
//   from: number,
//   to: number,
//   set: RangeSet<V>,
// ) {
//   let touches = false;
//   set.between(from, to, () => {
//     touches = true;
//     return false;
//   });
//   return touches;
// }

export function iterChildren(
  cursor: TreeCursor,
  enter: (cursor: TreeCursor) => void | boolean,
) {
  if (!cursor.firstChild()) return;
  do {
    if (enter(cursor)) break;
  } while (cursor.nextSibling());
  console.assert(cursor.parent());
}

export function justPluginSpec(spec: PluginSpec<{}>) {
  return ViewPlugin.define(() => ({}), spec);
}

export type ClassBasedEventHandlers<This> = {
  [event in keyof DOMEventMap]?: {
    [className: string]: DOMEventHandlers<This>[event];
  };
};

export function eventHandlersWithClass<This>(
  handlers: ClassBasedEventHandlers<This>,
): DOMEventHandlers<This> {
  return Object.fromEntries(
    Object.entries(handlers)
      .filter(([_event, handlers]) => !!handlers)
      .map(([event, handlers]) => [
        event,
        function (this: This, ev: any, view: EditorView) {
          let res = [];
          for (const className in handlers) {
            if (
              ev
                .composedPath()
                .some((el: any) =>
                  (el as HTMLElement).classList?.contains(className),
                )
            ) {
              res.push(handlers[className]?.call(this, ev, view));
            }
          }
          return res.some((res) => !!res);
        },
      ]),
  );
}

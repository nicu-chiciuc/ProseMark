import {
  CharCategory,
  EditorSelection,
  EditorState,
  SelectionRange,
  findClusterBreak,
} from '@codemirror/state';

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

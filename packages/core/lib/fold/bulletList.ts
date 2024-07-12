import { Decoration, WidgetType } from '@codemirror/view';
import { foldableSyntaxFacet } from './core';

class BulletPoint extends WidgetType {
  toDOM() {
    let span = document.createElement('span');
    span.className = 'cm-bullet-point cm-list-mark';
    span.innerHTML = '•';
    return span;
  }
}

export const bulletListExtension = foldableSyntaxFacet.of({
  nodePath: 'BulletList/ListItem/ListMark',
  onFold: (_state, node) => {
    let cursor = node.node.cursor();
    if (cursor.nextSibling() && cursor.name === 'Task') return;

    return Decoration.replace({ widget: new BulletPoint() }).range(
      node.from,
      node.to,
    );
  },
});

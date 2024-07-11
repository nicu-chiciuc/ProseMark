import { Decoration, EditorView, WidgetType } from '@codemirror/view';
import { foldableSyntaxFacet } from './core';

class HTMLBlockWidget extends WidgetType {
  constructor(public value: string) {
    super();
  }

  toDOM() {
    let el = document.createElement('div');
    el.className = 'cm-html-block-widget';
    el.innerHTML = this.value;
    return el;
  }
}

const htmlBlockTheme = EditorView.theme({
  '.cm-html-block-widget': {
    padding: '0 2px 0 6px;',
    borderRadius: '0.5rem',
  },
});

export const htmlBlockExtension = [
  foldableSyntaxFacet.of({
    nodePath: 'HTMLBlock',
    onFold: (state, node) => {
      return Decoration.replace({
        widget: new HTMLBlockWidget(state.doc.sliceString(node.from, node.to)),
        block: true,
      }).range(node.from, node.to);
    },
  }),
  htmlBlockTheme,
];

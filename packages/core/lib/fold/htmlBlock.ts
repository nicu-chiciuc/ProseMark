import {
  Decoration,
  EditorView,
  ViewPlugin,
  WidgetType,
} from '@codemirror/view';
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

  // allows clicks to pass through to the editor
  ignoreEvent(_event: Event) {
    return false; // don't preventDefault
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
        inclusive: true,
      }).range(node.from, node.to);
    },
  }),
  htmlBlockTheme,
  // Change selection when appropriate so that the content can be edited
  // (selection by mouse would overshoot the widget content range)
  ViewPlugin.define(() => ({}), {
    eventHandlers: {
      mousedown: (e, view) => {
        const target = e.target as HTMLElement;

        const ranges = view.state.selection.ranges;
        if (ranges.length === 0 || ranges[0].anchor !== ranges[0].head) return;

        for (const el of e.composedPath()) {
          if ((el as HTMLElement).classList?.contains('cm-html-block-widget')) {
            const pos = view.posAtDOM(target);
            view.dispatch({
              selection: {
                anchor: pos,
                head: pos,
              },
            });
            return;
          }
        }
      },
    },
  }),
];

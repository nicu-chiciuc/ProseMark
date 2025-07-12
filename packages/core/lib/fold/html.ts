import { Decoration, EditorView, WidgetType } from '@codemirror/view';
import { foldDecorationExtension, foldableSyntaxFacet } from './core';
import { EditorSelection } from '@codemirror/state';
import { eventHandlersWithClass, justPluginSpec } from '../utils';

class HTMLWidget extends WidgetType {
  constructor(public value: string) {
    super();
  }

  toDOM() {
    const el = document.createElement('div');
    el.className = 'cm-html-widget';
    const parsed = new DOMParser().parseFromString(this.value, 'text/html');

    const walk = (root: Node) => {
      for (const node of [...root.childNodes]) {
        if (node.nodeType === 3) {
          // this node is a text node
          if (/^\s*$/.test(node.nodeValue || '')) {
            node.remove();
            continue;
          }

          node.textContent =
            node.textContent?.replace(/[\t\n\r ]+/g, ' ').trim() ?? null;
        } else {
          walk(node);
        }
      }
    };

    walk(parsed.body);

    el.append(...parsed.body.childNodes);
    return el;
  }

  // allows clicks to pass through to the editor
  ignoreEvent(_event: Event) {
    return false;
    // return event.type !== 'mousedown'; // don't preventDefault for mousedown
  }

  destroy(dom: HTMLElement): void {
    dom.remove();
  }
}

const htmlBlockTheme = EditorView.theme({
  '.cm-html-widget': {
    padding: '0 2px 0 6px;',
    borderRadius: '0.5rem',
  },
});

export const htmlBlockExtension = [
  foldableSyntaxFacet.of({
    nodePath: 'HTMLBlock',
    onFold: (state, node) => {
      return Decoration.replace({
        widget: new HTMLWidget(state.doc.sliceString(node.from, node.to)),
        block: true,
        inclusive: true,
      }).range(node.from, node.to);
    },
  }),
  htmlBlockTheme,
  justPluginSpec({
    eventHandlers: eventHandlersWithClass({
      mousedown: {
        'cm-html-widget': (e, view) => {
          // Change selection when appropriate so that the content can be edited
          // (selection by mouse would overshoot the widget content range)

          const ranges = view.state.selection.ranges;
          // @ts-expect-error If ranges is empty, || will short-circuit.
          if (ranges.length === 0 || ranges[0].anchor !== ranges[0].head)
            return;

          const target = e.target as HTMLElement;
          const pos = view.posAtDOM(target);

          const decorations = view.state.field(foldDecorationExtension);
          decorations.between(pos, pos, (from, to) => {
            setTimeout(() => {
              view.dispatch({
                selection: EditorSelection.single(to, from),
              });
            }, 0);
            return false;
          });
        },
      },
    }),
  }),
];

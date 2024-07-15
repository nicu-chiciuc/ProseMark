import { Decoration, EditorView, WidgetType } from '@codemirror/view';
import { foldableSyntaxFacet } from './core';

class HorizontalRuleWidget extends WidgetType {
  toDOM() {
    let hr = document.createElement('hr');
    hr.className = 'cm-horizontal-rule';
    return hr;
  }

  ignoreEvent(event: Event) {
    return false;
  }
}

const horizontalRuleTheme = EditorView.theme({
  '.cm-horizontal-rule': {
    // marginTop: '0.5rem',
    // marginBottom: '0.5rem',
  },
});

export const horizonalRuleExtension = [
  foldableSyntaxFacet.of({
    nodePath: 'HorizontalRule',
    onFold: (_state, node) => {
      return Decoration.replace({
        widget: new HorizontalRuleWidget(),
        block: true,
        inclusiveStart: true,
      }).range(node.from, node.to);
    },
  }),
  horizontalRuleTheme,
];

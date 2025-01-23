import { Decoration, WidgetType } from '@codemirror/view';
import { foldableSyntaxFacet } from './core';
import { iterChildren } from '../utils';

class ImageWidget extends WidgetType {
  constructor(public url?: string) {
    super();
  }

  toDOM() {
    const span = document.createElement('span');
    span.className = 'cm-image';
    if (this.url) {
      span.innerHTML = `<img src="${this.url}" />`;
    }
    return span;
  }
}

export const imageExtension = foldableSyntaxFacet.of({
  nodePath: 'Image',
  onFold: (state, node) => {
    let imageUrl: string | undefined;
    iterChildren(node.node.cursor(), (node) => {
      if (node.name === 'URL') {
        imageUrl = state.doc.sliceString(node.from, node.to);
      }

      return undefined;
    });

    if (imageUrl) {
      return Decoration.replace({
        widget: new ImageWidget(imageUrl),
      }).range(node.from, node.to);
    }
  },
});

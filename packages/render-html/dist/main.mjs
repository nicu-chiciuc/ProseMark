import { EditorView, Decoration, WidgetType } from "@codemirror/view";
import { foldableSyntaxFacet, justPluginSpec, eventHandlersWithClass, foldDecorationExtension } from "@hypermd/core";
import { EditorSelection } from "@codemirror/state";
import DOMPurify from "dompurify";
class HTMLWidget extends WidgetType {
  constructor(value) {
    super();
    this.value = value;
  }
  toDOM() {
    const el = document.createElement("div");
    el.className = "cm-html-widget";
    const parsed = new DOMParser().parseFromString(
      DOMPurify.sanitize(this.value),
      "text/html"
    );
    const walk = (root) => {
      var _a;
      for (const node of [...root.childNodes]) {
        if (node.nodeType === 3) {
          if (/^\s*$/.test(node.nodeValue || "")) {
            node.remove();
            continue;
          }
          node.textContent = ((_a = node.textContent) == null ? void 0 : _a.replace(/[\t\n\r ]+/g, " ").trim()) ?? null;
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
  ignoreEvent(_event) {
    return false;
  }
  destroy(dom) {
    dom.remove();
  }
}
const htmlBlockTheme = EditorView.theme({
  ".cm-html-widget": {
    padding: "0 2px 0 6px;",
    borderRadius: "0.5rem"
  }
});
const htmlBlockExtension = [
  foldableSyntaxFacet.of({
    nodePath: "HTMLBlock",
    onFold: (state, node) => {
      return Decoration.replace({
        widget: new HTMLWidget(state.doc.sliceString(node.from, node.to)),
        block: true,
        inclusive: true
      }).range(node.from, node.to);
    }
  }),
  htmlBlockTheme,
  justPluginSpec({
    eventHandlers: eventHandlersWithClass({
      mousedown: {
        "cm-html-widget": (e, view) => {
          var _a, _b;
          const ranges = view.state.selection.ranges;
          if (!ranges || ranges.length === 0 || ((_a = ranges[0]) == null ? void 0 : _a.anchor) !== ((_b = ranges[0]) == null ? void 0 : _b.head))
            return;
          const target = e.target;
          const pos = view.posAtDOM(target);
          const decorations = view.state.field(
            foldDecorationExtension
          );
          decorations.between(pos, pos, (from, to) => {
            setTimeout(() => {
              view.dispatch({
                selection: EditorSelection.single(to, from)
              });
            }, 0);
            return false;
          });
        }
      }
    })
  })
];
export {
  htmlBlockExtension
};
//# sourceMappingURL=main.mjs.map

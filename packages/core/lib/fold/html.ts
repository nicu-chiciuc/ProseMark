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
    el.innerHTML = this.value;
    return el;
  }

  // updateDOM(dom: HTMLElement, view: EditorView): boolean {
  //   console.log('updateDOM', dom);
  //   dom.innerHTML = this.value;
  //   return true;
  // }

  // eq(other: HTMLBlockWidget) {
  //   return other.value === this.value;
  // }

  // allows clicks to pass through to the editor
  ignoreEvent(_event: Event) {
    return false;
    // return event.type !== 'mousedown'; // don't preventDefault for mousedown
  }

  destroy(dom: HTMLElement): void {
    dom.remove();
  }
}

// From: https://github.com/lezer-parser/markdown/blob/main/src/markdown.ts

// const EmptyLine = /^[ \t]*$/,
//   CommentEnd = /-->/,
//   ProcessingEnd = /\?>/;

// const HTMLBlockStyle = [
//   [/^<(?:script|pre|style)(?:\s|>|$)/i, /<\/(?:script|pre|style)>/i],
//   [/^\s*<!--/, CommentEnd],
//   [/^\s*<\?/, ProcessingEnd],
//   [/^\s*<![A-Z]/, />/],
//   [/^\s*<!\[CDATA\[/, /\]\]>/],
//   [
//     /^\s*<\/?(?:address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)(?:\s|\/?>|$)/i,
//     EmptyLine,
//   ],
//   [
//     /^\s*(?:<\/[a-z][\w-]*\s*>|<[a-z][\w-]*(\s+[a-z:_][\w-.]*(?:\s*=\s*(?:[^\s"'=<>`]+|'[^']*'|"[^"]*"))?)*\s*>)\s*$/i,
//     EmptyLine,
//   ],
// ];

// function isHTMLBlock(line: Line, _cx: BlockContext, breaking: boolean) {
//   if (line.next != 60 /* '<' */) return -1;
//   let rest = line.text.slice(line.pos);
//   for (let i = 0, e = HTMLBlockStyle.length - (breaking ? 1 : 0); i < e; i++)
//     if (HTMLBlockStyle[i][0].test(rest)) return i;
//   return -1;
// }

// export const htmlBlockMarkdownExtension: MarkdownConfig = {
//   parseBlock: [
//     {
//       name: 'HTMLBlock2',
//       parse: (cx, line) => {
//         let type = isHTMLBlock(line, cx, false);
//         if (type < 0) return false;
//         let from = cx.lineStart + line.pos,
//           end = HTMLBlockStyle[type][1];
//         let marks: Element[] = [],
//           trailing = end != EmptyLine;
//         while (!end.test(line.text) && cx.nextLine()) {
//           // @ts-ignore
//           if (line.depth < cx.stack.length) {
//             trailing = false;
//             break;
//           }
//           // @ts-ignore
//           for (let m of line.markers) marks.push(m);
//         }
//         if (trailing) cx.nextLine();
//         let nodeType =
//           end == CommentEnd
//             ? 'CommentBlock'
//             : end == ProcessingEnd
//             ? 'ProcessingInstructionBlockaddNode'
//             : 'HTMLBlock';
//         let to = cx.prevLineEnd();
//         cx.addElement(cx.elt(nodeType, from, to));
//         return true;
//       },
//       before: 'HTMLBlock',
//     },
//   ],
//   parseInline: [
//     {
//       name: 'HTMLTag2',
//       parse: (cx: InlineContext, next: number, pos: number): number => {
//         if (next != 60 /* '<' */ || pos == cx.end - 1) return -1;
//         let after = cx.slice(pos + 1, cx.end);
//         let url =
//           /^(?:[a-z][-\w+.]+:[^\s>]+|[a-z\d.!#$%&'*+/=?^_`{|}~-]+@[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?)*)>/i.exec(
//             after,
//           );
//         if (url) {
//           return cx.addElement(
//             cx.elt('Autolink', pos, pos + 1 + url[0].length, [
//               cx.elt('LinkMark', pos, pos + 1),
//               // url[0] includes the closing bracket, so exclude it from this slice
//               cx.elt('URL', pos + 1, pos + url[0].length),
//               cx.elt('LinkMark', pos + url[0].length, pos + 1 + url[0].length),
//             ]),
//           );
//         }
//         let comment = /^!--[^>](?:-[^-]|[^-])*?-->/i.exec(after);
//         if (comment)
//           return cx.addElement(
//             cx.elt('Comment', pos, pos + 1 + comment[0].length),
//           );
//         let procInst = /^\?[^]*?\?>/.exec(after);
//         if (procInst)
//           return cx.addElement(
//             cx.elt('ProcessingInstruction', pos, pos + 1 + procInst[0].length),
//           );

//         let m =
//           /^(?:![A-Z][^]*?>|!\[CDATA\[[^]*?\]\]>|\/\s*[a-zA-Z][\w-]*\s*>|\s*[a-zA-Z][\w-]*(\s+[a-zA-Z:_][\w-.:]*(?:\s*=\s*(?:[^\s"'=<>`]+|'[^']*'|"[^"]*"))?)*\s*(\/\s*)?>)/.exec(
//             after,
//           );
//         if (!m) return -1;
//         return cx.addElement(cx.elt('HTMLTag', pos, pos + 1 + m[0].length));
//       },
//       before: 'HTMLTag',
//     },
//   ],
// };

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

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import './style.css';
import { basicSetup } from 'codemirror';
import { EditorView, keymap } from '@codemirror/view';
import { markdown } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { hypermdExtensions, hypermdMarkdownExtensions } from 'hypermd';
import * as HyperMD from 'hypermd';
import { indentWithTab } from '@codemirror/commands';
import { GFM } from '@lezer/markdown';
import {
  defaultHighlightStyle,
  syntaxHighlighting,
  syntaxTree,
} from '@codemirror/language';
import { printTree } from '@lezer-unofficial/printer';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>HyperMD Demo Page</h1>
    <div id="codemirror-container"></div>
  </div>
`;

const editor = new EditorView({
  extensions: [
    basicSetup,
    markdown({
      codeLanguages: languages,
      extensions: [GFM, hypermdMarkdownExtensions],
    }),
    EditorView.lineWrapping,
    hypermdExtensions,
    syntaxHighlighting(defaultHighlightStyle),
    keymap.of([
      indentWithTab,
      {
        key: 'Alt-p',
        run: (view) => {
          console.log(
            printTree(syntaxTree(view.state), view.state.doc.toString()),
          );
          return true;
        },
      },
    ]),
  ],
  doc: '<div>Hello World</div>\n\n',
  parent: document.getElementById('codemirror-container')!,
});

// for easier debugging
Object.assign(window, { editor, HyperMD });

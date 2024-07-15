import './style.css';
import { basicSetup } from 'codemirror';
import { EditorView, keymap } from '@codemirror/view';
import { markdown } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { hypermdPlugin, markdownExtensions } from '../../lib/main';
import * as HyperMD from '../../lib/main';
import { indentWithTab } from '@codemirror/commands';
import { GFM } from '@lezer/markdown';
import { syntaxTree } from '@codemirror/language';
import { printTree } from '@lezer-unofficial/printer';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>HyperMD Demo Page</h1>
    <div id="codemirror-container"></div>
  </div>
`;

let editor = new EditorView({
  extensions: [
    basicSetup,
    markdown({
      codeLanguages: languages,
      extensions: [GFM, markdownExtensions],
    }),
    EditorView.lineWrapping,
    hypermdPlugin,
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

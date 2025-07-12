/* eslint-disable @typescript-eslint/no-non-null-assertion */
import './style.css';
import { basicSetup } from 'codemirror';
import { EditorView, keymap } from '@codemirror/view';
import { markdown } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { hypermdExtensions, hypermdMarkdownExtensions } from '@hypermd/core';
import * as HyperMD from '@hypermd/core';
import { htmlBlockExtension } from '@hypermd/render-html';
import { indentWithTab } from '@codemirror/commands';
import { GFM } from '@lezer/markdown';
import {
  defaultHighlightStyle,
  syntaxHighlighting,
  syntaxTree,
} from '@codemirror/language';
import { printTree } from '@lezer-unofficial/printer';
import initDoc from './initDoc.md?raw';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
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
    htmlBlockExtension,
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
  doc: initDoc,
  parent: document.getElementById('codemirror-container')!,
});

// for easier debugging
Object.assign(window, { editor, HyperMD });

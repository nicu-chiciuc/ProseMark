# ProseMark

A markdown editor like Typora or Obsidian, built on CodeMirror 6.

## Getting started

```bash
git clone https://github.com/jsimonrichard/ProseMark.git
cd ProseMark
bun install
```

## Development

Start the demo with hot reload:

```bash
cd apps/demo
bun run dev-all
```

Build everything:

```bash
bun run build
```

The project has two main packages:

- `packages/core` - main library
- `packages/render-html` - HTML rendering extension

## Usage

```typescript
import { EditorView } from '@codemirror/view';
import { markdown } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import {
  prosemarkBasicSetup,
  prosemarkBaseThemeSetup,
  prosemarkMarkdownSyntaxExtensions,
} from '@prosemark/core';

const editor = new EditorView({
  extensions: [
    markdown({
      codeLanguages: languages,
      extensions: [prosemarkMarkdownSyntaxExtensions],
    }),
    prosemarkBasicSetup(),
    prosemarkBaseThemeSetup(),
    EditorView.lineWrapping,
  ],
  doc: '# Hello ProseMark!',
  parent: document.getElementById('editor'),
});
```

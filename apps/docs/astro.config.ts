import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightTypeDoc, { typeDocSidebarGroup } from 'starlight-typedoc';

// https://astro.build/config
export default defineConfig({
  site: 'https://prosemark.com',
  integrations: [
    starlight({
      title: 'ProseMark Docs',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/withastro/starlight',
        },
      ],
      sidebar: [
        {
          label: 'Guides',
          items: [
            // Each item here is one entry in the navigation menu.
            { label: 'Example Guide', slug: 'guides/example' },
          ],
        },
        {
          label: 'Reference',
          autogenerate: { directory: 'reference' },
        },
        typeDocSidebarGroup,
      ],
      plugins: [
        // Generate the documentation.
        starlightTypeDoc({
          entryPoints: ['../../packages/core/lib/main.ts'],
          tsconfig: '../../packages/core/tsconfig.json',
          typeDoc: {
            githubPages: false,
            // disableGit: true, // needed when running jujutsu locally
            // sourceLinkExternal: true,
            // sourceLinkTemplate:
            //   'https://github.com/jsimonrichard/ProseMark/blob/main/packages/core/lib/{path}#L{line}',
          },
        }),
      ],

      editLink: {
        baseUrl:
          process.env.NODE_ENV === 'development'
            ? `vscode://file/${import.meta.dirname}`
            : 'https://github.com/jsimonrichard/ProseMark/edit/main',
      },
    }),
  ],
});

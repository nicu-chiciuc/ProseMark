import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import starlightTypeDoc, { typeDocSidebarGroup } from 'starlight-typedoc';

// https://astro.build/config
export default defineConfig({
  site: 'https://jsimonrichard.github.io',
  base: 'HyperMD',
  integrations: [
    starlight({
      title: 'HyperMD',
      social: {
        github: 'https://github.com/jsimonrichard/HyperMD',
      },

      plugins: [
        starlightTypeDoc({
          entryPoints: ['../packages/core/lib/main.ts'],
          tsconfig: '../packages/core/tsconfig.json',
          typeDoc: {
            githubPages: true,
          },
        }),
      ],
      sidebar: [
        {
          label: 'Guides',
          items: [
            // Each item here is one entry in the navigation menu.
            {
              label: 'Example Guide',
              slug: 'guides/example',
            },
          ],
        },
        {
          label: 'Reference',
          autogenerate: {
            directory: 'reference',
          },
        },
        typeDocSidebarGroup,
      ],

      editLink: {
        baseUrl:
          process.env.NODE_ENV === 'development'
            ? `vscode://file/${import.meta.dirname}`
            : 'https://github.com/jsimonrichard/HyperMD/edit/main',
      },
      customCss: ['./src/tailwind.css'],

      components: {
        Head: './src/components/starlight/Head.astro',
      },
    }),
    tailwind({ applyBaseStyles: false }),
  ],
});

import { defineConfig } from 'astro/config';
import rehypeMermaid from 'rehype-mermaid';

export default defineConfig({
  site: 'https://moistcode.github.io',
  output: 'static',
  markdown: {
    syntaxHighlight: 'shiki',
    rehypePlugins: [
      [
        rehypeMermaid,
        {
          strategy: 'pre-mermaid',
          mermaidConfig: {
            theme: 'dark',
            themeVariables: {
              darkMode: true,
              background: '#0f172a',
              primaryColor: '#1e293b',
              primaryTextColor: '#e2e8f0',
              primaryBorderColor: '#22d3ee',
              lineColor: '#22d3ee',
              secondaryColor: '#0f172a',
              tertiaryColor: '#1e293b',
              noteBkgColor: '#1e293b',
              noteTextColor: '#94a3b8',
              fontFamily: 'ui-monospace, monospace',
            },
          },
        },
      ],
    ],
  },
});

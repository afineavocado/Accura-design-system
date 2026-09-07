/**
 * sd.build.mjs — Style Dictionary v5 build
 *
 * Sources:  primitives → semantics → components (order matters for reference resolution)
 * Outputs:
 *   output/css/variables.css       — CSS custom properties (:root)
 *   output/css/tailwind-v4.css     — @theme block for Tailwind v4
 *   output/js/tokens.mjs           — ES module with typed token constants
 */

import StyleDictionary from 'style-dictionary';
import { fileHeader, formattedVariables } from 'style-dictionary/utils';

// ─── Custom format: Tailwind v4 @theme block ─────────────────────────────────
StyleDictionary.registerFormat({
  name: 'css/tailwind-v4',
  format: async ({ dictionary, options, file }) => {
    const header = await fileHeader({ file });
    const vars = formattedVariables({
      format: 'css',
      dictionary,
      outputReferences: options.outputReferences ?? false,
      usesDtcg: true,
    });
    return `${header}@theme {\n${vars}}\n`;
  },
});

// ─── Custom format: ES module token constants ─────────────────────────────────
StyleDictionary.registerFormat({
  name: 'javascript/es-module',
  format: async ({ dictionary, file }) => {
    const header = await fileHeader({ file });
    const lines = dictionary.allTokens.map(token => {
      const key = token.name
        .replace(/-([a-z])/g, (_, c) => c.toUpperCase())   // camelCase
        .replace(/^(.)/, c => c.toLowerCase());
      return `export const ${key} = ${JSON.stringify(token.$value ?? token.value)};`;
    });
    return `${header}${lines.join('\n')}\n`;
  },
});

// ─── Config ───────────────────────────────────────────────────────────────────
const sd = new StyleDictionary({
  log: { verbosity: 'default' },
  usesDtcg: true,

  source: [
    'primitives.tokens.json',
    'semantics.tokens.json',
    'components.tokens.json',
  ],

  platforms: {
    // 1. CSS custom properties — resolved final values, works everywhere
    css: {
      transformGroup: 'css',
      buildPath: 'output/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: {
            outputReferences: false,   // fully resolved hex/px values
            selector: ':root',
          },
        },
      ],
    },

    // 2. Tailwind v4 @theme block — same values, different wrapper
    tailwindV4: {
      transformGroup: 'css',
      buildPath: 'output/css/',
      files: [
        {
          destination: 'tailwind-v4.css',
          format: 'css/tailwind-v4',
          options: { outputReferences: false },
        },
      ],
    },

    // 3. ES module constants — for TypeScript / JS consumers
    js: {
      transformGroup: 'js',
      buildPath: 'output/js/',
      files: [
        {
          destination: 'tokens.mjs',
          format: 'javascript/es-module',
        },
      ],
    },
  },
});

await sd.buildAllPlatforms();
console.log('\n✓ Build complete → output/css/ · output/js/');

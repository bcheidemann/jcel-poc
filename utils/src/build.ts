import virtual from '@rollup/plugin-virtual';
import { rollup } from 'rollup';

// TODO: Handle imports from URLs and returns outside of functions

export async function build(src: string, modules: Record<string, string> = {}) {
  const bundle = await rollup({
    input: 'cell.js',
    output: {
      format: 'cjs'
    },
    treeshake: true,
    plugins: [
      virtual({
        // This is intended to allow the user to create utility scripts within a sheet
        // which could be accessed by cell formulas via imports.
        ...modules,
        'cell.js': `${src}`,
      }),
    ],
  });

  const { output } = await bundle.generate({});

  return output[0].code;
}

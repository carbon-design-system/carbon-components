import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { transformAsync } from '@babel/core';
import { minify } from 'terser';
import { settings } from '../src';

const readFile = promisify(fs.readFile);
const { prefix } = settings;

describe('ES build', () => {
  it('should be able to bring in prefix', () => {
    expect(prefix).toBe('bx');
  });

  it('builds es/globals/js/feature-flags.js as ES5 code', async () => {
    const contents = await readFile(
      path.resolve(__dirname, '../es/globals/js/feature-flags.js'),
      'utf8'
    );
    const { code } = await transformAsync(contents, {
      presets: [['@babel/preset-env', { modules: false }]],
      babelrc: false,
    });
    expect(minify(contents).code).toBe(minify(code).code);
  });

  it('builds es/globals/js/settings.js as ES5 code', async () => {
    const contents = await readFile(
      path.resolve(__dirname, '../es/globals/js/settings.js'),
      'utf8'
    );
    const { code } = await transformAsync(contents, {
      presets: [['@babel/preset-env', { modules: false }]],
      babelrc: false,
    });
    expect(minify(contents).code).toBe(minify(code).code);
  });
});

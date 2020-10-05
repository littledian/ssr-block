import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { isDev } from '../utils/env';

export class Render {
  static async renderToString_Dev(
    name: string
  ): Promise<{ html: string; css: string; js: string }> {
    const [nodeJs, nodeCss, web] = await Promise.all([
      axios.get(`http://localhost:7001/build/${name}.js`),
      axios.get(`http://localhost:7001/build/${name}.css`),
      axios.get(`http://localhost:7002/build/${name}.js`)
    ]);
    // eslint-disable-next-line no-new-func
    const fn = new Function('require', 'module', 'exports', nodeJs.data);
    const current = {
      exports: {}
    } as any;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    fn(require, current, current.exports);
    const component = current.exports.default;
    const html = renderToString(createElement(component));
    const css = nodeCss.data;
    const js = web.data;
    return {
      html: `<div id="${name}">${html}</div>`,
      css: `<style>${css}</style>`,
      js: `<script>${js}</script>`
    };
  }

  static renderString_Prod(name: string): { html: string; css: string; js: string } {
    const root = process.cwd();
    const css = fs.readFileSync(path.join(root, `/build/node/${name}.css`));
    const webJs = fs.readFileSync(path.join(root, `build/web/${name}.js`));
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const component = require(path.join(root, `build/node/${name}`)).default;
    const html = renderToString(createElement(component));

    return {
      html: `<div id="${name}">${html}</div>`,
      css: `<style>${css}</style>`,
      js: `<script>${webJs}</script>`
    };
  }

  async renderToString(name: string): Promise<{ html: string; css: string; js: string }> {
    return isDev ? Render.renderToString_Dev(name) : Render.renderString_Prod(name);
  }
}

export default new Render();

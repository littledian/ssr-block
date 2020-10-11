import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { createElement, HTMLAttributes, ScriptHTMLAttributes, StyleHTMLAttributes } from 'react';
import { renderToString } from 'react-dom/server';
import { isDev } from '../utils/env';

export interface BlockItem {
  html: {
    attributes?: HTMLAttributes<any>;
    content: string;
  };
  css: {
    attributes?: StyleHTMLAttributes<any>;
    content: string;
  };
  js: {
    attributes?: ScriptHTMLAttributes<any>;
    content: string;
  };
}

export class Render {
  static async renderToString_Dev(name: string): Promise<BlockItem> {
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
      html: {
        attributes: { id: name },
        content: html
      },
      css: { content: css },
      js: { content: js }
    };
  }

  static renderString_Prod(name: string): BlockItem {
    const root = process.cwd();
    const cssPath = path.join(root, `/build/web/${name}.css`);
    const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';
    const webJs = fs.readFileSync(path.join(root, `build/web/${name}.js`), 'utf8');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const component = require(path.join(root, `build/node/${name}`)).default;
    const html = renderToString(createElement(component));

    return {
      html: {
        attributes: { id: name },
        content: html
      },
      css: { content: css },
      js: { content: webJs }
    };
  }

  async renderToString(name: string): Promise<BlockItem> {
    return isDev ? Render.renderToString_Dev(name) : Render.renderString_Prod(name);
  }
}

export default new Render();

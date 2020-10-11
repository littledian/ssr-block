import { readFileSync } from 'fs';
import { join } from 'path';
import Koa from 'koa';
import * as cp from 'child_process';
import render from './service/render';
import ejs from 'ejs';
import { isDev } from './utils/env';
import { renderHtml, renderScript, renderStyle } from './utils/template';

if (isDev) {
  cp.fork('./scripts/dev-node');
  cp.fork('./scripts/dev-web');
}

const app = new Koa();
const pathReg = /^\/api\/block\/([\w\d]+)$/;
const root = process.cwd();
const allTemplates = ['footer'];

app.use(async (ctx) => {
  const path = ctx.path;
  const match = path.match(pathReg);
  if (!match) {
    const all = await Promise.all(allTemplates.map((name) => render.renderToString(name)));
    const template = readFileSync(join(root, 'index.ejs'), 'utf8');
    ctx.body = ejs.render(template, {
      css: all.map((item) => renderStyle(item.css.content, item.css.attributes)).join(),
      js: all.map((item) => renderScript(item.js.content, item.js.attributes)).join(),
      html: all.map((item) => renderHtml(item.html.content, item.html.attributes)).join()
    });
  } else {
    ctx.body = await render.renderToString(match[1]);
  }
});

app.listen(4000);

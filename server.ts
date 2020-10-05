import { readFileSync } from 'fs';
import { join } from 'path';
import Koa from 'koa';
import * as cp from 'child_process';
import render from './service/render';
import ejs from 'ejs';
import { isDev } from './utils/env';

if (isDev) {
  cp.fork('./scripts/dev-node');
  cp.fork('./scripts/dev-web');
}

const app = new Koa();
const pathReg = /^\/api\/block\/([\w\d]+)$/;
const root = process.cwd();
const allTemplates = ['header'];

app.use(async (ctx) => {
  const path = ctx.path;
  const match = path.match(pathReg);
  if (!match) {
    const all = await Promise.all(allTemplates.map((name) => render.renderToString(name)));
    const template = readFileSync(join(root, 'index.ejs'), 'utf8');
    ctx.body = ejs.render(template, {
      css: all.map((item) => item.css).join(),
      js: all.map((item) => item.js).join(),
      html: all.map((item) => item.html).join()
    });
  } else {
    ctx.body = await render.renderToString(match[1]);
  }
});

app.listen(3000);

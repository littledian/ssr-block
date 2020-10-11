import { HTMLAttributes, ScriptHTMLAttributes, StyleHTMLAttributes } from 'react';

function coverCamelCase(attributes: { [prop: string]: any }): { [prop: string]: any } {
  const o: any = {};
  const keys = Object.keys(attributes);
  keys.forEach((key: keyof typeof attributes) => {
    const newKey = (key as string).replace(/([A-Z])/g, '-$1').toLowerCase();
    o[newKey] = attributes[key];
  });
  return o;
}

function coverToHtmlAttributes(attributes: { [prop: string]: any }): string {
  const o = coverCamelCase(attributes);
  const keys = Object.keys(o);
  return keys.map((key: keyof typeof o) => `${key}=${o[key]}`).join(' ');
}

export function renderStyle(content: string, attributes?: StyleHTMLAttributes<any>) {
  if (!attributes) {
    return `<style>${content}</style>`;
  }
  return `<style ${coverToHtmlAttributes(attributes)}>${content}</style>`;
}

export function renderHtml(content: string, attributes?: HTMLAttributes<any>) {
  if (!attributes) {
    return `<div>${content}</div>`;
  }
  return `<div ${coverToHtmlAttributes(attributes)}>${content}</div>`;
}

export function renderScript(content: string, attributes?: ScriptHTMLAttributes<any>) {
  if (!attributes) {
    return `<script>${content}</script>`;
  }
  return `<script ${coverToHtmlAttributes(attributes)}>${content}</script>`;
}

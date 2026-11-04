import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { unified } from '@astrojs/markdown-remark';
import {readFileSync} from 'node:fs';

const site=process.env.SITE_URL || 'https://justinwangqx.github.io';
const base=process.env.BASE_PATH || '/';
const papers=JSON.parse(readFileSync(new URL('./src/data/paper-collections.json',import.meta.url),'utf8'));
const pdfUrls=papers.flatMap(p=>[p.questions,p.answers].filter(Boolean)).map(asset=>new URL(`${base}${asset.file}`,site).href);

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [mdx(), sitemap({
    filter:page=>!/(?:\/(?:search|practice|past-papers|syllabus)\/?$|\/404(?:\.html|\/)?$|\.json$)/.test(new URL(page).pathname),
    customPages:pdfUrls,
  })],
  markdown: { processor: unified({ remarkPlugins: [remarkMath], rehypePlugins: [[rehypeKatex, { throwOnError: true }]] }) },
  vite: { server: { allowedHosts: true } },
});

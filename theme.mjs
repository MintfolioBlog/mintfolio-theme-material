import { defineTheme } from '@mintfolio/core/theme';
export default defineTheme({
  manifest: {
    id: 'material', name: 'Material', version: '0.4.0', engine: '^1.1.0',
    author: 'Mintfolio contributors', description: '遵循 Material 3 Expressive 的自适应个人博客主题。'
  },
  capabilities: { encryptedPosts: true, search: true, tags: true, categories: true, toc: true },
  pages: {
    home: './src/pages/home.astro', post: './src/pages/post.astro',
    archive: './src/pages/archive.astro', page: './src/pages/page.astro',
    notFound: './src/pages/not-found.astro'
  },
  settings: {
    appearance: { type: 'select', label: '外观', options: ['system', 'light', 'dark'], default: 'system' },
    heroEyebrow: { type: 'string', label: '首页短标语', default: '想法 · 日常 · 新发现' },
    heroTitle: { type: 'string', label: '首页标题', default: '把好奇心，写成日常。' },
    heroDescription: { type: 'string', label: '首页简介', description: '留空使用站点描述。', default: '' },
  }
});
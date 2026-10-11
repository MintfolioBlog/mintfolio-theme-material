import { defineTheme } from '@mintfolio/core/theme';
export default defineTheme({
  manifest: {
    id: 'material', name: 'Material', version: '0.4.1', engine: '^1.3.0',
    author: 'Mintfolio contributors', description: '遵循 Material 3 的自适应个人博客主题：动态配色、官方组件与 Material Symbols。'
  },
  capabilities: { encryptedPosts: true, search: true, tags: true, categories: true, toc: true, darkMode: true },
  pages: {
    home: './src/pages/home.astro', post: './src/pages/post.astro',
    archive: './src/pages/archive.astro', page: './src/pages/page.astro',
    notFound: './src/pages/not-found.astro'
  },
  settings: {
    appearance: { type: 'select', label: '外观', options: ['system', 'light', 'dark'], default: 'system' },
    seedColor: { type: 'color', label: '种子色', description: 'Material 动态配色的源颜色，格式 #RRGGBB；无效值使用 Material 基准色 #6750A4。', default: '#6750A4' },
    colorVariant: {
      type: 'select', label: '配色方案',
      description: 'Material 动态配色变体：tonalSpot 为默认，neutral 更素，vibrant/expressive 更鲜明，fidelity/content 更贴近种子色。',
      options: ['tonalSpot', 'neutral', 'vibrant', 'expressive', 'fidelity', 'content', 'monochrome'], default: 'tonalSpot',
    },
    contrast: { type: 'select', label: '对比度', description: '访客系统要求更高对比度时始终使用 high。', options: ['standard', 'medium', 'high'], default: 'standard' },
    navigation: {
      type: 'array', label: '侧边导航',
      description: '左侧导航轨 / 手机底部导航栏的目的地。留空时使用站点配置中的导航，并自动匹配图标。超过 5 项时，手机上多出的项目放进“更多”。',
      default: [],
      items: {
        type: 'object', label: '导航项', default: {},
        properties: {
          icon: { type: 'string', label: '图标', description: 'Material Symbols 图标名，例如 home、article、person、rocket_launch（完整列表见 https://fonts.google.com/icons ）。留空时按说明文字自动匹配。', default: '' },
          url: { type: 'string', label: '链接地址', description: '站内路径（如 /blog）或完整网址。', default: '' },
          label: { type: 'string', label: '说明文字', default: '' },
        },
      },
    },
    heroEyebrow: { type: 'string', label: '首页短标语', default: '想法 · 日常 · 新发现' },
    heroTitle: { type: 'string', label: '首页标题', description: '留空使用站点描述（博客 slogan）。', default: '' },
    heroDescription: { type: 'string', label: '首页简介', description: '标题使用站点描述时默认不显示；填写了自定义标题时，留空则显示站点描述。', default: '' },
  }
});

/** Theme visuals only. Content, navigation and pagination remain in site.config.ts. */
/** @satisfies {import('@mintfolio/theme-material/settings').MaterialSettings} */
export default {
  appearance: 'system', // system / light / dark
  seedColor: '#6750A4', // Material 动态配色的源颜色
  colorVariant: 'tonalSpot', // tonalSpot / neutral / vibrant / expressive / fidelity / content / monochrome
  contrast: 'standard', // standard / medium / high
  // 侧边导航：留空使用站点导航。icon 为 Material Symbols 图标名（https://fonts.google.com/icons）
  navigation: [
    // { icon: 'home', url: '/', label: '首页' },
    // { icon: 'article', url: '/blog', label: '文章' },
    // { icon: 'person', url: '/about', label: '关于' },
  ],
  heroEyebrow: '想法 · 日常 · 新发现',
  heroTitle: '', // 留空使用站点描述（博客 slogan）
  heroDescription: '',
};

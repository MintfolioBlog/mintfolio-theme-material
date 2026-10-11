/**
 * Material 完整设置模板：启用主题时由 Core 写入 _mintfolio/theme.config.mjs 的 settings。
 * 数组示例保持注释，初始值保留主题默认行为。站点资料写在 site.config.ts。
 */
export default {
  // 外观。
  // 可选：'system' 跟随访客系统 / 'light' 浅色 / 'dark' 深色。默认 'system'。
  appearance: 'system',

  // 种子色：Material 动态配色的源颜色，格式 '#RRGGBB'。默认 '#6750A4'（Material 基准色）。
  // 取值不合法时，Core 配置校验会报错。
  seedColor: '#6750A4',

  // 配色方案（Material 动态配色变体）。默认 'tonalSpot'。
  // 可选：'tonalSpot' 默认 / 'neutral' 更素 / 'vibrant'、'expressive' 更鲜明 /
  //       'fidelity'、'content' 更贴近种子色 / 'monochrome' 单色。
  colorVariant: 'tonalSpot',

  // 对比度。可选：'standard' / 'medium' / 'high'。默认 'standard'。
  // 访客系统要求更高对比度时始终使用 'high'。
  contrast: 'standard',

  // 左侧导航轨 / 手机底部导航栏的目的地。默认 []，即使用 site.config.ts 中的导航并自动匹配图标。
  // 超过 5 项时，手机上多出的项目放进“更多”。下面为已注释的示例；取消注释后才会覆盖站点导航。
  navigation: [
    // {
      // // 图标：Material Symbols 图标名，完整列表见 https://fonts.google.com/icons 。
      // // 留空时按 label 自动匹配。
      // icon: 'home',
      // // 链接地址：站内路径（如 /blog）或完整网址。
      // url: '/',
      // // 说明文字。
      // label: '首页',
    // },
    // {
      // icon: 'article', // 图标名。
      // url: '/blog', // 链接地址。
      // label: '文章', // 说明文字。
    // },
    // {
      // icon: 'person', // 图标名。
      // url: '/about', // 链接地址。
      // label: '关于', // 说明文字。
    // },
    // {
      // icon: 'code', // 图标名。
      // url: 'https://github.com/example', // 链接地址，可以是站外网址。
      // label: 'GitHub', // 说明文字。
    // },
  ],

  // 首页短标语，显示在首页标题上方。默认 '想法 · 日常 · 新发现'；设为 '' 不显示。
  heroEyebrow: '想法 · 日常 · 新发现',

  // 首页标题。默认 ''，即使用站点描述（site.description）。
  heroTitle: '',

  // 首页简介。默认 ''。
  // 标题使用站点描述时默认不显示；填写了自定义 heroTitle 时，留空则显示站点描述。
  heroDescription: '',
};

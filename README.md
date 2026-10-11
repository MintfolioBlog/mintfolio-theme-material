# Material

遵循 Material 3 的自适应博客主题。配色、排版、交互反馈和图标都直接来自 Google 官方库：

- 动态配色：从一个种子色生成全部颜色角色，自动适配深色模式和高对比度；
- 官方 `@material/web` 的涟漪、焦点环和阴影；
- Material Symbols 图标，关于页和页脚的社交链接使用 Simple Icons 品牌图标；
- 手机用底部导航栏，平板和桌面用导航轨。

独立 Astro 主题，包含首页、文章页、归档/分类/标签/系列页、Markdown 独立页面、关于页和 404。
复用 Core 的全文搜索、静态分页、密码文章解锁、SEO、订阅源和站点地图；支持多作者、阅读信息、置顶、系列目录、相关文章和上一篇/下一篇。

## 安装

要求 Node.js >= 22.12、Mintfolio Core 0.3.x 或 0.4.x、Astro 7.3.x。

将 artifacts/mintfolio-theme-material-0.4.0.tgz 复制到你的站点目录，再运行：

~~~sh
npm install ./mintfolio-theme-material-0.4.0.tgz
mintfolio theme use @mintfolio/theme-material
mintfolio dev
~~~

不要把 npm scope 简写为主题目录名。主题依赖的 `@material/web`、图标库和 Roboto 会随主题一起从 npm 安装，不使用 CDN。

## 设置

切换后 Core 会在 theme.config.mjs 的 settings 中写入带注释的设置：

~~~js
settings: {
  appearance: 'system',     // system / light / dark
  seedColor: '#6750A4',     // 种子色：整站配色由它通过 Material 动态配色算法生成
  colorVariant: 'tonalSpot', // tonalSpot / neutral / vibrant / expressive / fidelity / content / monochrome
  contrast: 'standard',     // standard / medium / high；访客系统要求高对比度时自动用 high
  navigation: [            // 侧边导航；留空使用站点导航
    { icon: 'home', url: '/', label: '首页' },
    { icon: 'article', url: '/blog', label: '文章' },
    { icon: 'rocket_launch', url: '/about', label: '关于' },
  ],
  heroEyebrow: '想法 · 日常 · 新发现',
  heroTitle: '',       // 留空使用站点描述（博客 slogan）
  heroDescription: '', // 填写了自定义标题时，留空则在标题下显示站点描述
},
~~~

换一个种子色，除代码高亮外，按钮、导航、卡片、芯片等所有颜色都会一起变化，深色模式也会自动生成对应配色。

网站资料、导航、文章和分页继续在原有站点配置中维护。首页展示精选文章和随后最多六篇文章，"查看全部"进入归档。

## 导航与布局

- 宽度 < 600 CSS px：底部导航栏，最多 5 个目的地，多出的放进"更多"底部弹出面板，面板里还有搜索和 RSS。
- 宽度 ≥ 600 CSS px：左侧导航轨，顶部是搜索 FAB。
- 宽度 ≥ 1200 CSS px：文章目录变为固定侧栏，并高亮当前章节；归档页的搜索和筛选固定在左侧。
- 可以在设置 `navigation` 里自定义每个导航项的图标、链接和说明文字。`icon` 填 Material Symbols 的图标名，就是 [Google Fonts 图标页](https://fonts.google.com/icons) 上显示的名字，如 `rocket_launch`；选中时会自动换成填充样式。图标名写错时用书签图标代替，构建时会给出提示。
- `navigation` 留空时使用站点配置里的导航，图标按名称自动匹配（首页、文章、关于、项目、标签、分类、系列、友链、订阅），并保证有首页和文章两项。
- 社交链接按 `icon` 或 `platform` 匹配 Simple Icons 品牌图标（如 github、x、bilibili、juejin、zhihu、mastodon；twitter 自动对应 x），邮件和 RSS 使用 Material Symbols。Simple Icons 没有收录的品牌（例如 LinkedIn，应其要求已移除）显示通用链接图标。

## 动效与无障碍

- 交互反馈：悬停和按下时显示状态层和涟漪，键盘焦点使用 Material 焦点环，卡片悬停时阴影升一级。
- 页面切换：导航保持不动，只更新右侧内容区，内容区使用 Material 的 fade through 过渡；不支持 View Transitions 的浏览器同样只替换内容，没有过渡动画。
- 系统开启"减少动态效果"时关闭所有动效。
- 支持 forced-colors 和高对比度。交互目标不小于 48 CSS px，并提供打印布局。
- 关闭 JavaScript 时所有页面仍可阅读和跳转；全文搜索和密码解锁需要 JavaScript。

设计依据、规格数值来源和验证记录见 [DESIGN.md](./DESIGN.md)。

## 开发

源码入口：theme.mjs、src/pages、src/layouts、src/components、src/styles、src/lib、src/scripts、src/settings.ts。

~~~sh
npm ci --ignore-scripts
npm run check            # astro check
npm run colors:bundle    # 升级 @material/material-color-utilities 后重新生成 src/vendor 下的打包文件
~~~

打包使用 npm pack --ignore-scripts --pack-destination artifacts，不自动触发检查。开发依赖更新可使用 tools/update-local-deps.mjs（需要 npm_execpath 指向 npm-cli.js）。

主题采用 GPL-3.0-only。依赖库的许可证见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。Material Design 是 Google 的商标，本主题为社区作品，不代表 Google 官方出品或认证。

## 版本记录

- 0.4.0：支持 Core 0.4，配置示例采用 `_mintfolio/theme.config.mjs` 的 `settings`。Core 0.3 用户仍按该版本的配置方式使用。
- 0.3.0：主题包与 manifest 统一为 0.3.0，依赖 Mintfolio Core ^0.3.0。

## 站点 favicon（Core 0.4.1 / Theme API 1.3 起）

把图标放到站点的 `_mintfolio/public/favicon.ico`，在 `_mintfolio/site.config.ts` 的 `site` 中设置：

~~~ts
site: {
  title: '我的博客',
  url: 'https://example.com',
  favicon: '/favicon.ico',
},
~~~

可以使用 ICO、SVG 或 PNG，路径以 `/` 开头，也支持完整 HTTP(S) URL。配置中不要写 `_mintfolio/public` 前缀；空格应进行 URL 编码。省略 favicon 或设为 `''` 时使用主题默认图标。已配置但文件不存在时不会自动探测或回退，应确保该文件会被提交、构建和部署。

部署子目录由 Core 根据 Astro base 自动添加，无需每次更改图标路径。所有页面（包括 404 和其他内置兜底页）使用同一站点图标，切换主题后继续保留。自定义图标会替换整组主题默认图标，不会同时输出两者。浏览器可能缓存旧图标，更新后可改用 `'/favicon.ico?v=2'`。

命令行也支持 `mintfolio config set site site.favicon /favicon.ico`；设为空字符串可恢复默认。此功能需安装包含该能力的 Core 与主题版本；只升级主题而继续使用旧 Core 不会生效。

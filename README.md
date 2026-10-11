# Material

基于 Material 3 Expressive 的自适应博客主题，使用紫色色调、表达性圆角和手机底部导航 / 桌面导航轨。

独立 Astro 主题，包含首页、文章页、归档/分类/标签/系列页、Markdown 独立页面、关于页和 404。
复用 Core 的全文搜索、静态分页、密码文章解锁、SEO、订阅源和站点地图；支持多作者、阅读信息、置顶、系列目录、相关文章和上一篇/下一篇。
不读取宿主私有内容、不依赖其他主题，无远程字体、CDN 或 UI 框架。

## 安装

要求 Node.js >= 22.12、Mintfolio Core 0.3.x、Astro 7.3.x。本次发行版本为 0.3.0。

将 artifacts/mintfolio-theme-material-0.3.1.tgz 复制到你的站点目录，再运行：

~~~sh
npm install ./mintfolio-theme-material-0.3.1.tgz
mintfolio theme use @mintfolio/theme-material
mintfolio dev
~~~

不要把 npm scope 简写为主题目录名。切换后 Core 会在 theme.config.mjs 的 settings 中写入带注释的设置，支持：

~~~js
settings: {
  appearance: 'system', // system / light / dark
  heroEyebrow: '想法 · 日常 · 新发现',
  heroTitle: '把好奇心，写成日常。',
  heroDescription: '', // 空字符串使用站点描述

},
~~~

网站资料、导航、文章和分页继续在原有站点配置中维护。首页展示首篇文章和随后最多六篇文章，“查看全部”进入归档。
手机底部导航固定保留首页、文章和更多；更多菜单完整呈现自定义导航，并提供搜索与 RSS。无需 JavaScript 即可打开菜单、阅读公开文章和使用归档；全文搜索与密码解锁需要 JavaScript。

## 移动端实现

- 使用 viewport-fit=cover、safe-area-inset-* 和可缩放视口，不限制用户缩放。
- 小于 600 CSS px 使用三入口底部导航；其余宽度使用桌面/平板导航。
- 大字号、长中文标题、长 URL 自动换行，布局列使用 minmax(0,1fr)，媒体宽度受容器约束。
- 代码块、表格独立滚动，目录在窄屏移到正文前方。搜索输入框最小 16 CSS px。
- 短横屏窗口取消覆盖正文的固定导航；菜单无需 hover，键盘焦点可见。
- 独立按钮/导航遵循 48 CSS px 的最小触控目标。正文行内链接保持自然排版。
- 尊重系统明暗、减少动态效果和高对比度；提供打印布局。

Web 的 CSS px 不等同于 Android dp 或 Apple pt，此处为网页交互尺寸适配。平台原生字体通过系统字体栈使用，不分发 Apple 字体文件。

## 开发与交付状态

源码入口：theme.mjs、src/pages、src/layouts、src/styles、src/settings.ts。
设计文档、官方来源和 Web 适配边界见 [DESIGN.md](./DESIGN.md)。

已完成源码、安装包和浏览器预览。新增动效及 Glass 折射的检查记录见 DESIGN.md；未运行 UI 单元测试或真机验证。
已检查 Chromium 的窄屏布局、菜单和无障碍偏好；Safari 真机兼容性和实际手机性能仍待确认。

已有 lockfile 和 vendor 本地 Core/SDK 归档，可使用 npm ci --ignore-scripts 安装开发依赖。
需要用户要求检查时执行 npm run check；打包使用 npm pack --ignore-scripts --pack-destination artifacts，不自动触发检查。
开发依赖更新可使用 tools/update-local-deps.mjs（需要 npm_execpath 指向 npm-cli.js）。

主题采用 GPL-3.0-only。Material/Apple 名称用于说明设计参考，不代表官方出品或认证。
## 2026-09-15：动效更新

新增内容首次进入视口时的小距离上移/淡入、菜单展开、按钮按压状态层和轻微形状/缩放反馈。
空间变化使用带轻微回弹的 CSS 曲线，颜色使用单调曲线；这是 Web 适配，不是 Android 原生物理弹簧的逐帧复刻。
动效只作用于内容块和控件，不改变布局尺寸；内容默认可见，关闭 JavaScript 不影响阅读。
减少动态效果时取消活动动画并禁用位移/形变。页面卸载时清理观察器和动画。

参考 Google 官方组件库的 motion slots 与 spatial/effects 区分：
https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md

已做浏览器运行检查：320px 明暗模式无横向溢出，菜单正常，减少动态效果后活动页面动画为零，无页面脚本错误。没有运行 UI 单元测试或真机验证。
## 0.3.0 发行

主题包与 manifest 统一为 0.3.0，依赖 Mintfolio Core ^0.3.0。可使用 npm install @mintfolio/theme-material@0.3.0 安装，随后使用 mintfolio theme use @mintfolio/theme-material 切换。


0.3.1：支持 Core 0.4，配置示例采用 `_mintfolio/theme.config.mjs` 的 `settings`。Core 0.3 用户仍按该版本的配置方式使用。

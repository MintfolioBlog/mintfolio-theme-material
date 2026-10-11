# Material：设计依据与实现映射

更新日期：2026-10-11。以 Material 3 官方规范和 Google 官方 Web 实现为依据。原则是：能用官方库就用官方库，数值取自官方 token 文件，不凭印象手写。

## 用到的官方库

| 用途 | 来源 | 说明 |
| --- | --- | --- |
| 配色 | `@material/material-color-utilities` 0.4（Google） | 构建时用 HCT 动态配色（2025 规范）从种子色生成全部 49 个 `--md-sys-color-*` 颜色角色，浅色、深色、高对比度各一套。不在浏览器运行。 |
| 排版 | `@material/web` 的 `typography/md-typescale-styles.css` | 直接使用官方 `md-typescale-*` 类。 |
| 状态层、涟漪、焦点环、阴影 | `@material/web` 的 `<md-ripple>`、`<md-focus-ring>`、`<md-elevation>` | 挂在原生链接上，悬停 / 按下的状态层、涟漪动画、焦点环动画和阴影层级都是官方实现。 |
| 图标 | `@iconify-json/material-symbols` + `@iconify/utils` | Google 官方 Material Symbols（Rounded，400）的 Iconify 打包版。渲染页面时只内联用到的图标，不下载图标字体，图标数据也不会进入浏览器脚本。选中的导航目的地使用填充样式。 |
| 品牌图标 | `simple-icons` | 社交链接的品牌标志，同样构建时内联，用 currentColor 着色，和 Material 图标保持一致的单色风格。 |
| 字体 | `@fontsource-variable/roboto` | Roboto 可变字体，自托管。中文回退到系统字体。 |

### 配色库的打包说明

`@material/material-color-utilities` 0.4.0 的发布产物里有不带扩展名的相对导入（如 `from './dynamic_color'`），Node 的 ESM 加载器会拒绝加载。Astro 构建时通过 Node 加载依赖，而主题无法修改站点的 Vite 配置，所以不能直接导入。

`tools/bundle-color-utilities.mjs` 用 esbuild 把需要的导出预先打包成 `src/vendor/material-color-utilities.js`，算法本身不改动。升级该开发依赖后运行 `npm run colors:bundle` 重新生成。等上游修复后可以改回直接导入。

### 为什么图标用 Iconify 打包版

侧边导航允许站长填写任意图标名，所以不能只预先导入固定的几个图标文件。Core 的主题边界禁止主题读取文件系统（`node:fs`），因此改用以 JS 数据发布的图标集：`@iconify-json/material-symbols` 的图形来自 Google 的官方仓库，许可证为 Apache-2.0。

## 规格数值的来源

系统 token（`src/styles/tokens.css`）和组件尺寸（`src/styles/components.css`）抄自 `@material/web/tokens/versions/v0_192/` 下的 SCSS token 文件：

- 形状：圆角 none 0 / extra-small 4 / small 8 / medium 12 / large 16 / extra-large 28 / full。
- 动效：easing emphasized (0.2,0,0,1)、emphasized-decelerate (0.05,0.7,0.1,1)、emphasized-accelerate (0.3,0,0.8,0.15)、standard 系列；时长 short1–long4（50–600ms）。
- 状态层不透明度：hover 0.08，focus / pressed 0.12，dragged 0.16。
- 组件：

| 组件 | 规格 |
| --- | --- |
| 导航栏 | 高 80，surface-container，指示器 64×32，secondary-container |
| 导航轨 | 宽 80，surface，指示器 56×32，目的地间距 12 |
| 小型顶部应用栏 | 高 64，surface，滚动后变为 surface-container |
| 按钮 | 高 40，圆角 full，label-large，带图标时 16 / 24 内边距 |
| FAB（primary container） | 56×56，圆角 large；放在导航轨中使用 lowered 层级 |
| 卡片 | 圆角 medium；elevated 为 surface-container-low + 层级 1，filled 为 surface-container-highest，outlined 为 surface + outline-variant |
| 标签芯片 | 高 32，圆角 small；assist 描边为 outline；filter 选中为 secondary-container 加对勾 |
| 搜索栏 | 高 56，圆角 full，surface-container-high |
| 底部弹出面板 | surface-container-low，顶部 extra-large 圆角，拖拽条 32×4 |
| 列表项 | 单行 56，body-large，前置图标 24 |

## 布局：窗口尺寸类别

- compact（< 600）：导航栏，最多 5 个目的地，超出部分放入"更多"打开的模态底部弹出面板；页边距 16。
- medium 及以上（≥ 600）：导航轨，顶部是搜索 FAB；页边距 24。
- expanded（≥ 840）：首页主视觉和卡片网格变为两列。
- large（≥ 1200）：文章目录变为固定侧栏，归档筛选栏固定在左侧。

## 动效

- 页面切换像 App 一样只更新内容区：使用 Astro ClientRouter，导航轨 / 导航栏通过 `transition:persist` 保留，不会重新加载或重绘。切换后脚本从新页面同步选中状态，选中指示器只在目的地真正变化时播放展开动画；顶部应用栏直接切换，不做过渡。
- 内容区切换使用 Material 的 fade through（淡出后淡入）：旧内容 90ms 淡出，新内容 210ms 从 92% 缩放淡入，缩放原点在顶部（`src/lib/motion.ts`）。
- `scrollbar-gutter: stable` 为滚动条预留位置，页面长短不同时布局不会左右跳动。
- 选中的导航指示器从中心横向展开（emphasized-decelerate，500ms）。
- 底部弹出面板从底部滑入（emphasized-decelerate，500ms），遮罩同时淡入。
- 卡片悬停时阴影层级 +1。
- 系统开启"减少动态效果"时，以上动效全部关闭。

## Web 适配说明

- 正文行高从 body-large 的 24/16 提高到 1.85：中文长文需要比拉丁文 UI 更大的行距。
- 当前 `@material/web` 只给 label 字号提供 `-prominent`（强调）变体，标题沿用官方 400 字重。
- 按钮、芯片、卡片、导航项使用原生 `<a>` 加官方 primitives，而不是 `md-filled-button` 这类元素：后者的链接渲染在 Shadow DOM 里，关闭 JS 后无法点击。现在关闭 JS 时所有链接仍然可用，只是没有涟漪动画。
- 文章代码块保留 Core 的 Shiki 高亮配色，只套用 Material 的圆角和间距。
- 访客系统要求更高对比度（`prefers-contrast: more`）时，自动切换到官方算法生成的高对比度方案；forced-colors 下保留可见边框。
- 不读取设备型号，断点为网页 CSS px。

## 验证记录（2026-10-11）

- 在 375 / 768 / 1024 宽度下检查了首页、文章、归档、关于页、友链页、加密文章和 404；测了深色模式；375 宽度下无横向滚动。
- 30 个涟漪和 30 个焦点环全部挂到了目标元素上。
- 站点有 6 个导航项时，"更多"底部弹出面板可以打开，导航图标也正确。
- 归档页搜索能返回结果。
- `npm run check` 0 错误；预览站点生产构建成功（38 页），字体正确打包。
- 主题脚本 gzip 约 10.5KB，CSS gzip 约 8.8KB。
- 未在真机或 Safari 上验证；View Transitions 需要较新的 Chromium / Safari，其他浏览器直接跳转，没有过渡。

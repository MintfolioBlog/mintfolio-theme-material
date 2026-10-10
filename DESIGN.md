# Material：设计依据与实现映射

查阅日期：2026-09-15。以当前官方 Material 3 Expressive 与 Android 移动设计指南为依据；不根据某个 Android 版本号推断设计规范。

## 官方来源

- [Material 3 Expressive](https://m3.material.io/blog/building-with-m3-expressive)：Expressive 设计入口。页面需 JavaScript；设计背景另参考下方可读取的官方资料。
- [Google Design：Material 3 Expressive](https://design.google/library/design-notes-material-3-expressive-liam-spradlin)：Google 对当前设计系统演进的介绍。
- [Android：Layouts and navigation patterns](https://developer.android.com/design/ui/mobile/guides/layout-and-content/layout-and-nav-patterns)：紧凑窗口底部导航、大屏导航轨；主要导航通常容纳三至五个同级目的地。
- [Android：Accessibility defaults](https://developer.android.com/develop/ui/compose/accessibility/api-defaults)：交互目标至少 48 dp 的原生指导。

## 页面决策

- 语义色彩角色：primary/on-primary、primary-container、surface、outline；紫色色调同时提供协调的深色角色。
- 用大标题、不同圆角形状、粉色与绿色辅助表面突出内容层级，主阅读按钮最明显。
- 手机三入口底部导航；更多是菜单入口而非伪造内容目的地，保留任意数量的用户导航。600 CSS px 起切换可滚动导航轨。
- 内容卡片使用实色表面。卡片标题为独立链接，分类链接不嵌入整卡链接，保持合法交互语义。
- 独立交互目标 48 CSS px；正文 16 CSS px 起，不以固定高度裁切正文或标题。
- 按下主按钮的形状变化仅 180ms；系统减少动态效果时关闭。不使用循环装饰动画。

## Web 适配边界

不是 Android 原生组件库，也不声称与系统渲染逐像素一致；没有系统壁纸动态取色能力。字体使用系统已安装的 Roboto 或 sans-serif 回退。
dp 到 CSS px 是本项目的网页尺寸选择，600px 是网页断点，不读取设备型号。
深浅模式通过 CSS 媒体查询响应，也可由主题配置固定。系统高对比度和 forced-colors 保留可见边界与焦点。

## 尚待确认

初版交付时未进行运行验证；后续预览和本次验证结果见文末。建议后续集中预览 320/375/390/430/600/768/1024px、手机横屏、200% 字号、键盘焦点、超长导航、正文表格及密码解锁。
上述清单是待验证范围，不是已通过的测试结果。
## 2026-09-15：动效更新

新增内容首次进入视口时的小距离上移/淡入、菜单展开、按钮按压状态层和轻微形状/缩放反馈。
空间变化使用带轻微回弹的 CSS 曲线，颜色使用单调曲线；这是 Web 适配，不是 Android 原生物理弹簧的逐帧复刻。
动效只作用于内容块和控件，不改变布局尺寸；内容默认可见，关闭 JavaScript 不影响阅读。
减少动态效果时取消活动动画并禁用位移/形变。页面卸载时清理观察器和动画。

参考 Google 官方组件库的 motion slots 与 spatial/effects 区分：
https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md

已做浏览器运行检查：320px 明暗模式无横向溢出，菜单正常，减少动态效果后活动页面动画为零，无页面脚本错误。没有运行 UI 单元测试或真机验证。
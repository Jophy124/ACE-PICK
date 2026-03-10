# ACE PICK - Premium Performance Paddles Website

这是一个为 **ACE PICK** 品牌定制开发的现代化、高交互性的匹克球拍（Pickleball）展示单页。

## 🚀 核心功能
- **动态品牌 Logo**: 基于 PDF.js 实现，直接从原始矢量设计的 PDF 文件中提取并渲染至网页，保持绝对的高清无损。
- **沉浸式交互**: 
  - GSAP 编排的剧场式开屏动画。
  - 3D 转换带动的鼠标视角跟随。
  - 自制 Canvas 粒子物理运动背景。
  - 响应式磨砂玻璃视觉结构。
- **真实产品数据**: 包含了从 `www.acepickpaddles.com` 提取的 Ace Club, Ace Diamond, 和 Love Pickle Ace 旗舰款数据。

## 📂 文件说明
- `index.html`: 网页主骨架。
- `styles.css`: 所有的视觉引擎与样式表。
- `script.js`: 交互逻辑、粒子系统与 PDF 渲染控制器。
- `pdf_base64.js`: 为了绕过本地运行时的跨域限制，将 Logo.pdf 转码成的 Base64 仓库。
- `ACE PICK logo.pdf`: 品牌矢量源文件。

## 🛠️ 后续修改指南
1. **替换产品图**: 目前产品展示位使用的是生成的抽象 3D 球拍模型。如果您有了实拍图，请在 `index.html` 的 `product-card` 部分替换 `abstract-paddle` 标签。
2. **修改文案**: 直接在 HTML 中寻找对应的 `<h3>` 和 `<li>` 标签进行调整。

---
*Created with love by Antigravity AI.*

# BeyondSWE 网页使用与发布指南

这份指南说明如何预览页面、推送到新的 GitHub 仓库，以及如何快速修改模板、样式与配置。

## 1. 本地预览

在项目根目录执行以下命令即可启动静态服务：

```bash
python3 -m http.server 5173
```

浏览器打开：

```
http://localhost:5173/
```

如果端口被占用，可换成其它端口，例如：

```bash
python3 -m http.server 8080
```

对应打开 `http://localhost:8080/`。

## 2. 推送到新创建的 GitHub 仓库

假设你已在 GitHub 上新建仓库 `beyondswe-website`，本地在当前目录执行：

```bash
git init
git add .
git commit -m "init beyondswe website"
git branch -M main
git push -u origin main
```

```bash
git config user.name
git config user.email "awe.ai.chn@gmail.com"

git remote set-url origin git@github.com:AweAI-Team/BeyondSWE-website.git

git remote -v
```

如果你要用 SSH：

```bash
git remote add origin git@github.com:<your-username>/beyondswe-website.git
git push -u origin main
```

重新提交的方法：
```bash

```

## 3. 如何更改网页风格（配色与排版）

页面风格基于 Tailwind CDN 版本，主要在 `index.html` 的 `tailwind.config` 与 `@layer utilities` 中统一管理。建议用关键词搜索快速定位：

- 主题色与字体配置：搜索 `tailwind.config`、`colors`、`fontFamily`
- 通用组件样式（按钮、卡片、占位图、标签）：搜索 `@layer utilities`、`.section-card`、`.image-placeholder`
- Hero 与顶部信息区布局：搜索 `BeyondSWE: Agentic Software Engineering Beyond the Horizon`

常见调整方式：

- 修改 `tailwind.config` 中的 `colors.primary/accent`，实现整体换色。
- 修改 `fontFamily.sans`，统一更换全站字体。
- 在 `@layer utilities` 中调整 `.section-card`、`.image-placeholder` 等样式以适配内容比例。

## 4. 模板快速修改清单

如果你只想尽快把模板替换成你的内容，按以下顺序改即可：

1. 更新标题、作者、单位、按钮链接：搜索 `BeyondSWE: Agentic Software Engineering Beyond the Horizon` 或 `Author One`
2. 替换主图（Main Figure 占位）：搜索 `Main Figure` 或 `在这里放置论文主图`
3. 替换摘要文本：搜索 `Abstract` 或 `BeyondSWE 论文摘要`
4. 替换架构图与评测图：搜索 `Agent Architecture`、`Evaluation Results`
5. 替换 Example Gallery 文本与按钮文案：搜索 `Example Gallery` 或 `Case Study`
6. 替换 Citation BibTeX：搜索 `@article{beyondswe`
7. 修改页脚年份与标语：搜索 `BeyondSWE ©`

## 5. 如何修改各个内容区块

以下是内容所在区块位置：

### 5.1 标题、作者、链接按钮
- 搜索 `BeyondSWE: Agentic Software Engineering Beyond the Horizon` 与 `Author One`
- 替换标题、作者列表、单位信息、Paper/Code/HF 链接。
- 按钮链接在 `<a href="#">` 中修改为你的真实地址。

### 5.2 论文主图（Main Figure）
- 搜索 `Main Figure` 或 `在这里放置论文主图`
- 将占位文字替换为图片标签，例如：

```html
<img src="assets/main-figure.png" alt="BeyondSWE Main Figure" style="width:100%; border-radius:18px;">
```

### 5.3 摘要（Abstract）
- 搜索 `Abstract` 或 `BeyondSWE 论文摘要`
- 把占位文本替换为论文摘要。

### 5.4 架构图（Agent Architecture）
- 搜索 `Agent Architecture` 或 `在这里放置架构图`
- 将占位文字替换为图片标签，例如：

```html
<img src="assets/architecture.png" alt="BeyondSWE Architecture" style="width:100%; border-radius:18px;">
```

### 5.5 评测表现（Evaluation Results）
- 搜索 `Evaluation Results` 或 `在这里放置评测结果图`
- 替换为评测图或表格截图。

### 5.6 Example Gallery
- 搜索 `Example Gallery` 或 `Case Study`
- 每个卡片包含图标、标题、描述、输入/输出标签。
- 如果需要更多案例，复制一个 `.gallery-card` 块并修改内容。

### 5.7 Citation
- 搜索 `Citation` 或 `@article{beyondswe`
- 替换 BibTeX 内容为你的论文条目。

### 5.8 页脚（Footer）
- 搜索 `BeyondSWE ©`
- 修改年份和项目标语。

## 6. 常用配置与扩展方式

### 6.1 配色与字体
- 配色集中在 `tailwind.config` 中的 `colors`，修改后全站按钮、标签、标题将同步变化。
- 字体集中在 `fontFamily.sans`，修改后全站文本同步变化。

### 6.2 数学公式与 LaTeX
- 页面已加载 MathJax，正文里可直接写 `$a^2+b^2=c^2$` 或 `$$E=mc^2$$`。
- 如果你不需要公式，可删除 MathJax 的两段 `<script>`。

### 6.3 增加新模块
- 在 `<main>` 内复制一个现有的 `section` 块即可。
- 需要统一样式时，给新模块加上 `section-card` 类。

## 7. 如果你添加图片或资源文件

建议放到 `assets/` 目录下，然后在 HTML 里用相对路径引用，例如：

```html
<img src="assets/architecture.png" alt="BeyondSWE Architecture">
```

以上修改完成后，刷新浏览器即可看到变化。

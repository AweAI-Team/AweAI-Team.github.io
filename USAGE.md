# Awe-AI Team 网站使用指南

本文档说明如何维护和编辑 Awe-AI 团队网站。

---

## 目录

1. [本地启动项目](#1-本地启动项目)
2. [更换 Logo](#2-更换-logo)
3. [编辑项目/研究内容](#3-编辑项目研究内容)
4. [编辑团队成员信息](#4-编辑团队成员信息)
5. [部署到 GitHub Pages](#5-部署到-github-pages)

---

## 1. 本地启动项目

### 前提条件

- 安装 [Hugo](https://gohugo.io/installation/)（Extended 版本，v0.87+）
- macOS 可直接 `brew install hugo`

### 启动开发服务器

```bash
cd /Users/bytedance/codes/frontier/blowfish_template

# 初始化主题（首次克隆后执行一次）
git submodule update --init --recursive

# 启动开发服务器（支持热重载）
hugo server --minify -D -E -F
```

可直接使用：
```
cd /Users/bytedance/codes/frontier/blowfish_template && hugo server -D 2>&1

```

然后浏览器访问 **http://localhost:1313/** 即可预览。

编辑任何文件后页面会**自动刷新**。

### 构建静态文件

```bash
hugo --minify
```

生成的文件在 `public/` 目录下。

---

## 2. 更换 Logo

Logo 用于首页头像和文章页作者头像。

### 文件位置

```
assets/img/awe-ai-logo.svg   ← 替换这个文件
```

### 步骤

1. 准备你的 Logo 文件（支持 `.svg`、`.png`、`.jpg`，推荐 SVG 或高清 PNG）
2. 将文件放入 `assets/img/` 目录
3. 如果文件名不同，需要修改配置文件：

```
config/_default/languages.en.toml
```

修改这一行：

```toml
[params.author]
  image = "img/你的logo文件名.png"   # ← 改成你的文件名
```

> **注意**：路径相对于 `assets/` 目录，所以 `"img/logo.png"` 对应 `assets/img/logo.png`。

居中logo调整：
```
{{ if not (or $disableImageOptimization (eq $authorImage.MediaType.SubType "svg")) }}
                {{ $final = $authorImage.Fill (print "288x288 q" ( $.Site.Params.Author.imagequality | default "96" )) }}
                {{ $shortSide := int (math.Min $authorImage.Width $authorImage.Height) }}
                {{ $squareImage = $authorImage.Crop (printf "%dx%d" $shortSide $shortSide ) }}
              {{ end }}
              <img
```
下，改h-36 w-36

---

## 3. 编辑项目/研究内容

### 文件结构

每个项目是 `content/projects/` 下的一个文件夹：

```
content/projects/
├── _index.md                    # 项目列表页的标题和描述
├── swalm-agent/
│   ├── index.md                 # 项目内容（Markdown）
│   └── feature.svg              # 卡片缩略图
├── awe-bench/
│   ├── index.md
│   └── feature.svg
└── my-new-project/              # ← 新建项目示例
    ├── index.md                 # 文章内容
    ├── feature.png              # 卡片缩略图（论文主图）
    ├── architecture.png         # 正文中引用的图片
    └── results-table.png        # 正文中引用的图片
```

项目的图在/Users/bytedance/codes/frontier/blowfish_template/config/_default/params.toml中修改模式：
"background"，"basic"，"big"，"thumbAndBackground"

### 创建新项目

1. 在 `content/projects/` 下新建文件夹，例如 `my-new-paper/`
2. 在文件夹中创建 `index.md`，内容格式如下：

```markdown
---
title: "论文标题：Your Paper Title"
date: 2026-02-10
draft: false
description: "一句话简介，显示在 SEO 和摘要中"
summary: "卡片上显示的摘要文字，建议 2-3 句话概括论文核心贡献。"
tags: ["Agent", "Open-Source"]
categories: ["Research"]
authors: ["Awe-AI Team"]
---

## 概述

这里写正文内容，完全支持标准 Markdown 语法。

## 方法

你可以使用**粗体**、*斜体*、`代码`、[链接](https://example.com) 等。

### 插入图片

把图片文件放在同一个文件夹中，然后这样引用：

![架构图](architecture.png)

![实验结果](results-table.png)

### 插入代码块

```python
import torch
model = AutoModel.from_pretrained("awe-ai/model")
```

### 插入表格

| 模型 | SWE-Bench | HumanEval |
|------|-----------|-----------|
| Ours | 45.2%     | 92.1%     |
| GPT-4| 33.0%     | 87.1%     |

### 插入数学公式

行内公式：$E = mc^2$

独立公式：

$$
L = -\sum_{i=1}^{N} y_i \log(\hat{y}_i)
$$

## 引用

> 这是引用文字，适合放 bibtex 或致谢。
```

3. 添加卡片缩略图：将论文主图命名为 `feature.png`（或 `feature.jpg`）放入同一文件夹

### 编辑已有项目

直接编辑对应文件夹下的 `index.md` 即可，开发服务器会自动刷新。

### Front Matter 字段说明

| 字段 | 说明 | 示例 |
|------|------|------|
| `title` | 文章标题 | `"My Paper Title"` |
| `date` | 发布日期 | `2026-02-10` |
| `draft` | 是否为草稿（true 时正式构建不显示） | `false` |
| `description` | SEO 描述 | `"一句话简介"` |
| `summary` | 卡片上显示的摘要 | `"2-3 句话概括"` |
| `tags` | 标签 | `["Agent", "LLM"]` |
| `categories` | 分类 | `["Research"]` |
| `authors` | 作者 | `["Awe-AI Team"]` |

### 更换卡片缩略图

将新图片命名为以下任一格式放在项目文件夹中：
- `feature.png` / `feature.jpg` / `feature.svg`（推荐）
- `cover.png` / `thumbnail.png`（也可识别）

推荐尺寸：**800×450** 或类似 16:9 比例。

---

## 4. 编辑团队成员信息

### 文件结构

```
content/team/
├── _index.md                    # 团队列表页的标题和描述
├── alice-zhang/
│   ├── index.md                 # 个人介绍
│   └── feature.svg              # 个人卡片图
├── bob-li/
│   ├── index.md
│   └── feature.svg
```

### 添加新成员

1. 在 `content/team/` 下新建文件夹，例如 `zhangsan/`
2. 创建 `index.md`：

```markdown
---
title: "张三"
date: 2026-01-01
draft: false
description: "Research Scientist — NLP"
summary: "专注于自然语言处理和大语言模型的研究科学家。"
tags: ["Research", "NLP"]
weight: 10
---

## 张三

**角色：** Research Scientist — NLP

**研究方向：** 大语言模型、指令微调、RLHF

### 个人简介

这里写个人简介，支持完整的 Markdown 格式。

### 代表性成果

- "Paper Title 1" — NeurIPS 2025
- "Paper Title 2" — ICML 2025

### 联系方式

- Email: zhangsan@example.com
- [Google Scholar](https://scholar.google.com/citations?user=xxx)
- [GitHub](https://github.com/zhangsan)
```

3. 添加个人头像/卡片图：将照片命名为 `feature.jpg`（或 `.png`）放入同一文件夹

> **`weight` 字段**控制在团队列表中的排序，数字越小越靠前。

### 编辑已有成员

直接修改对应文件夹下的 `index.md`。

### 使用真实头像

将个人照片裁剪为 **正方形或 16:9** 比例，命名为 `feature.jpg`，放入成员文件夹中替换现有的 `feature.svg`。

---

## 5. 部署到 GitHub Pages

### 方式一：GitHub Actions 自动部署（推荐）

项目中已有 `.github/workflows/pages.yml`。只需：

1. **在 GitHub 上创建仓库**，例如 `awe-ai/awe-ai.github.io`

2. **设置 `baseURL`**：编辑 `config/_default/hugo.toml`，取消注释并修改：

```toml
baseURL = "https://awe-ai.github.io/"
```

3. **推送代码**：

```bash
cd /Users/bytedance/codes/frontier/blowfish_template
git remote set-url origin git@github.com:AweAI-Team/AweAI-Team.github.io.git
git add .
git commit -m "Initial Awe-AI team website"
git push -u origin main
```

4. **启用 GitHub Pages**：
   - 进入仓库 Settings → Pages
   - Source 选择 **GitHub Actions**
   - 等待 Actions 构建完成后即可访问 `https://awe-ai.github.io/`

### 方式二：手动构建部署

```bash
# 构建
hugo --minify

# 将 public/ 目录的内容推送到 gh-pages 分支
cd public
git init
git add .
git commit -m "Deploy"
git remote add origin git@github.com:awe-ai/awe-ai.github.io.git
git push -f origin main
```

### 使用自定义域名

1. 在 `static/` 目录下创建 `CNAME` 文件，写入域名：

```
awe-ai.example.com
```

2. 修改 `config/_default/hugo.toml`：

```toml
baseURL = "https://awe-ai.example.com/"
```

3. 在域名 DNS 中添加 CNAME 记录指向 `awe-ai.github.io`

---

## 6. 修改Recent
/Users/bytedance/codes/frontier/blowfish_template/config/_default/params.toml

[homepage]
  layout = "background" # background layout like blowfish.page demo
  homepageImage = "img/home-bg.svg"
  showRecent = true
  showRecentItems = 6
  showMoreLink = true
  showMoreLinkDest = "/projects"
  cardView = true
  cardViewScreenWidth = false # contained width for 3-column layout
  layoutBackgroundBlur = true # blur effect on scroll

## 7. 中英文支持修改

## 附录：目录结构总览

```
blowfish_template/
├── assets/
│   ├── css/custom.css            # 自定义样式（动画、卡片效果等）
│   └── img/
│       ├── awe-ai-logo.svg       # ← 网站 Logo
│       ├── home-bg.svg           # 首页背景图
│       └── default-article-bg.svg # 文章详情页通用背景
├── config/_default/
│   ├── hugo.toml                 # 站点基础配置（baseURL 等）
│   ├── params.toml               # 主题参数（布局、功能开关等）
│   ├── languages.en.toml         # 英文配置（站点名、作者信息、Logo 路径）
│   ├── languages.zh-cn.toml      # 中文配置
│   ├── menus.en.toml             # 英文导航菜单
│   ├── menus.zh-cn.toml          # 中文导航菜单
│   └── markup.toml               # Markdown 渲染设置
├── content/
│   ├── _index.md                 # 首页内容
│   ├── projects/                 # ← 项目/研究内容
│   │   ├── _index.md             # 列表页标题
│   │   └── xxx-project/
│   │       ├── index.md          # 项目文章（Markdown）
│   │       └── feature.png       # 卡片缩略图
│   └── team/                     # ← 团队成员
│       ├── _index.md             # 列表页标题
│       └── xxx-person/
│           ├── index.md          # 个人介绍（Markdown）
│           └── feature.jpg       # 个人照片/卡片图
├── layouts/partials/home/
│   └── background.html           # 首页布局覆写（含动态浮动形状）
├── themes/blowfish/              # Blowfish 主题（git submodule，勿直接修改）
└── USAGE.md                      # ← 本文件
```
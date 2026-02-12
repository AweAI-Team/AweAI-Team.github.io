# Awe-AI Team 网站维护手册 (v2.0)

本文档是基于 Awe-AI Team 现有架构定制的详细维护指南，涵盖了从基础配置到内容管理的各个方面。

---

## 目录

1. [项目结构概览](#1-项目结构概览)
2. [本地开发环境](#2-本地开发环境)
3. [核心信息配置](#3-核心信息配置)
4. [内容管理模块](#4-内容管理模块)
    - [首页 (Homepage)](#41-首页-homepage)
    - [研究项目 (Projects)](#42-研究项目-projects)
    - [团队成员 (Team)](#43-团队成员-team)
    - [新闻动态 (News) - 可选](#44-新闻动态-news---可选)
5. [高级自定义](#5-高级自定义)

---

## 1. 项目结构概览

本项目基于 Hugo Blowfish 主题构建，关键目录如下：

```text
/Users/bytedance/codes/frontier/blowfish_template/
├── config/_default/       # 核心配置文件 (站点信息、菜单、参数)
│   ├── hugo.toml          # 基础配置 (URL, 分类定义)
│   ├── languages.en.toml  # 英文站点信息 (标题, 默认作者, 社交链接)
│   ├── menus.en.toml      # 顶部和底部菜单定义
│   └── params.toml        # 主题外观参数 (颜色, 布局)
├── content/               # 网站内容 (Markdown 文件)
│   ├── projects/          # 研究项目/论文
│   ├── team/              # 团队成员介绍
│   └── _index.md          # 首页主标语和介绍
├── assets/                # 静态资源
│   ├── img/               # 图片 (Logo, 默认背景)
│   └── css/               # 自定义样式
└── public/                # (生成后) 最终发布的静态网页
```

---

## 2. 本地开发环境

### 前提条件

- 安装 [Hugo](https://gohugo.io/installation/)（Extended 版本，**v0.154.5+**）
- macOS 可直接 `brew install hugo` (如已安装请运行 `brew upgrade hugo`)

### 启动预览
在终端中运行以下命令，即可在本地 `http://localhost:1313` 实时预览修改效果：

```bash
# 确保在项目根目录下
cd /Users/bytedance/codes/frontier/blowfish_template

# 启动服务 (支持实时刷新)
hugo server -D
```

### 部署上线 (自动化)
本项目已配置 GitHub Actions 自动部署流程 (`.github/workflows/pages.yml`)。

**无需**在本地手动运行 `hugo --minify`。只需将代码推送到 GitHub 仓库的 `main` 分支，CI/CD 系统会自动完成构建和发布。

```bash
# 提交更改并推送到远程仓库
git add .
git commit -m "Update content"
git push origin main
```

#### 项目静态网页部署上线
```bash
# 1. 进入正确的仓库目录
cd /Users/bytedance/codes/frontier/blowfish_template

# 2. 确认状态（您应该看到 static/BeyondSWE/ 为新增内容）
git status

# 3. 添加所有新文件
git add static/BeyondSWE/

# 4. 提交更改（这将创建全新的提交记录，去除旧贡献者）
git commit -m "Add BeyondSWE project page"

# 5. 推送到 GitHub
git push origin main
```

推送成功后：
1. 打开 GitHub 仓库的 **Actions** 标签页查看构建进度。
2. 构建完成后，网站会自动更新至 `https://aweai-team.github.io/`。

---

## 3. 核心信息配置

### 3.1 修改站点标题与版权
编辑 `config/_default/languages.en.toml`：

```toml
title = "Awe-AI"  # 浏览器标签页标题

[params]
  copyright = "© {year} Awe-AI Team. All rights reserved."

[params.author]
  name = "Awe-AI Team"  # 默认显示的作者/组织名称
  image = "img/awe-ai-logo.png"  # 侧边栏/Footer Logo (对应 assets/img/awe-ai-logo.png)
  bio = "We are a team..."  # 组织简介
  links = [  # 社交媒体链接
    { github = "https://github.com/awe-ai" },
    { email = "mailto:awe-ai@example.com" }
  ]
```

### 3.2 修改菜单导航
编辑 `config/_default/menus.en.toml`：

```toml
[[main]]
  name = "Projects"
  pageRef = "projects" # 对应 content/projects
  weight = 10          # 排序权重，越小越靠前

[[main]]
  name = "Team"
  pageRef = "team"
  weight = 20
```
如果要添加新栏目（如 News），需在此处添加对应条目。

---

## 4. 内容管理模块

### 4.1 首页 (Homepage)
编辑 `content/_index.md`。

- **Title**: 首页大标题。
- **Description**: 副标题。
- **正文**: 显示在标题下方的欢迎语。

```markdown
---
title: "Awe-AI"
description: "Pushing the Boundaries of AI Research & Engineering"
---

Welcome to **Awe-AI Team**! ...
```

### 4.2 研究项目 (Projects)
这是网站的核心板块。每个项目或论文应在 `content/projects/` 下拥有一个独立的文件夹。

#### 添加新项目
1. 创建文件夹：`content/projects/my-new-paper/`
2. 添加主文件：`index.md`
3. 添加封面图：`feature.png` (推荐比例 16:9)

`index.md` 模板：

```markdown
---
title: "论文标题: Agents are All You Need"
date: 2026-02-11
draft: false
description: "SEO 描述，用于搜索引擎"
summary: "卡片摘要。这里写 2-3 句话介绍论文的核心贡献，会显示在项目列表页。"
tags: ["Agent", "LLM", "Research"]
authors: ["Awe-AI Team", "Alice Zhang"]
showAuthor: true
---

## Abstract
这里写摘要...

## Methodology
这里写正文...

![架构图](architecture.png)
*(图片直接放在同级目录下引用)*
```

#### 图片规范
- **列表封面**: 文件夹内的 `feature.png` 或 `feature.svg` 会自动作为列表页卡片图。
- **文章配图**: 建议将文章引用的图片都放在该项目的文件夹内，使用 `![Alt](image.png)` 相对路径引用。

### 4.3 团队成员 (Team)
管理 `content/team/` 目录。

#### 添加新成员
1. 创建文件夹：`content/team/zhang-san/`
2. 添加主文件：`index.md`
3. 添加头像：`feature.png` (推荐正方形或圆形裁剪)

`index.md` 模板：

```markdown
---
title: "Alice Zhang"
description: "Team Lead & Senior Scientist"
summary: "这里写简短的一句话介绍，显示在卡片上。"
tags: ["Leadership", "Research"]
weight: 1  # 决定排序，数字越小越靠前
---

## Role
Team Lead & Senior Research Scientist

## Bio
Alice leads the Awe-AI Team...

### Contact
- Email: alice@example.com
```

### 4.4 新闻动态 (News) - 可选
如果您希望添加新闻板块（默认未启用）：

1. 创建目录：`content/news/`
2. 创建索引页 `content/news/_index.md`：
   ```markdown
   ---
   title: "News"
   description: "Latest updates from Awe-AI"
   layout: "list"
   ---
   ```
3. 在 `config/_default/menus.en.toml` 中添加菜单入口：
   ```toml
   [[main]]
     name = "News"
     pageRef = "news"
     weight = 30
   ```
4. 添加新闻文章：在 `content/news/` 下创建 `2026-02-11-release.md`。

---

## 5. 高级自定义

### 开启/关闭功能
编辑 `config/_default/params.toml`：

- **更换配色**: 修改 `colorScheme = "blowfish"` (支持 "neutral", "forest" 等)。
- **首页显示项目数**: 修改 `[homepage]` 下的 `showRecentItems = 6`。
- **隐藏作者**: 设置 `[article]` 下的 `showAuthor = false`。

### 自定义 CSS
如果需要微调样式，请直接编辑 `assets/css/custom.css`。该文件中的样式会覆盖主题默认样式。

```css
/* 示例：调整首页标题大小 */
h1 {
  font-size: 2.5rem;
}
```

---
*Generated for Awe-AI Team by Trae*

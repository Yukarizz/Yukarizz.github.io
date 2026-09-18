# Personal Academic Homepage — Zeyang Zhang 张泽阳

纯静态学术主页（无框架、无外部依赖）。版式参考 [xu-tianyang.github.io](https://xu-tianyang.github.io/)，
内容整合自 Google Scholar、GitHub 与个人 CV。

- **本机路径**：`F:\GitHomePage`
- **线上地址**：https://Yukarizz.github.io/
- **仓库**：https://github.com/Yukarizz/Yukarizz.github.io

## 目录结构

```
F:\GitHomePage\
├── index.html                  # 主页（唯一需要改内容的文件）
├── assets/
│   ├── style.css               # 样式：浅色主题、响应式
│   └── main.js                 # 论文年份筛选 + 一作筛选 + 导航滚动高亮
├── files/
│   └── Zeyang-Zhang-CV.pdf     # 简历，供页面 CV 按钮下载
├── img/
│   ├── photo.jpg               # 头像（由 Mine.jpg 裁切而来）
│   └── Mine.jpg                # 原始证件照，留作重新裁切用
├── deploy.bat                  # Windows 一键提交 + 推送
└── deploy.sh                   # Git Bash / macOS 一键提交 + 推送
```

## 部署 / 更新

日常维护就两条命令的事。

**方式一：双击 / 调用脚本**

```bat
deploy.bat "更新了 2 篇新论文"
```

**方式二：手动**

```bat
cd /d F:\GitHomePage
git add -A
git commit -m "更新说明"
git push origin main
```

推送后 GitHub Pages 约 1–2 分钟生效。

> 首次在新机器上推送需要 GitHub 认证：用户名填 `Yukarizz`，
> 密码填 **Personal Access Token**（不是登录密码）。
> 生成入口：GitHub → Settings → Developer settings → Personal access tokens。

## 本地预览

直接双击 `index.html`，或：

```bat
cd /d F:\GitHomePage
python -m http.server 8000
```

浏览器打开 http://localhost:8000

## 常用修改

| 想改什么 | 改哪里 |
| --- | --- |
| 头像 | 替换 `img/photo.jpg`（正方形，建议 600×600） |
| 论文 | `index.html` → `<ol class="pubs" id="publist">` 里的 `<li class="pub">` |
| 论文年份筛选 / 一作标记 | `li` 上的 `data-year` 与 `data-first="1"`；自己的名字用 `<b>` 包起来 |
| 学者指标（引用数等） | `index.html` 顶部 `<div class="metrics">`，需手动同步 Scholar |
| 新闻动态 | `<section id="news">` 里的 `<ul class="news">` |
| 教育 / 实习经历 | `<section id="education">` / `<section id="experience">` |
| 配色 | `assets/style.css` 顶部 `:root` 的 CSS 变量 |
| 导航条目 | `<nav class="toc">`，同时保证对应 section 的 `id` 存在 |

## 待办

- [ ] `Academic Service` 一节的审稿经历目前是按发表期刊推测填写的，需核实或删除
- [ ] 若要自定义域名，在仓库根目录加 `CNAME` 文件（内容为域名）

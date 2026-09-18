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
│   ├── main.js                 # 论文年份筛选 + 一作筛选 + 导航滚动高亮 + 引用数刷新
│   └── i18n.js                 # 中英文文案字典与切换逻辑
├── .github/workflows/scholar.yml  # 每天自动抓取引用数据
├── scripts/update_scholar.py      # 抓取脚本
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

## 引用数据自动同步

页面顶部的 Citations / h-index / i10-index，以及每篇论文的 `Cited N` 徽章，都是
**自动更新**的，不用手改。

**机制**

```
GitHub Actions 每天 UTC 02:23
  └─ scripts/update_scholar.py 抓数据
       ├─ 1. SerpApi（若配了 SERPAPI_KEY 密钥）
       ├─ 2. Google Scholar 直抓（scholarly）
       ├─ 3. Semantic Scholar 批量接口（按 DOI）
       └─ 4. Crossref（兜底）
  └─ 写入 scholar-data 分支的 data/scholar.json
       └─ 页面 JS 拉取该文件 → 刷新页面上的数字
```

抓不到时**保留旧值不覆盖**，页面则沿用 HTML 里写死的数值，不会显示错误数字。

**日常不用管。** 只有两种情况需要动手：

1. **新增论文** —— 在 `index.html` 的 `<li class="pub">` 上加 `data-doi="10.xxxx/xxx"`。
   脚本会自动从 `index.html` 解析论文列表，不用改脚本。
2. **想让数据严格等于谷歌学术** —— Scholar 直抓偶尔会被拦。此时去
   [SerpApi](https://serpapi.com) 注册（免费额度够用），把 API Key 加到
   仓库 **Settings → Secrets → Actions → New repository secret**，名称 `SERPAPI_KEY`。
   之后脚本会优先用它，拿到的数据与 Scholar 完全一致。

想立刻刷新一次：仓库 **Actions → Sync citation data → Run workflow**。

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
| 导航条目 | `<nav class="toc">`，同时保证对应 section 的 `id` 存在 |
| 头像 | 替换 `img/photo.jpg`（正方形，建议 600×600） |
| 论文 | `index.html` → `<ol class="pubs" id="publist">` 里的 `<li class="pub">` |
| 论文年份筛选 / 一作标记 | `li` 上的 `data-year` 与 `data-first="1"`；自己的名字用 `<b>` 包起来 |
| 学者指标 | 已自动同步；`index.html` 顶部 `<div class="metrics">` 里的数字只是无 JS 时的兜底值 |
| 新闻动态 | `<section id="news">` 里的 `<ul class="news">` |
| 教育 / 实习经历 | `<section id="education">` / `<section id="experience">` |
| 配色 | `assets/style.css` 顶部 `:root` 的 CSS 变量 |
| 添加/修改双语文案 | 同时改 `index.html` 里的元素和 `assets/i18n.js` 的 `I18N.en` / `I18N.zh` 字典 |
| 换默认语言 | `assets/i18n.js` 的 `pickInitial()`，把 `indexOf('zh') === 0 ? 'zh' : 'en'` 改成固定值 |

## 待办

- [ ] `Academic Service` 一节的审稿经历目前是按发表期刊推测填写的，需核实或删除
- [ ] 若要自定义域名，在仓库根目录加 `CNAME` 文件（内容为域名）

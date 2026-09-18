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
├── scripts/scholar-baseline.json  # 人工核实的 Google Scholar 数值（抓不到 Scholar 时为准）
├── files/
│   └── Zeyang-Zhang-CV.pdf     # 简历，供页面 CV 按钮下载
├── img/
│   ├── photo-full.jpg          # 页面用的头像：Mine.jpg 原尺寸等比压缩版（未裁切）
│   └── Mine.jpg                # 原始证件照（1584×2304），留作重新出图用
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

> **第一次使用前**：本仓库最初是通过 GitHub API 上传文件的，提交历史与本机不同源，
> 直接 `deploy.bat` 会被拒绝（non-fast-forward）。先双击一次 **`sync-first.bat`** 完成对齐
> （脚本会先校验两端文件一致再执行），之后就再也不用管它，可以删掉。

> 首次在新机器上推送需要 GitHub 认证：用户名填 `Yukarizz`，
> 密码填 **Personal Access Token**（不是登录密码）。
> 生成入口：GitHub → Settings → Developer settings → Personal access tokens。

## 引用数据自动同步

页面顶部的 Citations / h-index / i10-index，以及每篇论文的 `Cited N` 徽章，都是
**自动更新**的，不用手改。

**机制**

```
GitHub Actions 每周一 UTC 02:23（北京时间周一 10:23）
  └─ scripts/update_scholar.py 抓数据
       ├─ 1. SerpApi  ✅ 已配置 SERPAPI_KEY          ← 真正的 Google Scholar
       ├─ 2. Google Scholar 直抓（scholarly）        ← 真正的 Google Scholar
       ├─ 3. scripts/scholar-baseline.json           ← 人工核实的 Scholar 数值（后备）
       └─ 4. Semantic Scholar / Crossref（兜底，口径与 Scholar 不同）
  └─ 写入 scholar-data 分支的 data/scholar.json
       └─ 页面 JS 拉取该文件 → 刷新页面上的数字
```

抓不到时**保留旧值不覆盖**，页面则沿用 HTML 里写死的数值，不会显示错误数字。

### 关于 SerpApi（当前方案）

Google Scholar 没有官方 API，GitHub Actions 的服务器 IP 直连 `scholar.google.com`
**会被拦截**（本机和 Actions 实测都不行）。目前通过 [SerpApi](https://serpapi.com) 的
Google Scholar Author 接口抓取，**数据源标记 `google-scholar(serpapi)`，
数字与 Scholar 主页完全一致**。

密钥存在仓库 **Settings → Secrets → Actions → `SERPAPI_KEY`**，不会出现在代码里。

**频次为什么是一周一次**：SerpApi 免费额度有限（约 100 次/月），一周一次约消耗 4 次/月，
足够且不超限。想改频次编辑 `.github/workflows/scholar.yml` 的 `cron` 即可。

### 关于 baseline（后备）

`scripts/scholar-baseline.json` 是人工核实的 Scholar 数值，**仅当 SerpApi 失败或额度用尽时**才启用。
配好 SerpApi 后平时不用管；如果发现页面的数字长期不涨、且来源标签没显示 Google Scholar，
说明 SerpApi 可能失效了，这时可以手动更新 baseline 顶上。

**其他需要动手的情况：**

1. **新增论文** —— 在 `index.html` 的 `<li class="pub">` 上加 `data-doi="10.xxxx/xxx"`。
   脚本会自动从 `index.html` 解析论文列表，不用改脚本。论文总数始终按页面实际条目算，
   不会因为某篇还没被引用就漏掉。
2. **立刻刷新一次** —— 仓库 **Actions → Sync citation data → Run workflow**。

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
| 头像 | 替换 `img/photo-full.jpg`。竖版原比例完整显示，**不用裁成正方形**；显示高度在 `assets/style.css` 的 `.hero-photo img`（桌面 186px / 移动端 150px） |
| 论文 | `index.html` → `<ol class="pubs" id="publist">` 里的 `<li class="pub">` |
| 论文年份筛选 / 一作标记 | `li` 上的 `data-year` 与 `data-first="1"`；自己的名字用 `<b>` 包起来 |
| 学者指标 | 已自动同步；`index.html` 顶部 `<div class="metrics">` 里的数字只是无 JS 时的兜底值 |
| 新闻动态 | `<section id="news">` 里的 `<ul class="news">` |
| 教育 / 实习经历 | `<section id="education">` / `<section id="experience">` |
| 配色 | `assets/style.css` 顶部 `:root` 的 CSS 变量 |
| 添加/修改双语文案 | 同时改 `index.html` 里的元素和 `assets/i18n.js` 的 `I18N.en` / `I18N.zh` 字典 |
| 顶部按钮 | `index.html` 的 `<div class="buttons">`；次级样式用 `.btn ghost`（CSS 里保留了注释说明） |
| 换默认语言 | `assets/i18n.js` 的 `pickInitial()`，把 `indexOf('zh') === 0 ? 'zh' : 'en'` 改成固定值 |

## 待办

- [ ] **以后入职高校再加「学院主页」按钮**：在 `index.html` 的 `<div class="buttons">` 里加
      `<a class="btn ghost" href="学校主页 URL" target="_blank" rel="noopener" data-i18n="btn_inst">Institution Page</a>`，
      并在 `assets/i18n.js` 的 `I18N.en` / `I18N.zh` 两处补 `btn_inst` 词条（中文：`学院主页`）。
      CSS 样式已保留，加回来即可用。
- [ ] 若要自定义域名，在仓库根目录加 `CNAME` 文件（内容为域名）

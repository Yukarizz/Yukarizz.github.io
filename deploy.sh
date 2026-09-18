#!/usr/bin/env bash
# 一键提交并推送到 GitHub Pages
# 用法: ./deploy.sh "本次修改说明"
set -e
cd "$(dirname "$0")"

MSG="${1:-Update site $(date '+%Y-%m-%d %H:%M')}"

git add -A
git commit -m "$MSG" || echo "[i] 没有需要提交的改动，继续推送。"
git push origin main

echo
echo "[OK] 已推送 -> https://Yukarizz.github.io/ （约 1-2 分钟生效）"

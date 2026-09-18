@echo off
chcp 65001 >nul
setlocal

REM ============================================================
REM  一次性对齐脚本 —— 只在 git push 报历史分叉时跑一次
REM
REM  背景：本站最初是用 GitHub API 上传文件的，产生的提交历史与本机
REM        git init 的历史不同源，导致 deploy.bat 推送时被拒绝
REM        （non-fast-forward）。本脚本把本机历史对齐到 GitHub，
REM        对齐之后 deploy.bat 就能正常用了，此脚本也就不再需要。
REM
REM  安全性：会先检查两边文件是否完全一致，不一致则拒绝执行。
REM ============================================================

cd /d "%~dp0"

echo.
echo 即将把本机仓库历史对齐到 GitHub 远端。
echo 文件内容若有差异会中止，不会丢改动。
echo.
set /p ANS=确认继续？[y/N] 
if /i not "%ANS%"=="y" goto abort

echo.
echo [1/4] 拉取远端 ...
git fetch origin main
if errorlevel 1 goto fail

echo [2/4] 比对远端與本機文件差异 ...
git diff --stat HEAD FETCH_HEAD
for /f %%i in ('git diff --name-only HEAD FETCH_HEAD ^| find /c /v ""') do set N=%%i
if not "%N%"=="0" (
  echo.
  echo [X] 发现 %N% 个文件不一致，已中止，请先手动处理。
  goto end
)
echo     两边文件完全一致，可以安全对齐。

echo [3/4] 对齐历史 ...
git reset --hard FETCH_HEAD
if errorlevel 1 goto fail

echo [4/4] 绑定上游分支 ...
git branch --set-upstream-to=origin/main main
if errorlevel 1 goto fail

echo.
echo [OK] 已对齐。现在可以正常使用 deploy.bat 了。
echo     本脚本（sync-first.bat）可以删除。
goto end

:fail
echo.
echo [X] 执行失败，请检查网络或 GitHub 认证。

:abort
echo 已取消。

:end
endlocal
pause

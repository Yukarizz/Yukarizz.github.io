@echo off
chcp 65001 >nul
setlocal

REM 一键提交并推送到 GitHub Pages
REM 用法:  deploy.bat "本次修改说明"
REM 无参数时自动使用时间戳作为提交信息

if "%~1"=="" (
  set "MSG=Update site %DATE% %TIME%"
) else (
  set "MSG=%~1"
)

cd /d "%~dp0"

git add -A
if errorlevel 1 goto fail

git commit -m "%MSG%"
if errorlevel 1 (
  echo [i] 没有需要提交的改动，直接推送。
)

git push origin main
if errorlevel 1 goto fail

echo.
echo [OK] 已推送，GitHub Pages 通常 1-2 分钟内生效。
echo     https://Yukarizz.github.io/
goto end

:fail
echo.
echo [X] 推送失败。若提示输入用户名/密码，请先完成一次 GitHub 认证，
echo     或改用 Personal Access Token 作为密码。

:end
endlocal
pause

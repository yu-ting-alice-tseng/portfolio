@echo off
echo ===================================================
echo [監控中] 網頁自動上傳雷達已啟動...請勿關閉此視窗！
echo ===================================================

:loop
git add .
:: 檢查有沒有檔案被修改，有的話才送出
git diff-index --quiet HEAD --
if %errorlevel% neq 0 (
    git commit -m "Auto-update: File changed"
    git push origin main
    echo [%date% %time%] 偵測到網頁更新，已成功同步上傳至 GitHub！
)

:: 每一百秒（100秒）自動在背景檢查一次，你可以自由修改數字
timeout /t 60 > nul
goto loop
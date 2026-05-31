@echo off
:loop
git add .
:: 檢查有沒有檔案被修改，有的話才送出
git diff-index --quiet HEAD --
if %errorlevel% neq 0 (
    git commit -m "Auto-update: File changed"
    git push origin main
    echo [OK] 偵測到網頁更新，已自動同步！
)
:: 每一百秒（100秒）自動檢查一次，你可以自行調整數字
timeout /t 30> nul
goto loop
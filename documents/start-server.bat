@echo off
chcp 65001 >nul
echo ========================================
echo  HTML報告書検証サーバー起動 (Node.js)
echo ========================================
echo.

REM Node.jsがインストールされているか確認
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo エラー: Node.jsがインストールされていません。
    echo Node.js をインストールしてください。
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM カレントディレクトリを設定
cd /d "%~dp0"

echo Node.jsサーバーを起動しています...
echo URL: http://localhost:8000/
echo テンプレート一覧: http://localhost:8000/index.html
echo.
echo サーバーを停止するには Ctrl+C を押してください
echo ========================================
echo.

REM Node.jsサーバーを起動
node server.js

pause

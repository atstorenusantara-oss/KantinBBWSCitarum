@echo off
SETLOCAL
cd /d %~dp0
title GCOFFEE POS Server

echo ==========================================
echo    GCOFFEE POS v2 - Server Starter
echo ==========================================
echo.

:: Check if node_modules exists
if not exist "node_modules\" (
    echo [ERROR] folder node_modules tidak ditemukan.
    echo Menjalankan 'npm install' terlebih dahulu...
    call npm install
)

echo.
echo Menjalankan server dalam mode development...
echo Tekan Ctrl+C untuk menghentikan server.
echo.

:: Run the dev script
call npm run dev

if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Terjadi kesalahan saat menjalankan server.
    pause
)

ENDLOCAL

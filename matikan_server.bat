@echo off
SETLOCAL
title GCOFFEE POS - Matikan Server

echo ==========================================
echo    GCOFFEE POS v2 - Server Stopper
echo ==========================================
echo.

echo Mencari server yang berjalan di port 3000...

:: Mencari PID (Process ID) yang menggunakan port 3000 (LISTENING)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo Menghentikan proses Server (PID: %%a)...
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo Berhasil! Server telah dihentikan.
echo.
echo Jendela ini akan tertutup otomatis...
timeout /t 3 > nul
exit

@echo off
SETLOCAL
cd /d %~dp0

echo ======================================================
echo    G-COFFEE POS - Setup Autorun Startup
echo ======================================================
echo.

set "SCRIPT_NAME=jalankan_pos_otomatis.bat"
set "SHORTCUT_NAME=G-Coffee POS System.lnk"
set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"

echo [1] Menyiapkan shortcut untuk: %~dp0%SCRIPT_NAME%
echo [2] Lokasi Target: %STARTUP_FOLDER%
echo.

:: Menggunakan PowerShell untuk membuat shortcut .lnk dengan benar
powershell -Command "$s=(New-Object -COM WScript.Shell).CreateShortcut('%STARTUP_FOLDER%\%SHORTCUT_NAME%');$s.TargetPath='%~dp0%SCRIPT_NAME%';$s.WorkingDirectory='%~dp0';$s.IconLocation='%~dp0public\assets\favicon.ico';$s.Save()"

if %ERRORLEVEL% equ 0 (
    echo.
    echo ======================================================
    echo [BERHASIL] Autorun telah diaktifkan!
    echo Aplikasi akan otomatis jalan saat komputer dinyalakan.
    echo.
    echo Cek di folder: %STARTUP_FOLDER%
    echo ======================================================
) else (
    echo [GAGAL] Terjadi kesalahan saat mendaftarkan startup.
)

echo.
pause
ENDLOCAL

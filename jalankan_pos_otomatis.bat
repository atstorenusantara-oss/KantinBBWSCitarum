@echo off
SETLOCAL
cd /d %~dp0

echo ======================================================
echo    G-COFFEE POS - Integrated Launcher
echo ======================================================
echo.

:: 1. Jalankan Server di jendela terpisah
echo [1/3] Menjalankan Server Node.js...
start "G-Coffee POS Server" cmd /c "jalankan_server.bat"

:: 2. Loop cek apakah server sudah aktif (Port 3000)
echo [2/3] Menunggu server merespon di http://localhost:3000...
:cek_server
powershell -Command "$ErrorActionPreference = 'SilentlyContinue'; try { $response = Invoke-WebRequest -Uri http://localhost:3000 -UseBasicParsing -TimeoutSec 1; if ($response.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }"
if %ERRORLEVEL% equ 0 (
    echo.
    echo [OK] Server sudah siap!
    goto buka_chrome
)
echo . (menunggu...)
timeout /t 2 /nobreak > nul
goto cek_server

:: 3. Buka Chrome dalam mode Kiosk (Full screen total)
:buka_chrome
echo [3/3] Membuka Google Chrome (Kiosk Mode)...
:: --kiosk: Full screen tanpa tombol close/toolbar
:: --edge-kiosk-type=fullscreen: Tambahan jika menggunakan Edge, tapi kita fokus ke Chrome
start chrome --kiosk http://localhost:3000 --user-data-dir="%TEMP%\gcoffee_kiosk"

echo.
echo ======================================================
echo    SYSTEM READY - Selamat Bekerja!
echo ======================================================
timeout /t 5
ENDLOCAL
exit

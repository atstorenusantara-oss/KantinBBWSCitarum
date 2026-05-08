@echo off
setlocal enabledelayedexpansion

:: --- KONFIGURASI ---
set DB_NAME=gcoffee_pos
set DB_USER=root
set DB_PASS=
set SQL_FILE=DB_data.sql

echo ===================================================
echo   G-COFFEE POS - AUTO DATABASE IMPORT (OFFLINE)
echo ===================================================
echo.

:: 1. Cek apakah MySQL terinstal (path default XAMPP atau MySQL Server)
where mysql >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Perintah 'mysql' tidak ditemukan di PATH.
    echo Pastikan MySQL/XAMPP sudah terinstal dan folder 'bin' ada di System Environment Path.
    echo.
    echo Mencoba mencari di lokasi default XAMPP...
    if exist "C:\xampp\mysql\bin\mysql.exe" (
        set MYSQL_PATH="C:\xampp\mysql\bin\mysql.exe"
        echo [OK] MySQL ditemukan di C:\xampp\mysql\bin\
    ) else (
        echo [FATAL] MySQL tidak ditemukan. Instalasi tidak dapat dilanjutkan.
        pause
        exit /b
    )
) else (
    set MYSQL_PATH=mysql
)

:: 2. Konfirmasi User
echo File SQL: %SQL_FILE%
echo Database: %DB_NAME%
echo.
echo PERINGATAN: Ini akan menghapus data lama di database '%DB_NAME%' (jika ada) 
echo dan menggantinya dengan data dari file %SQL_FILE%.
echo.
set /p CONFIRM="Lanjutkan proses import? (Y/N): "
if /i "%CONFIRM%" neq "Y" (
    echo Proses dibatalkan.
    pause
    exit /b
)

:: 3. Membuat Database jika belum ada
echo.
echo [1/3] Menyiapkan database %DB_NAME%...
%MYSQL_PATH% -u %DB_USER% -p%DB_PASS% -e "CREATE DATABASE IF NOT EXISTS %DB_NAME%;" 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] Gagal membuat database otomatis. Mungkin password salah.
    echo Mencoba dengan prompt password...
    %MYSQL_PATH% -u %DB_USER% -p -e "CREATE DATABASE IF NOT EXISTS %DB_NAME%;"
)

:: 4. Proses Import
echo [2/3] Mengimport data ke database (Harap tunggu)...
%MYSQL_PATH% -u %DB_USER% -p%DB_PASS% %DB_NAME% < "%SQL_FILE%"
if %errorlevel% equ 0 (
    echo [3/3] IMPORT BERHASIL! 
    echo.
    echo ===================================================
    echo   DATA BERHASIL DIPULIHKAN KE DATABASE SISTEM
    echo ===================================================
) else (
    echo.
    echo [ERROR] Terjadi kesalahan saat import.
    echo Pastikan file '%SQL_FILE%' ada di folder yang sama dengan script ini.
    echo.
)

pause

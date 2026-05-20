const { execSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Simpan file lisensi di root folder proyek (atau folder data jika di-package)
const LICENSE_FILE_PATH = path.join(process.cwd(), 'license.json');
const SECRET_DEV_KEY = 'G_COFFEE_SECRET_SALT_2026'; // Gunakan kunci rahasia Anda

class LicenseService {
    getHardwareID() {
        let motherboard = '';
        let disk = '';

        // Coba ambil Serial Number Motherboard
        try {
            motherboard = execSync('wmic baseboard get serialnumber', { stdio: ['pipe', 'pipe', 'ignore'] }).toString();
            motherboard = motherboard.replace('SerialNumber', '').trim();
        } catch (e) {
            try {
                motherboard = execSync('powershell -Command "Get-WmiObject win32_baseboard | Select-Object -ExpandProperty SerialNumber"', { stdio: ['pipe', 'pipe', 'ignore'] }).toString().trim();
            } catch (e2) {
                motherboard = 'UNKNOWN_MB';
            }
        }

        // Coba ambil Serial Number Disk Drive Utama
        try {
            disk = execSync('wmic diskdrive where "index=0" get serialnumber', { stdio: ['pipe', 'pipe', 'ignore'] }).toString();
            disk = disk.replace('SerialNumber', '').trim();
        } catch (e) {
            try {
                disk = execSync('powershell -Command "Get-PhysicalDisk | Select-Object -ExpandProperty SerialNumber"', { stdio: ['pipe', 'pipe', 'ignore'] }).toString().trim();
                if (!disk) {
                    disk = execSync('powershell -Command "Get-WmiObject Win32_PhysicalMedia | Select-Object -ExpandProperty SerialNumber"', { stdio: ['pipe', 'pipe', 'ignore'] }).toString().trim();
                }
            } catch (e2) {
                disk = 'UNKNOWN_DISK';
            }
        }

        // Bersihkan karakter aneh
        motherboard = motherboard.replace(/[\r\n\t]/g, '').trim();
        disk = disk.replace(/[\r\n\t]/g, '').trim();

        // Jika keduanya gagal didapatkan secara fisik, fallback ke data bios/computer name
        if ((!motherboard || motherboard === 'UNKNOWN_MB') && (!disk || disk === 'UNKNOWN_DISK')) {
            try {
                let computerName = process.env.COMPUTERNAME || 'LOCAL_PC';
                let bios = execSync('wmic bios get serialnumber', { stdio: ['pipe', 'pipe', 'ignore'] }).toString().replace('SerialNumber', '').trim();
                bios = bios.replace(/[\r\n\t]/g, '').trim();
                return crypto.createHash('sha256').update(`PC:${computerName}|BIOS:${bios}`).digest('hex');
            } catch (e) {
                return crypto.createHash('sha256').update('FALLBACK_SECURE_KEY_12345').digest('hex');
            }
        }

        const rawId = `MB:${motherboard}|DISK:${disk}`;
        return crypto.createHash('sha256').update(rawId).digest('hex');
    }

    getRequestCode() {
        const hwId = this.getHardwareID();
        // Buat string base64 yang bersih dan ubah ke uppercase untuk memudahkan pembacaan
        const cleanBase64 = Buffer.from(hwId).toString('base64')
            .replace(/[^a-zA-Z0-9]/g, '') // Hanya alfanumerik
            .substring(0, 16)
            .toUpperCase();
        
        // Format agar mudah dibaca seperti: XXXX-XXXX-XXXX-XXXX
        const matched = cleanBase64.match(/.{1,4}/g);
        return matched ? matched.join('-') : cleanBase64;
    }

    generateActivationCode(requestCode) {
        // Hasilkan hash HMAC dari Request Code menggunakan Secret Key
        const hash = crypto.createHmac('sha256', SECRET_DEV_KEY)
            .update(requestCode)
            .digest('hex')
            .replace(/[^a-zA-Z0-9]/g, '')
            .substring(0, 16)
            .toUpperCase();
        
        // Format agar mudah dibaca seperti: YYYY-YYYY-YYYY-YYYY
        const matched = hash.match(/.{1,4}/g);
        return matched ? matched.join('-') : hash;
    }

    verifyLicense() {
        try {
            if (!fs.existsSync(LICENSE_FILE_PATH)) {
                return { isValid: false, reason: 'LICENSE_MISSING' };
            }

            const licenseData = JSON.parse(fs.readFileSync(LICENSE_FILE_PATH, 'utf8'));
            const { requestCode, activationCode } = licenseData;

            // Pastikan Request Code saat ini sama dengan yang tersimpan
            const currentRequestCode = this.getRequestCode();
            if (currentRequestCode !== requestCode) {
                return { isValid: false, reason: 'HARDWARE_MISMATCH' };
            }

            // Hitung ulang activation code berdasarkan request code saat ini
            const expectedActivationCode = this.generateActivationCode(currentRequestCode);
            if (expectedActivationCode !== activationCode) {
                return { isValid: false, reason: 'INVALID_ACTIVATION_CODE' };
            }

            return { isValid: true };
        } catch (error) {
            return { isValid: false, reason: 'VERIFICATION_ERROR' };
        }
    }

    activate(activationCode) {
        const requestCode = this.getRequestCode();
        const expectedActivationCode = this.generateActivationCode(requestCode);

        const cleanInput = activationCode.replace(/[-\s]/g, '').toUpperCase().trim();
        const cleanExpected = expectedActivationCode.replace(/[-\s]/g, '').toUpperCase().trim();

        if (cleanInput === cleanExpected) {
            fs.writeFileSync(
                LICENSE_FILE_PATH,
                JSON.stringify({ requestCode, activationCode: expectedActivationCode }, null, 2)
            );
            return { success: true };
        }
        return { success: false, message: 'Kode Aktivasi salah atau tidak cocok untuk PC ini.' };
    }
}

module.exports = new LicenseService();

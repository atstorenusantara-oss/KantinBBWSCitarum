const fs = require('fs');
const path = require('path');

const filesToBackup = [
    'public/index.html',
    'public/js/script.js',
    'src/services/product.service.js',
    'src/services/report.service.js',
    'update_cashier_pc.sql'
];

const destDir = path.join(__dirname, 'backup_update_bluetooth');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir);
}

filesToBackup.forEach(file => {
    const srcPath = path.join(__dirname, file);
    const destPath = path.join(destDir, file);

    if (fs.existsSync(srcPath)) {
        // Create parent directories if they don't exist
        const parentDir = path.dirname(destPath);
        if (!fs.existsSync(parentDir)) {
            fs.mkdirSync(parentDir, { recursive: true });
        }

        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied: ${file} -> backup_update_bluetooth/${file}`);
    } else {
        console.warn(`File not found: ${file}`);
    }
});

console.log('\nBackup selesai! Silakan salin folder "backup_update_bluetooth" ke PC Kasir Anda.');

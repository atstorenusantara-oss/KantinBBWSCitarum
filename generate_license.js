const crypto = require('crypto');

// JANGAN UBAH KEY INI. Harus persis sama dengan yang ada di src/services/license.service.js
const SECRET_DEV_KEY = 'G_COFFEE_SECRET_SALT_2026';

function generateActivationCode(requestCode) {
    const hash = crypto.createHmac('sha256', SECRET_DEV_KEY)
        .update(requestCode)
        .digest('hex')
        .replace(/[^a-zA-Z0-9]/g, '')
        .substring(0, 16)
        .toUpperCase();

    const matched = hash.match(/.{1,4}/g);
    return matched ? matched.join('-') : hash;
}

// Ambil input dari terminal
const args = process.argv.slice(2);
if (args.length === 0) {
    console.log('\n=========================================');
    console.log('  G-COFFEE POS - Activation Key Generator');
    console.log('=========================================');
    console.log('Penggunaan: node generate_license.js <REQUEST-CODE>');
    console.log('Contoh:     node generate_license.js ABCD-1234-EFGH-5678\n');
    process.exit(1);
}

const reqCode = args[0].trim().toUpperCase();
const activationCode = generateActivationCode(reqCode);

console.log('\n=========================================');
console.log(`Request Code:    ${reqCode}`);
console.log(`Activation Code: ${activationCode}`);
console.log('=========================================');
console.log('Berikan Activation Code di atas kepada klien untuk dimasukkan di layar aktivasi POS.\n');

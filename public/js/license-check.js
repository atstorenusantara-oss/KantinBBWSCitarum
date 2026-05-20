(function() {
    // Fungsi untuk memverifikasi lisensi saat halaman dibuka
    async function checkLicense() {
        try {
            const response = await fetch('/api/license/status');
            const data = await response.json();
            
            if (!data.isValid) {
                showActivationModal(data.requestCode);
            }
        } catch (error) {
            console.error('Gagal mengecek lisensi:', error);
            // Jika backend memblokir atau down
            showActivationModal('ERR-OFFLINE');
        }
    }

    // Intersepsi semua fetch request untuk mendeteksi 403 UNAUTHORIZED_HARDWARE secara real-time
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const response = await originalFetch.apply(this, args);
        if (response.status === 403) {
            const clone = response.clone();
            try {
                const data = await clone.json();
                if (data.error === 'UNAUTHORIZED_HARDWARE') {
                    showActivationModal(data.requestCode);
                }
            } catch (e) {}
        }
        return response;
    };

    function showActivationModal(requestCode) {
        // Cek jika modal sudah ada agar tidak duplikat
        if (document.getElementById('license-activation-overlay')) {
            return;
        }

        // Buat style CSS khusus untuk modal aktivasi (Aesthetically Premium, Outfit Font)
        const style = document.createElement('style');
        style.innerHTML = `
            #license-activation-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(10, 10, 12, 0.98);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Outfit', sans-serif;
                color: #f3f4f6;
            }
            .license-card {
                background: #1a1a24;
                border: 1px solid rgba(228, 168, 83, 0.3);
                border-radius: 16px;
                padding: 40px;
                width: 90%;
                max-width: 500px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
                text-align: center;
                box-sizing: border-box;
            }
            .license-logo {
                font-size: 2.5rem;
                font-weight: 800;
                color: #e4a853;
                margin-bottom: 10px;
                letter-spacing: 2px;
            }
            .license-title {
                font-size: 1.5rem;
                font-weight: 600;
                margin-bottom: 10px;
            }
            .license-desc {
                font-size: 0.9rem;
                color: #9ca3af;
                line-height: 1.6;
                margin-bottom: 25px;
            }
            .code-box {
                background: #0f0f15;
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 8px;
                padding: 15px;
                font-family: monospace;
                font-size: 1.25rem;
                font-weight: bold;
                letter-spacing: 1px;
                color: #e4a853;
                margin-bottom: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .copy-btn {
                background: rgba(228, 168, 83, 0.15);
                border: 1px solid #e4a853;
                color: #e4a853;
                padding: 5px 12px;
                border-radius: 4px;
                font-size: 0.75rem;
                cursor: pointer;
                font-family: 'Outfit', sans-serif;
                transition: all 0.2s;
                font-weight: bold;
            }
            .copy-btn:hover {
                background: #e4a853;
                color: #1a1a24;
            }
            .input-group {
                margin-bottom: 20px;
                text-align: left;
            }
            .input-group label {
                display: block;
                font-size: 0.85rem;
                color: #9ca3af;
                margin-bottom: 8px;
                font-weight: 600;
            }
            .license-input {
                width: 100%;
                box-sizing: border-box;
                background: #0f0f15;
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: #f3f4f6;
                padding: 12px 15px;
                border-radius: 8px;
                font-size: 1.2rem;
                font-family: monospace;
                text-align: center;
                letter-spacing: 1px;
                outline: none;
                transition: border-color 0.2s;
            }
            .license-input:focus {
                border-color: #e4a853;
            }
            .btn-activate {
                width: 100%;
                background: #e4a853;
                color: #101016;
                border: none;
                padding: 14px;
                font-size: 1rem;
                font-weight: bold;
                border-radius: 8px;
                cursor: pointer;
                font-family: 'Outfit', sans-serif;
                transition: transform 0.1s, opacity 0.2s;
            }
            .btn-activate:hover {
                opacity: 0.9;
            }
            .btn-activate:active {
                transform: scale(0.98);
            }
            .err-msg {
                color: #ef4444;
                font-size: 0.85rem;
                margin-top: 10px;
                display: none;
            }
        `;
        document.head.appendChild(style);

        // Buat markup modal
        const overlay = document.createElement('div');
        overlay.id = 'license-activation-overlay';
        overlay.innerHTML = `
            <div class="license-card">
                <div class="license-logo">G-COFFEE POS</div>
                <div class="license-title">Aktivasi Perangkat Diperlukan</div>
                <div class="license-desc">
                    Aplikasi POS ini dibatasi hanya untuk 1 PC terdaftar. Silakan hubungi developer untuk mendapatkan kode aktivasi Anda.
                </div>
                
                <div style="text-align: left; font-size: 0.85rem; color: #9ca3af; margin-bottom: 8px; font-weight: 600;">
                    Request Code PC Ini:
                </div>
                <div class="code-box">
                    <span id="req-code-text">${requestCode}</span>
                    <button class="copy-btn" onclick="copyRequestCode()">SALIN</button>
                </div>

                <div class="input-group">
                    <label for="activation-code-input">Masukkan Kode Aktivasi:</label>
                    <input type="text" id="activation-code-input" class="license-input" placeholder="XXXX-XXXX-XXXX-XXXX" maxlength="19">
                </div>

                <button class="btn-activate" id="btn-submit-activation">AKTIFKAN APLIKASI</button>
                <div class="err-msg" id="activation-error"></div>
            </div>
        `;
        
        // Daftarkan fungsi salin secara global agar bisa dipanggil tombol copy
        window.copyRequestCode = function() {
            navigator.clipboard.writeText(requestCode);
            const btn = document.querySelector('.copy-btn');
            btn.innerText = 'TERSALIN!';
            setTimeout(() => { btn.innerText = 'SALIN'; }, 2000);
        };

        // Tunggu body selesai dimuat sebelum menambahkan overlay
        if (document.body) {
            document.body.appendChild(overlay);
            setupInputListeners();
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.appendChild(overlay);
                setupInputListeners();
            });
        }
    }

    function setupInputListeners() {
        const input = document.getElementById('activation-code-input');
        const btn = document.getElementById('btn-submit-activation');
        const errMsg = document.getElementById('activation-error');

        if (!input || !btn) return;

        // Auto-format format XXXX-XXXX-XXXX-XXXX sewaktu mengetik
        input.addEventListener('input', (e) => {
            let val = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
            let formatted = val.match(/.{1,4}/g);
            e.target.value = formatted ? formatted.join('-') : val;
        });

        // Submit aktivasi
        btn.addEventListener('click', async () => {
            const code = input.value.trim();
            if (!code) {
                errMsg.innerText = 'Silakan masukkan kode aktivasi.';
                errMsg.style.display = 'block';
                return;
            }

            btn.innerText = 'MENGAKTIFKAN...';
            btn.disabled = true;
            errMsg.style.display = 'none';

            try {
                const response = await originalFetch('/api/license/activate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ activationCode: code })
                });

                const result = await response.json();
                if (result.success) {
                    alert('Aplikasi berhasil diaktivasi! POS siap digunakan.');
                    location.reload();
                } else {
                    errMsg.innerText = result.message || 'Kode aktivasi salah.';
                    errMsg.style.display = 'block';
                    btn.innerText = 'AKTIFKAN APLIKASI';
                    btn.disabled = false;
                }
            } catch (err) {
                errMsg.innerText = 'Koneksi ke server lokal gagal.';
                errMsg.style.display = 'block';
                btn.innerText = 'AKTIFKAN APLIKASI';
                btn.disabled = false;
            }
        });
    }

    // Jalankan cek lisensi langsung
    checkLicense();
})();

let products = [];
let cart = [];
let currentCategory = 'Semua';
let currentUser = null;
let currentAttendanceId = null;
let pendingVoid = null;
let activePage = 'kasir';
let currentStandCategories = []; // Kategori dinamis sesuai stand

function refreshIcons() {
    if (typeof lucide !== 'undefined') {
        try {
            lucide.createIcons();
        } catch (e) {
            console.error('Lucide error:', e);
        }
    }
}

async function init() {
    const savedUser = localStorage.getItem('gc_currentUser');
    const savedAttendance = localStorage.getItem('gc_attendanceId');

    if (savedUser && savedAttendance) {
        currentUser = JSON.parse(savedUser);
        currentAttendanceId = savedAttendance;
    }

    if (!currentUser) {
        document.getElementById('loginModal').style.display = 'flex';
    } else {
        document.getElementById('loginModal').style.display = 'none';
        updateHeaderInfo();
        console.log(`Session restored: ${currentUser.username} (${currentUser.stand_name || 'Admin'})`);
    }

    await fetchProducts();
    await fetchUsers();
    await loadAppSettings();
    await loadStandCategories(); // Load dynamic categories
    renderProducts();

    initTheme();
    initVK();
    updateSidebarVisibility();

    setInterval(checkSessionStatus, 60000);
    checkSessionStatus();
    refreshIcons();
}

// Update header info dengan nama kasir dan stand
function updateHeaderInfo() {
    if (!currentUser) return;
    const staffName = currentUser.username.toUpperCase();
    const standLabel = currentUser.stand_name ? ` — ${currentUser.stand_name}` : ' — Semua Stand';
    const el = document.getElementById('sidebarUser');
    if (el) el.innerText = currentUser.stand_code || staffName.substring(0, 2);
    const hKasir = document.getElementById('headerStaffKasir');
    if (hKasir) hKasir.innerText = staffName + standLabel;
    const hPending = document.getElementById('headerStaffPending');
    if (hPending) hPending.innerText = staffName + standLabel;
    // Update title header stand
    const standTitle = document.getElementById('headerStandTitle');
    if (standTitle) standTitle.innerText = currentUser.stand_name || 'Kantin BBWS Citarum';
}

// Load kategori dinamis berdasarkan stand kasir
async function loadStandCategories() {
    try {
        const standId = currentUser && currentUser.stand_id;
        if (!standId) {
            currentStandCategories = [];
            return;
        }
        const res = await fetch(`/api/products/categories?stand_id=${standId}`);
        const result = await res.json();
        if (result.success) {
            currentStandCategories = result.data;
            renderCategoryButtons(currentStandCategories);
        }
    } catch (e) {
        console.warn('Gagal load kategori:', e);
    }
}

// Render tombol kategori secara dinamis
function renderCategoryButtons(categories) {
    const container = document.querySelector('.categories');
    if (!container) return;
    container.innerHTML = `<button class="category-btn active" onclick="filterCategory('Semua', this)">Semua</button>`;
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.innerText = cat;
        btn.onclick = function() { filterCategory(cat, this); };
        container.appendChild(btn);
    });
}

function filterCategory(cat, btn) {
    document.querySelectorAll('.categories .category-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    currentCategory = cat;
    renderProducts();
}

async function checkSessionStatus() {
    if (!currentUser) return;
    if (currentUser.role === 'OWNER' || currentUser.role === 'ADMIN') return;

    try {
        const res = await fetch(`/api/auth/shift-status/${currentUser.id}?attendance_id=${currentAttendanceId}`);
        const data = await res.json();
        
        if (data.success && !data.valid) {
            // Auto logout without confirmation
            if (currentAttendanceId) {
                await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ attendance_id: currentAttendanceId })
                });
            }

            // Clear session
            currentUser = null;
            currentAttendanceId = null;
            localStorage.removeItem('gc_currentUser');
            localStorage.removeItem('gc_attendanceId');

            document.getElementById('loginModal').style.display = 'flex';
            updateSidebarVisibility(); 
            alert('🔐 ' + (data.message || 'Shift Anda berakhir. Otomatis logout.'));
        }
    } catch (e) {
        console.warn('Session check failed:', e);
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('gc_theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        updateThemeIcon(true);
    } else {
        updateThemeIcon(false);
    }
}

function toggleTheme() {
    const isLight = document.body.classList.toggle('light-theme');
    localStorage.setItem('gc_theme', isLight ? 'light' : 'dark');
    updateThemeIcon(isLight);
}

function updateThemeIcon(isLight) {
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.setAttribute('data-lucide', isLight ? 'sun' : 'moon');
        refreshIcons();
    }
}

async function fetchUsers() {
    try {
        const response = await fetch('/api/auth/users');
        const result = await response.json();
        const select = document.getElementById('loginUser');

        if (result.success && select) {
            select.innerHTML = result.data.map(u =>
                `<option value="${u.username}">${u.username} (${u.role === 'ADMIN' ? 'Owner' : 'Kasir'})</option>`
            ).join('');
        }
    } catch (error) {
        console.error('Fetch users error:', error);
    }
}

async function fetchProducts() {
    try {
        // Kasir hanya lihat produk stand-nya, Owner lihat semua
        const standId = currentUser && currentUser.stand_id;
        const url = standId ? `/api/products?stand_id=${standId}` : '/api/products';
        const response = await fetch(url);
        const data = await response.json();
        products = data.length > 0 ? data : [];
    } catch (error) {
        console.error('Fetcher error:', error);
        products = [];
    }
}

function setupCategoryListeners() {
    const container = document.querySelector('.categories');
    if (!container) return;
    const buttons = container.querySelectorAll('.category-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.innerText;
            renderProducts();
        });
    });
}

function renderProducts() {
    const grid = document.getElementById('productGrid');
    const searchInput = document.querySelector('.header .search-bar');
    const query = searchInput ? searchInput.value.toLowerCase() : '';

    if (!products || products.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px; color: var(--text-muted);">
                <i data-lucide="loader-2" class="spin" style="margin-bottom: 10px;"></i>
                <p>Memuat menu...</p>
            </div>
        `;
        refreshIcons();
        return;
    }

    // Filter by variant, category, and search query
    const filtered = products.filter(p => {
        const isVariant = p.name.includes('(Panas)') || p.name.includes('(Dingin)');
        const matchCategory = currentCategory === 'Semua' ? !isVariant : (p.category === currentCategory && !isVariant);
        const matchSearch = p.name.toLowerCase().includes(query);
        return matchCategory && matchSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px; color: var(--text-muted);">
                <p>Tidak ada produk ditemukan di kategori "${currentCategory}"</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(p => `
        <div class="product-card" onclick="checkVariants('${p.id}')">
            <img src="${p.image_url || p.img || 'https://via.placeholder.com/150'}" class="product-img" onerror="this.src='https://via.placeholder.com/150'">
            <div class="product-name">${p.name}</div>
            <div class="product-price">Rp ${Number(p.price).toLocaleString()}</div>
        </div>
    `).join('');
}

// Add Search Event Listener
document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.querySelector('.header .search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', () => {
            renderProducts();
        });
    }
});

function checkVariants(productId) {
    const baseProduct = products.find(p => p.id === productId);
    const hotVariant = products.find(p => p.name === baseProduct.name + ' (Panas)');
    const coldVariant = products.find(p => p.name === baseProduct.name + ' (Dingin)');

    if (hotVariant || coldVariant) {
        openVariantModal(baseProduct, hotVariant, coldVariant);
    } else {
        addToCart(productId);
    }
}

function openVariantModal(base, hot, cold) {
    const modal = document.getElementById('variantModal');
    document.getElementById('variantTitle').innerText = base.name;

    const btnHot = document.getElementById('btnHot');
    const btnCold = document.getElementById('btnCold');

    btnHot.onclick = () => { addToCart(hot.id); closeVariantModal(); };
    btnCold.onclick = () => { addToCart(cold.id); closeVariantModal(); };

    modal.style.display = 'flex';
}

function closeVariantModal() {
    document.getElementById('variantModal').style.display = 'none';
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, price: Number(product.price), qty: 1 });
    }
    updateCart();
}

function updateCart() {
    const container = document.getElementById('cartItems');
    if (cart.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: var(--text-muted); margin-top: 50px;"><p>Pilih menu untuk memulai</p></div>';
    } else {
        container.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div style="font-weight: 600;">${item.name}</div>
                    <div style="color: var(--accent);">Rp ${(Number(item.price) * item.qty).toLocaleString()}</div>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="changeQty('${item.id}', -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
                </div>
            </div>
        `).join('');
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = 0; // Tax set to 0% as requested
    const total = subtotal;

    document.getElementById('subtotal').innerText = `Rp ${subtotal.toLocaleString()}`;
    document.getElementById('tax').innerText = `Rp ${tax.toLocaleString()}`;
    document.getElementById('grandTotal').innerText = `Rp ${total.toLocaleString()}`;
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    if (delta < 0 && (item.qty === 1 || currentUser.role !== 'ADMIN')) {
        // Prepare for void authorization
        pendingVoid = { id, delta };
        openVoidModal(item);
        return;
    }

    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== id);
    }
    updateCart();
}

// --- AUTH & VOID LOGIC ---
function attemptLogin() {
    const username = document.getElementById('loginUser').value;
    const pin = document.getElementById('loginPin').value;

    fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, pin })
    })
        .then(res => res.json())
        .then(async data => {
            if (data.success) {
                currentUser = data.user;
                currentAttendanceId = data.attendance_id;

                // Persist session
                localStorage.setItem('gc_currentUser', JSON.stringify(currentUser));
                localStorage.setItem('gc_attendanceId', currentAttendanceId);

                document.getElementById('loginModal').style.display = 'none';
                document.getElementById('loginPin').value = '';

                updateHeaderInfo();
                updateSidebarVisibility();

                // Reload produk dan kategori sesuai stand
                await fetchProducts();
                await loadStandCategories();
                renderProducts();

                const standInfo = currentUser.stand_name ? ` — ${currentUser.stand_name}` : '';
                alert(`Login Berhasil! Selamat bekerja, ${currentUser.username}${standInfo}!`);
                if (typeof refreshIcons === 'function') refreshIcons();
            } else {
                alert(data.message);
            }
        })
        .catch(err => alert('Gagal menghubungi server'));
}

function updateSidebarVisibility() {
    const navSettings = document.getElementById('navSettings');
    const navOwner = document.getElementById('navOwner');
    const isBoss = currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'OWNER');

    if (navSettings) navSettings.style.display = isBoss ? 'flex' : 'none';
    if (navOwner) navOwner.style.display = isBoss ? 'flex' : 'none';
}

async function logout() {
    const isBoss = currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'OWNER');
    const msg = currentAttendanceId ? 'Konfirmasi Absen Pulang (Logout)?' : 'Konfirmasi Keluar (Logout)?';

    if (confirm(msg)) {
        if (currentAttendanceId) {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ attendance_id: currentAttendanceId })
            });
        }

        // Clear session
        currentUser = null;
        currentAttendanceId = null;
        localStorage.removeItem('gc_currentUser');
        localStorage.removeItem('gc_attendanceId');

        document.getElementById('loginModal').style.display = 'flex';
        updateSidebarVisibility(); // Hide admin menus
    }
}

function openVoidModal(item) {
    const modal = document.getElementById('voidModal');
    document.getElementById('btnConfirmVoid').onclick = () => confirmVoid(item);
    modal.style.display = 'flex';
}

function closeVoidModal() {
    document.getElementById('voidModal').style.display = 'none';
    pendingVoid = null;
}

async function confirmVoid(item) {
    const reason = document.getElementById('voidReason').value;

    // Log the void
    await fetch('/api/auth/void-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: currentUser.id,
            product_name: item.name,
            price: item.price,
            reason: reason
        })
    });

    // Execute the removal
    if (pendingVoid.delta < 0) {
        item.qty += pendingVoid.delta;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== pendingVoid.id);
        }
    }

    updateCart();
    closeVoidModal();
    alert('Penghapusan item dicatat dalam sistem.');
}

function togglePaymentSelection() {
    const status = document.getElementById('paymentStatus').value;
    const area = document.getElementById('paymentSelectionArea');
    area.style.display = (status === 'PAID') ? 'block' : 'none';
}

document.getElementById('btnCheckout').addEventListener('click', async () => {
    if (cart.length === 0) return alert('Keranjang kosong!');

    let customerName = document.getElementById('customerName').value.trim();
    if (!customerName) {
        customerName = "PELANGGAN UMUM";
    }

    const paymentStatus = document.getElementById('paymentStatus').value;
    const paymentMethod = document.getElementById('paymentMethod').value;

    const shouldPrint = paymentStatus === 'PAID' && document.getElementById('checkPrint').checked;

    const payload = {
        invoice_number: `INV-${Date.now()}`,
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            product_id: item.id,
            qty: item.qty,
            price: item.price
        })),
        total: cart.reduce((sum, item) => sum + (item.price * item.qty), 0),
        payment_method: paymentMethod,
        customer_name: customerName,
        payment_status: paymentStatus,
        should_print: shouldPrint,
        stand_id: currentUser ? currentUser.stand_id : null  // << Multi-stand support
    };

    try {
        const response = await fetch('/api/sales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...payload, creator_id: currentUser.id })
        });

        const result = await response.json();
        console.log("Pay Sales Response:", result);
        
        if (result.success) {
            // NEW: QRIS Handling (v2.5)
            if (result.qris) {
                console.log("Triggering QRIS Modal with:", result.qris);
                showQRISModal(result.qris, payload.total, payload.invoice_number);
            } else {
                let msg = paymentStatus === 'PAID' ? 'Transaksi Berhasil!' : 'Pesanan disimpan ke daftar Pending.';

                if (result.print && result.print.success) {
                    msg += `\n${result.print.message}`;
                } else if (shouldPrint) {
                    if (result.print?.isCloud) {
                        msg += `\n☁️ Mode Cloud: Membuka struk untuk cetak manual...`;
                        previewReceipt(result.data.id);
                    } else {
                        msg += `\n⚠️ Gagal mencetak struk: ${result.print?.error || 'Sedang simulasi server'}`;
                    }
                }

                alert(`${msg}\nCustomer: ${customerName}\nInvoice: ${payload.invoice_number}`);
                cart = [];
                document.getElementById('customerName').value = '';
                document.getElementById('paymentStatus').value = 'PAID';
                togglePaymentSelection();
                updateCart();
            }
        } else {
            alert('Gagal: ' + result.error);
        }
    } catch (error) {
        alert('Terjadi kesalahan koneksi ke server.');
    }
});

// --- QRIS Frontend Integration (v2.5) ---
let currentQRISInvoice = null;

function showQRISModal(qris, amount, invoice) {
    currentQRISInvoice = invoice;
    document.getElementById('qrisAmount').innerText = `Rp ${Number(amount).toLocaleString()}`;
    document.getElementById('qrisInvoice').innerText = `#${invoice}`;
    document.getElementById('qrisImage').src = qris.qr_image;
    document.getElementById('qrisModal').style.display = 'flex';
    refreshIcons();
}

function closeQRISModal() {
    if (confirm("Pastikan pelanggan belum membayar sebelum menutup. Lanjut?")) {
        document.getElementById('qrisModal').style.display = 'none';
        // Clear cart anyway because transaction was already saved in DB (just unpaid)
        // Staff can find it in Pending or Report later.
        resetPOS();
    }
}

async function confirmQRISPayment() {
    const btn = document.getElementById('btnConfirmQRIS');
    const originalText = btn.innerHTML;
    
    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> MEMVERIFIKASI...';
    refreshIcons();

    try {
        const response = await fetch(`/api/qris/verify/${currentQRISInvoice}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                payer_name: document.getElementById('customerName').value || 'Pelanggan QRIS',
                payer_note: 'Verified from POS'
            })
        });

        const result = await response.json();
        
        if (result.success) {
            alert("✓ " + result.message);
            document.getElementById('qrisModal').style.display = 'none';
            
            if (typeof activePage !== 'undefined' && activePage === 'pending') {
                loadPendingSales();
            } else {
                resetPOS();
            }
        } else {
            alert(result.message || "Gagal verifikasi pembayaran.");
        }
    } catch (error) {
        alert("Terjadi kesalahan sistem saat verifikasi.");
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
        refreshIcons();
    }
}

function resetPOS() {
    cart = [];
    document.getElementById('customerName').value = '';
    document.getElementById('paymentStatus').value = 'PAID';
    togglePaymentSelection();
    updateCart();
    renderProducts();
}

// --- Navigation Logic ---
function switchPage(page) {
    activePage = page;
    const pages = {
        'kasir': document.getElementById('kasirPage'),
        'stok': document.getElementById('stokPage'),
        'report': document.getElementById('reportPage'),
        'pending': document.getElementById('pendingPage'),

        'system': document.getElementById('systemPage'),
        'settings': document.getElementById('settingsPage'),
        'owner': document.getElementById('ownerPage'),
        'belanja': document.getElementById('belanjaPage'),
        'gudang': document.getElementById('gudangPage')
    };

    const cartSection = document.getElementById('cartSection');
    const navItems = {
        'kasir': document.getElementById('navKasir'),
        'stok': document.getElementById('navStok'),
        'report': document.getElementById('navReport'),
        'pending': document.getElementById('navPending'),

        'system': document.getElementById('navSystem'),
        'settings': document.getElementById('navSettings'),
        'owner': document.getElementById('navOwner'),
        'gudang': document.getElementById('navGudang')
    };

    // Access Control
    if ((page === 'settings' || page === 'owner') && (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'OWNER'))) {
        alert('Akses Dibatalkan: Menu ini hanya untuk Owner/Admin!');
        return;
    }

    // Hide all pages and remove active classes
    Object.keys(pages).forEach(p => {
        if (pages[p]) pages[p].style.display = 'none';
        if (navItems[p]) navItems[p].classList.remove('active');
    });

    // Show target page
    if (pages[page]) pages[page].style.display = 'block';
    if (navItems[page]) navItems[page].classList.add('active');

    // Sub-navigation active state
    const subNavs = {
        'stok': ['subNavStok', 'subNavStok2', 'subNavStok3'],
        'gudang': ['subNavGudang', 'subNavGudang2', 'subNavGudang3'],
        'belanja': ['subNavBelanja', 'subNavBelanja2', 'subNavBelanja3']
    };

    // Reset all sub-nav buttons
    Object.values(subNavs).flat().forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
    });

    // Set active sub-nav buttons
    if (subNavs[page]) {
        subNavs[page].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('active');
        });
    }

    // Cart visibility
    cartSection.style.display = (page === 'kasir') ? 'flex' : 'none';

    // Page-specific loaders
    if (page === 'kasir') renderProducts();
    if (page === 'stok') loadStokData();
    if (page === 'report') loadReportData();
    if (page === 'pending') loadPendingSales();

    if (page === 'settings') loadActivityLogs();
    if (page === 'owner') loadOwnerData();
    if (page === 'belanja') {
        loadExpenseMaterials();
        loadExpenseFilters();
        loadExpenseHistory();
    }
    if (page === 'gudang') loadGudangData();
    refreshIcons();
}

// --- App Settings Logic ---
async function loadAppSettings() {
    try {
        const res = await fetch('/api/settings');
        const result = await res.json();
        if (result.success) {
            const settings = result.data;

            // Apply Shutdown Visibility
            const navSystem = document.getElementById('navSystem');
            if (navSystem) {
                navSystem.style.display = settings.show_shutdown === 'ON' ? 'flex' : 'none';
            }

            // Apply Default Print
            const checkPrint = document.getElementById('checkPrint');
            if (checkPrint) {
                checkPrint.checked = settings.default_print === 'ON';
            }

            // Sync to Settings Page UI
            const uiDefaultPrint = document.getElementById('settingDefaultPrint');
            const uiShowShutdown = document.getElementById('settingShowShutdown');
            const uiVirtualKeyboard = document.getElementById('settingVirtualKeyboard');

            if (uiDefaultPrint) uiDefaultPrint.checked = settings.default_print === 'ON';
            if (uiShowShutdown) uiShowShutdown.checked = settings.show_shutdown === 'ON';
            if (uiVirtualKeyboard) uiVirtualKeyboard.checked = settings.virtual_keyboard !== 'OFF'; // Default ON

            // Store in global or local cache if needed
            window.appSettings = settings;
        }
    } catch (err) {
        console.error('Load settings error:', err);
    }
}

async function updateAppSetting(key, value) {
    try {
        const res = await fetch('/api/settings/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key, value })
        });
        const result = await res.json();
        if (result.success) {
            // Re-apply settings
            await loadAppSettings();
        }
    } catch (err) {
        alert('Gagal memperbarui pengaturan');
    }
}

async function loadActivityLogs() {
    const tbody = document.getElementById('activityLogBody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">Memuat log...</td></tr>';

    try {
        const res = await fetch('/api/settings/logs');
        const result = await res.json();
        if (result.success) {
            tbody.innerHTML = result.data.map(log => `
                <tr>
                    <td style="font-size: 0.8rem; color: var(--text-muted)">${new Date(log.created_at).toLocaleString('id-ID')}</td>
                    <td style="font-weight: 600">${log.username}</td>
                    <td><span class="anomaly-tag" style="background: var(--primary); font-size: 0.6rem">${log.action}</span></td>
                    <td style="font-size: 0.85rem">${log.note || '-'}</td>
                </tr>
            `).join('');

            if (result.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: var(--text-muted)">Belum ada aktivitas tercatat</td></tr>';
            }
        }
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: var(--danger)">Gagal memuat log</td></tr>';
    }
}


// --- Usage Analysis Logic ---
async function loadUsageAnalysis() {
    const selector = document.getElementById('analysisDays');
    if (!selector) return;
    const days = selector.value;
    try {
        const res = await fetch(`/api/stock/analysis?days=${days}`);
        const result = await res.json();
        if (result.success) {
            const tbody = document.getElementById('usageAnalysisBody');
            if (tbody) {
                tbody.innerHTML = result.data.map(m => {
                    const effNum = parseFloat(m.efficiency);
                    let statusColor = 'var(--success)';
                    let statusText = 'SANGAT BAIK';

                    if (effNum < 90) {
                        statusColor = 'var(--danger)';
                        statusText = 'EVALUASI';
                    } else if (effNum < 97) {
                        statusColor = 'var(--accent)';
                        statusText = 'NORMAL';
                    }

                    return `
                        <tr>
                            <td style="font-weight: 600;">${m.name}</td>
                            <td>${Number(m.usage_sold).toLocaleString()} ${m.unit}</td>
                            <td style="color: var(--danger);">${m.usage_loss > 0 ? '-' + Number(m.usage_loss).toLocaleString() : '0'} ${m.unit}</td>
                            <td style="color: var(--success);">${m.usage_surplus > 0 ? '+' + Number(m.usage_surplus).toLocaleString() : '0'} ${m.unit}</td>
                            <td style="font-weight: bold; font-size: 1.1rem; color: ${statusColor}">${m.efficiency}%</td>
                            <td><span style="background: ${statusColor}1A; color: ${statusColor}; border: 1px solid ${statusColor}44; padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 800;">${statusText}</span></td>
                        </tr>
                    `;
                }).join('');
            }
        }
    } catch (e) {
        console.error("Error loading usage analysis:", e);
    }
}

// --- Report Logic ---
async function loadReportData() {
    const dateInput = document.getElementById('reportDate');
    if (!dateInput.value) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }

    const selectedDate = dateInput.value;
    const selectedShift = document.getElementById('reportShift').value || 1;

    // Populate Stands Dropdown
    const standFilterEl = document.getElementById('reportStandFilter');
    const isBoss = currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'OWNER');

    if (standFilterEl) {
        if (!isBoss) {
            // Kasir hanya bisa lihat stand sendiri
            standFilterEl.innerHTML = `<option value="${currentUser.stand_id}">🏢 ${currentUser.stand_name || 'Stand Saya'}</option>`;
            standFilterEl.disabled = true;
        } else {
            // Owner / Admin bisa lihat semua
            standFilterEl.disabled = false;
            if (!standFilterEl.querySelector('option[value="ALL"]')) {
                standFilterEl.innerHTML = '<option value="ALL">🏢 Semua Stand</option>';
            }
            if (standFilterEl.options.length <= 1) {
                const standsRes = await fetch('/api/stands');
                const standsData = await standsRes.json();
                if (standsData.success) {
                    standsData.data.forEach(s => {
                        const opt = document.createElement('option');
                        opt.value = s.id;
                        opt.innerText = `🏢 ${s.name}`;
                        standFilterEl.appendChild(opt);
                    });
                }
            }
        }
    }
    
    const standId = standFilterEl?.value || 'ALL';

    try {
        // 1. Fetch Daily (Selected Shift)
        const dailyRes = await fetch(`/api/reports/daily?date=${selectedDate}&shift=${selectedShift}&stand_id=${standId}`);
        const daily = await dailyRes.json();
        if (daily.success) {
            document.getElementById('dailyRevenue').innerText = `Rp ${Number(daily.data.summary.gross_revenue || 0).toLocaleString()}`;
            document.getElementById('dailyCount').innerText = `${daily.data.summary.total_transactions || 0} Transaksi`;

            // Revenue Breakdown
            const cashPayment = daily.data.payments.find(p => p.payment_method === 'CASH');
            const qrisPayment = daily.data.payments.find(p => p.payment_method === 'QRIS');
            if (document.getElementById('dailyCash')) {
                document.getElementById('dailyCash').innerText = `Rp ${Number(cashPayment?.total_amount || 0).toLocaleString()}`;
            }
            if (document.getElementById('dailyQRIS')) {
                document.getElementById('dailyQRIS').innerText = `Rp ${Number(qrisPayment?.total_amount || 0).toLocaleString()}`;
            }

            const topBody = document.getElementById('topProductsBody');
            const productsSold = daily.data.all_products || [];
            topBody.innerHTML = productsSold.map(p => {
                const time = new Date(p.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                const isPaid = (p.payment_status || '').toUpperCase() === 'PAID';
                const paymentLabel = isPaid ? (p.payment_method || 'CASH') : '<span style="color: var(--danger); font-weight: 800;">[BELUM BAYAR]</span>';
                return `
                <tr>
                    <td>
                        <div style="font-weight: 600; color: ${isPaid ? 'var(--text)' : 'var(--danger)'}">${p.name}</div>
                        <small style="color: var(--text-muted)">${time} | ${paymentLabel}</small>
                    </td>
                    <td style="font-weight: bold; text-align: right;">${p.total_qty}</td>
                </tr>`;
            }).join('');

            // Update Recent Transactions
            const recentBody = document.getElementById('recentSalesBody');
            if (daily.data.recent_sales && recentBody) {
                recentBody.innerHTML = daily.data.recent_sales.map(s => `
                    <tr>
                        <td>${new Date(s.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</td>
                        <td style="font-size: 0.85rem;">${s.invoice_number}</td>
                        <td style="font-weight: 600;">${s.customer_name}</td>
                        <td>Rp ${Number(s.total).toLocaleString()}</td>
                        <td>
                            <span style="color: ${s.payment_status === 'PAID' ? 'var(--success)' : 'var(--danger)'}">
                                ${s.payment_status === 'PAID' ? 'LUNAS' : 'PENDING'}
                            </span>
                            <br><small style="color: var(--text-muted)">${s.payment_method || '-'}</small>
                        </td>
                        <td>
                            <div style="display: flex; gap: 8px;">
                                <button class="category-btn" onclick="reprintSale('${s.id}')" title="Print Struk" style="padding: 6px; background: var(--glass); display: inline-flex; align-items: center; justify-content: center;">
                                    <i data-lucide="printer" style="width: 16px; height: 16px;"></i>
                                </button>
                                <button class="category-btn" onclick="previewReceipt('${s.id}')" title="Preview Struk" style="padding: 6px; background: var(--glass); color: var(--accent); display: inline-flex; align-items: center; justify-content: center;">
                                    <i data-lucide="eye" style="width: 16px; height: 16px;"></i>
                                </button>
                                ${(currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'OWNER')) ? `
                                <button class="category-btn" onclick="deleteSale('${s.id}', true)" title="Hapus Transaksi" style="padding: 6px; background: var(--glass); color: var(--danger); display: inline-flex; align-items: center; justify-content: center;">
                                    <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
                                </button>
                                ` : ''}
                            </div>
                        </td>
                    </tr>`).join('');
                refreshIcons();
            }
        }

        // 2. Fetch Weekly/Monthly Summary
        try {
            const [weeklyRes, monthlyRes] = await Promise.all([
                fetch(`/api/reports/weekly?stand_id=${standId}`),
                fetch(`/api/reports/monthly?stand_id=${standId}`)
            ]);
            const weekly = await weeklyRes.json();
            const monthly = await monthlyRes.json();

            if (weekly.success) {
                document.getElementById('weeklyRevenue').innerText = `Rp ${Number(weekly.data.summary.gross_revenue || 0).toLocaleString()}`;
                document.getElementById('weeklyCount').innerText = `${weekly.data.summary.total_transactions || 0} Transaksi`;
            }
            if (monthly.success) {
                document.getElementById('monthlyRevenue').innerText = `Rp ${Number(monthly.data.summary.gross_revenue || 0).toLocaleString()}`;
                document.getElementById('monthlyCount').innerText = `${monthly.data.summary.total_transactions || 0} Transaksi`;
            }
        } catch (e) { console.warn("Summary Fetch Error:", e); }

        // 3. Fetch Current Inventory Status
        try {
            const inventoryRes = await fetch('/api/reports/inventory');
            const inventoryData = await inventoryRes.json();
            if (inventoryData.success) {
                const tbody = document.getElementById('inventoryStatusBody');
                if (tbody) {
                    tbody.innerHTML = inventoryData.data.map(m => `
                        <tr>
                            <td style="font-weight: 600;">${m.name}</td>
                            <td style="font-weight: bold; color: ${m.stock <= 100 ? 'var(--danger)' : 'var(--success)'};">
                                ${Number(m.stock).toLocaleString()}
                            </td>
                            <td>${m.unit}</td>
                        </tr>`).join('');
                }
            }
        } catch (e) { console.warn("Inventory Fetch Error:", e); }

        // 4. Fetch Audit Stok (Opname) 
        try {
            const opnameFilter = document.getElementById('opnameFilter').value;
            const opnameRes = await fetch(`/api/stock/opname/history?filter=${opnameFilter}&date=${selectedDate}`);
            const opnameData = await opnameRes.json();
            if (opnameData.success) {
                const tbody = document.getElementById('reportOpnameBody');
                if (tbody) {
                    tbody.innerHTML = opnameData.data.map(h => {
                        const absDiff = Math.abs(h.difference);
                        const threshold = (h.material_name || '').toLowerCase().includes('cup') ? 2 : 50;
                        const isAnomaly = absDiff > threshold;
                        const isResolved = h.is_resolved === 1;
                        const diffClass = h.difference < 0 ? 'diff-minus' : (h.difference > 0 ? 'diff-plus' : '');
                        const diffSign = h.difference > 0 ? '+' : '';
                        let anomalyTag = isResolved ? '<span class="anomaly-tag" style="background: var(--success);">RESOLVED</span>' : (isAnomaly ? '<span class="anomaly-tag">ANOMALY</span>' : '');
                        const resolveBtn = (isAnomaly && !isResolved) ? `<button onclick="resolveAnomaly('${h.id}')" class="category-btn no-print" style="font-size: 0.6rem; padding: 2px 5px; margin-left: 10px; border-color: var(--accent); color: var(--accent);">Selesaikan</button>` : '';

                        return `
                        <tr class="${(isAnomaly && !isResolved) ? 'anomaly-row' : ''}">
                            <td style="font-weight: 600;">${anomalyTag}${h.material_name}${resolveBtn}</td>
                            <td>${h.system_stock} ${h.unit}</td>
                            <td style="font-weight: bold;">${h.physical_stock} ${h.unit}</td>
                            <td class="${diffClass}">${diffSign}${h.difference} ${h.unit}</td>
                            <td style="font-size: 0.85rem; color: var(--text-muted)">
                                ${isResolved ? '<b style="color:var(--success)">[OK BY ' + h.resolved_by + ']</b> ' : ''}${h.note || '-'}
                            </td>
                        </tr>`;
                    }).join('');
                    if (opnameData.data.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted)">Tidak ada data audit untuk periode ini</td></tr>';
                    }
                }
            }
        } catch (e) { console.warn("Opname Fetch Error:", e); }

        // 5. Shift Summary (Skip if no target or route)
        // loadUsageAnalysis() and others follow...
        try {
            // 6. Usage Analysis
            loadUsageAnalysis();

            // 7. Attendance Logs
            const attendanceRes = await fetch('/api/auth/attendance');
            const attendanceData = await attendanceRes.json();
            if (attendanceData.success && attendanceData.data) {
                const attBody = document.getElementById('reportAttendanceBody');
                if (attBody) {
                    attBody.innerHTML = attendanceData.data.map(a => `
                        <tr>
                            <td style="font-weight: 600;">${a.staff_name}</td>
                            <td style="color: var(--success);">${new Date(a.clock_in).toLocaleString('id-ID')}</td>
                            <td style="color: ${a.clock_out ? 'var(--text)' : 'var(--accent)'};">
                                ${a.clock_out ? new Date(a.clock_out).toLocaleString('id-ID') : '<i>Masih Bertugas</i>'}
                            </td>
                            <td>
                                <span style="font-size: 0.8rem; padding: 2px 8px; border-radius: 4px; background: ${a.clock_out ? 'var(--glass)' : 'rgba(228, 168, 83, 0.2)'}">
                                    ${a.clock_out ? 'Selesai' : 'Aktif'}
                                </span>
                            </td>
                        </tr>`).join('');
                }
            }

            // 8. Void Logs
            const voidRes = await fetch('/api/auth/void-logs');
            const voidData = await voidRes.json();
            if (voidData.success && voidData.data) {
                const voidBody = document.getElementById('reportVoidBody');
                if (voidBody) {
                    voidBody.innerHTML = voidData.data.map(v => `
                        <tr>
                            <td>${new Date(v.created_at).toLocaleTimeString('id-ID')}</td>
                            <td>${v.staff_name || 'System'}</td>
                            <td style="font-weight: 600;">${v.product_name}</td>
                            <td>Rp ${Number(v.price).toLocaleString()}</td>
                            <td style="color: var(--danger); font-style: italic;">${v.reason}</td>
                        </tr>`).join('');
                }
            }

            // 9. AI Smart Audit
            const aiRes = await fetch('/api/auth/ai-insights');
            const aiData = await aiRes.json();
            if (aiData.success && aiData.data) {
                const aiList = document.getElementById('aiInsightList');
                if (aiList) {
                    aiList.innerHTML = aiData.data.map(i => `
                        <div style="margin-bottom: 10px; padding-left: 15px; border-left: 3px solid ${i.severity === 'HIGH' ? 'var(--danger)' : 'var(--accent)'};">
                            <span style="font-weight: bold; color: ${i.severity === 'HIGH' ? 'var(--danger)' : 'var(--accent)'}; text-transform: uppercase; font-size: 0.8rem;">[${i.type}]</span> 
                            ${i.message}
                        </div>`).join('');
                }
            }
        } catch (e) { console.warn("Report Section Error:", e); }

        refreshIcons();

    } catch (error) {
        console.error('Report Error:', error);
    }
}


async function reprintSale(id) {
    try {
        const res = await fetch(`/api/sales/reprint/${id}`, { method: 'POST' });
        const result = await res.json();
        if (result.success) {
            if (result.print?.isCloud) {
                previewReceipt(id);
            } else {
                alert('Perintah cetak ulang berhasil dikirim!');
            }
        } else {
            alert('Gagal cetak ulang: ' + (result.message || result.error || 'Server error'));
        }
    } catch (error) {
        alert('Kesalahan koneksi saat cetak ulang.');
    }
}

async function previewReceipt(id) {
    try {
        const res = await fetch(`/api/reports/sale/${id}`);
        const result = await res.json();

        if (result.success) {
            const sale = result.data;
            document.getElementById('receiptInvoice').innerText = sale.invoice_number;
            document.getElementById('receiptDate').innerText = new Date(sale.created_at).toLocaleString('id-ID');
            document.getElementById('receiptStaff').innerText = sale.staff_name || '-';
            document.getElementById('receiptCustomer').innerText = sale.customer_name || '-';
            document.getElementById('receiptTotalText').innerText = `Rp ${Number(sale.total).toLocaleString()}`;
            document.getElementById('receiptMethodText').innerText = sale.payment_method;

            const exchangeRow = document.getElementById('receiptExchangeRow');
            const exchangeText = document.getElementById('receiptExchangeText');
            if (sale.qris_exchange > 0 && exchangeRow && exchangeText) {
                exchangeRow.style.display = 'flex';
                exchangeText.innerText = `Rp ${Number(sale.qris_exchange).toLocaleString()}`;
            } else if (exchangeRow) {
                exchangeRow.style.display = 'none';
            }

            const itemsHtml = sale.items.map(item => `
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <div style="flex:1;">
                        <div>${item.name}</div>
                        <div style="font-size:0.75rem; color:#666;">${item.qty} x ${Number(item.price).toLocaleString()}</div>
                    </div>
                    <div style="font-weight:bold;">Rp ${(item.qty * item.price).toLocaleString()}</div>
                </div>
            `).join('');

            document.getElementById('receiptItems').innerHTML = itemsHtml;
            document.getElementById('receiptModal').style.display = 'block';
        } else {
            alert('Gagal mengambil detail transaksi');
        }
    } catch (e) {
        alert('Kesalahan koneksi saat mengambil detail struk');
    }
}

// --- Stock Opname Logic ---
async function loadStokData() {
    await fetchMaterials();
    await fetchOpnameHistory();
}

let selectedMaterialForOpname = null;

async function fetchMaterials() {
    try {
        const response = await fetch('/api/stock/materials');
        const result = await response.json();
        const grid = document.getElementById('materialGrid');

        if (result.success) {
            grid.innerHTML = result.data.map(m => `
                <div class="product-card" onclick="openOpnameModal(${JSON.stringify(m).replace(/"/g, '&quot;')})" style="max-width: none;">
                    <img src="${m.image_url || 'https://via.placeholder.com/150'}" class="product-img" style="height: 100px;">
                    <div class="product-name" style="font-size: 0.85rem;">${m.name}</div>
                    <div style="font-size: 0.75rem; color: var(--accent); font-weight: bold;">
                        ${Number(m.stock).toLocaleString()} ${m.unit}
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Fetch materials error:', error);
    }
}

let currentOpnameMode = 'AUDIT';

function setOpnameMode(mode) {
    currentOpnameMode = mode;
    const btnOpname = document.getElementById('modeOpname');
    const btnRestock = document.getElementById('modeRestock');
    const qtyLabel = document.getElementById('qtyLabel');
    const sysStockEl = document.getElementById('opnameSysStock');

    if (mode === 'AUDIT') {
        btnOpname.classList.add('active');
        btnRestock.classList.remove('active');
        qtyLabel.innerText = 'Stok FISIK (Hasil Hitung Manual)';
        sysStockEl.style.display = 'block';
    } else {
        btnRestock.classList.add('active');
        btnOpname.classList.remove('active');
        qtyLabel.innerText = 'JUMLAH STOK MASUK (Baru)';
        sysStockEl.style.display = 'none';
    }
}

function openOpnameModal(material) {
    selectedMaterialForOpname = material;
    document.getElementById('opnameModalTitle').innerText = material.name;
    document.getElementById('opnameModalUnit').innerText = material.unit;
    document.getElementById('opnameSysStock').innerText = `Stok Sistem saat ini: ${Number(material.stock).toLocaleString()} ${material.unit}`;
    setOpnameMode('AUDIT'); // Reset to Audit by default
    document.getElementById('opnameQty').value = '';
    document.getElementById('opnameNote').value = '';
    document.getElementById('opnameModal').style.display = 'flex';
}

async function fetchOpnameHistory() {
    try {
        const response = await fetch('/api/stock/opname/history');
        const result = await response.json();
        const tbody = document.getElementById('opnameHistoryBody');

        if (result.success) {
            if (result.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 30px;">Belum ada riwayat opname untuk periode ini</td></tr>';
                return;
            }

            tbody.innerHTML = result.data.map(h => {
                const absDiff = Math.abs(h.difference);
                const threshold = (h.material_name || '').toLowerCase().includes('cup') ? 2 : 50;
                const isAnomaly = absDiff > threshold;
                const diffClass = h.difference < 0 ? 'diff-minus' : (h.difference > 0 ? 'diff-plus' : '');
                const diffSign = h.difference > 0 ? '+' : '';
                const anomalyTag = isAnomaly ? '<span class="anomaly-tag">ANOMALY</span>' : '';

                return `
                    <tr class="${isAnomaly ? 'anomaly-row' : ''}">
                        <td style="font-size: 0.8rem; color: var(--text-muted)">
                            ${new Date(h.created_at).toLocaleString('id-ID')}
                        </td>
                        <td style="font-weight: 600;">${anomalyTag}${h.material_name}</td>
                        <td>${h.system_stock} ${h.unit}</td>
                        <td style="font-weight: bold;">${h.physical_stock} ${h.unit}</td>
                        <td class="${diffClass}">${diffSign}${h.difference} ${h.unit}</td>
                    </tr>
                `;
            }).join('');
        }
    } catch (error) {
        console.error('Fetch history error:', error);
    }
}

document.getElementById('btnSubmitOpname')?.addEventListener('click', async () => {
    const materialId = selectedMaterialForOpname ? selectedMaterialForOpname.id : null;
    const qty = document.getElementById('opnameQty').value;
    const note = document.getElementById('opnameNote').value;

    if (!materialId || qty === '') return alert('Isi jumlah stok!');

    const endpoint = currentOpnameMode === 'AUDIT' ? '/api/stock/opname' : '/api/stock/restock';
    const payload = currentOpnameMode === 'AUDIT'
        ? { raw_material_id: materialId, physical_stock: parseFloat(qty), note: note }
        : { raw_material_id: materialId, qty: parseFloat(qty), note: note };

    if (currentOpnameMode === 'AUDIT') {
        const sysStock = parseFloat(selectedMaterialForOpname.stock);
        const physicalStock = parseFloat(qty);
        const diff = Math.abs(physicalStock - sysStock);
        const threshold = selectedMaterialForOpname.name.toLowerCase().includes('cup') ? 2 : 50;

        if (diff > threshold) {
            if (!confirm(`⚠️ PERINGATAN ANOMALI!\n\nSelisih stok fisik (${physicalStock}) dengan sistem (${sysStock}) mencapai ${diff.toFixed(1)} ${selectedMaterialForOpname.unit}.\n\nApakah Anda yakin data hitung manual sudah benar?`)) {
                return;
            }
        }
    }

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (result.success) {
            alert(currentOpnameMode === 'AUDIT' ? 'Stock Opname berhasil disimpan!' : 'Stok Masuk berhasil dicatat!');
            document.getElementById('opnameModal').style.display = 'none';
            loadStokData(); // Refresh data
            if (activePage === 'report') loadReportData(); // Refresh report if on report page
        } else {
            alert('Gagal: ' + result.message);
        }
    } catch (error) {
        console.error('Opname/Restock error:', error);
        alert('Gagal memproses data: ' + error.message);
    }
});

// --- Print Logic ---
async function openPrintPreview() {
    const reportDate = document.getElementById('reportDate').value;
    const reportShift = document.getElementById('reportShift').value || 1;
    
    const standFilterEl = document.getElementById('reportStandFilter');
    const standId = standFilterEl?.value || 'ALL';
    const standName = standId === 'ALL' ? 'Semua Stand' : standFilterEl.options[standFilterEl.selectedIndex].text;

    // Update Header Text
    const printStandNameEl = document.getElementById('printStandName');
    if (printStandNameEl) {
        printStandNameEl.innerText = standName;
        // Strip emojis for print if needed, but simple text is fine
    }

    // Fetch fresh daily data for payment breakdown
    const response = await fetch(`/api/reports/daily?date=${reportDate}&shift=${reportShift}&stand_id=${standId}`);
    const result = await response.json();

    if (result.success) {
        const data = result.data;
        document.getElementById('printRevenue').innerText = `Rp ${Number(data.summary.gross_revenue || 0).toLocaleString()}`;
        document.getElementById('printCount').innerText = data.summary.total_transactions || 0;

        // Payment breakdown
        const cash = data.payments.find(p => p.payment_method === 'CASH')?.total_amount || 0;
        const qris = data.payments.find(p => p.payment_method === 'QRIS')?.total_amount || 0;
        document.getElementById('printCash').innerText = `Rp ${Number(cash).toLocaleString()}`;
        document.getElementById('printQRIS').innerText = `Rp ${Number(qris).toLocaleString()}`;

        // All Products Sold (with Time & Payment Method)
        document.getElementById('printProductsUsed').innerHTML = data.all_products.length > 0
            ? data.all_products.map(p => {
                const time = new Date(p.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                const isPaid = (p.payment_status || '').toUpperCase() === 'PAID';
                const paymentLabel = isPaid ? (p.payment_method || 'CASH') : 'BELUM BAYAR';
                const textStyle = isPaid ? 'color: #333;' : 'color: #d32f2f; font-weight: bold;';

                return `
                <div style="display:flex; justify-content:space-between; font-size: 0.85rem; border-bottom: 1px dotted #eee; padding: 4px 0;">
                    <div style="flex: 1;">
                        <span style="display:block; font-weight: 600; ${isPaid ? '' : 'color: #d32f2f;'}">- ${p.name}</span>
                        <small style="${textStyle}">${time} | ${paymentLabel}</small>
                    </div>
                    <span style="font-weight:bold;">${p.total_qty}</span>
                </div>
            `;
            }).join('')
            : '<p style="font-style:italic;">Belum ada penjualan</p>';

        // Stock Added
        document.getElementById('printStockIn').innerHTML = data.stock_added.length > 0
            ? data.stock_added.map(s => `
                <div style="display:flex; justify-content:space-between;">
                    <span>+ ${s.name}</span>
                    <span>${Number(s.total_qty).toLocaleString()} ${s.unit}</span>
                </div>
            `).join('')
            : '<p style="font-style:italic; font-size: 0.8rem;">Tidak ada stok masuk</p>';

        // Stock Used
        document.getElementById('printStockOut').innerHTML = data.stock_used.length > 0
            ? data.stock_used.map(s => `
                <div style="display:flex; justify-content:space-between;">
                    <span>- ${s.name}</span>
                    <span>${Number(s.total_qty).toLocaleString()} ${s.unit}</span>
                </div>
            `).join('')
            : '<p style="font-style:italic; font-size: 0.8rem;">Tidak ada pemakaian bahan</p>';

        // Stock Adjustments
        const adjustEl = document.getElementById('printStockAdjust');
        if (adjustEl) {
            adjustEl.innerHTML = data.stock_adjust && data.stock_adjust.length > 0
                ? data.stock_adjust.map(s => {
                    const absDiff = Math.abs(Number(s.total_qty));
                    const threshold = (s.name || '').toLowerCase().includes('cup') ? 2 : 50;
                    const manualAnomaly = (s.notes || '').includes('[ANOMALY');
                    const isAnomaly = absDiff > threshold || manualAnomaly;
                    const isResolved = s.all_resolved === 1;
                    const qty = Number(s.total_qty);
                    const sign = qty > 0 ? '+' : '';

                    let color = '#555';
                    let bg = '';
                    let statusLabel = '';

                    if (isResolved) {
                        color = '#2e7d32'; // Success color
                        statusLabel = '<b style="font-size:0.6rem; color:#2e7d32;">[RESOLVED]</b> ';
                    } else if (isAnomaly) {
                        color = '#d32f2f';
                        bg = 'background: #ffebee; border-left: 3px solid #d32f2f; padding-left: 5px;';
                        statusLabel = '<b style="color:#d32f2f">ANOMALY:</b> ';
                    }

                    const resolveBtn = (isAnomaly && !isResolved)
                        ? `<button onclick="resolveAnomalyGroup('${s.opname_ids}')" class="no-print" style="font-size: 0.6rem; margin-left:10px; cursor:pointer; background:none; border:1px solid #d32f2f; color:#d32f2f; border-radius:3px; padding: 2px 5px;">Bereskan</button>`
                        : '';

                    return `
                    <div style="display:flex; justify-content:space-between; color: ${color}; ${bg} margin-bottom: 2px;">
                        <span style="font-size: 0.8rem;">~ ${statusLabel}${s.name}${resolveBtn}</span>
                        <span style="font-weight:bold; font-size: 0.8rem;">${sign}${qty.toLocaleString()} ${s.unit}</span>
                    </div>
                `;
                }).join('')
                : '<p style="font-style:italic; font-size: 0.8rem;">Tidak ada penyesuaian</p>';
        }

        // Final Inventory Status
        const invEl = document.getElementById('printInventory');
        if (invEl) {
            invEl.innerHTML = data.inventory.map(m => {
                const lowStock = m.stock <= 100;
                return `
                    <div style="display:flex; justify-content:space-between; ${lowStock ? 'color:red; font-weight:bold;' : ''}">
                        <span>${m.name}</span>
                        <span>${Number(m.stock).toLocaleString()} ${m.unit}</span>
                    </div>
                `;
            }).join('');
        }

        // Handle Pending Sales in Print Preview
        const pendingArea = document.getElementById('printPendingArea');
        const pendingList = document.getElementById('printPendingSales');
        if (data.pending_sales && data.pending_sales.length > 0) {
            pendingArea.style.display = 'block';
            pendingList.innerHTML = data.pending_sales.map(s => `
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <span>- ${s.customer_name}</span>
                    <span style="font-weight:bold;">Rp ${Number(s.total).toLocaleString()}</span>
                </div>
            `).join('') + `
                <div style="text-align:right; border-top:1px dashed #000; margin-top:5px; padding-top:5px;">
                    <span style="font-weight:bold; color:#d32f2f; font-size: 0.85rem;">Total Piutang: Rp ${data.pending_sales.reduce((sum, s) => sum + Number(s.total), 0).toLocaleString()}</span>
                </div>
            `;
        } else {
            pendingArea.style.display = 'none';
        }
    }

    const shiftLabel = reportShift == 1 ? "PAGI (06:00 - 17:00)" : "MALAM (17:00 - 03:00)";
    document.getElementById('printTimestamp').innerText = `Shift: ${shiftLabel}\nTanggal: ${reportDate} | Jam: ${new Date().toLocaleTimeString('id-ID')}`;
    document.getElementById('printStaffName').innerText = currentUser ? currentUser.username : '-';

    // Reset report layout
    document.getElementById('printArea').classList.remove('two-column');
    document.getElementById('colBtnText').innerText = "2 Kolom";

    document.getElementById('printModal').style.display = 'block';
}

function toggleReportColumns() {
    const printArea = document.getElementById('printArea');
    const btnText = document.getElementById('colBtnText');
    const isTwoCol = printArea.classList.toggle('two-column');
    btnText.innerText = isTwoCol ? "1 Kolom" : "2 Kolom";
}

function closePrintPreview() {
    document.getElementById('printModal').style.display = 'none';
}

function printReport() {
    window.print();
}

function exportToPDF(btn) {
    if (typeof html2pdf === 'undefined') {
        alert('Maaf, fitur PDF belum siap. Mohon refresh halaman dan coba lagi.');
        return;
    }

    const originalText = btn.innerHTML;
    btn.innerHTML = '⌛ MENYIAPKAN...';
    btn.disabled = true;

    // Tunggu sebentar agar UI tombol berubah sebelum proses berat dimulai
    setTimeout(() => {
        const element = document.getElementById('printContent');
        const standFilterEl = document.getElementById('reportStandFilter');
        const standName = standFilterEl?.options[standFilterEl.selectedIndex]?.text || 'Laporan';
        const cleanName = standName.replace(/[^a-zA-Z0-9 ]/g, "").trim().replace(/\s+/g, "_");
        const dateInput = document.getElementById('reportDate');
        const date = dateInput ? dateInput.value : new Date().toISOString().split('T')[0];
        
        const opt = {
            margin:       10,
            filename:     `Laporan_${cleanName}_${date}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
                scale: 2, 
                useCORS: true, 
                backgroundColor: '#ffffff',
                scrollY: 0
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Gunakan pattern .then() untuk kompatibilitas lebih baik
        html2pdf().set(opt).from(element).save().then(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            if (typeof refreshIcons === 'function') refreshIcons();
        }).catch(err => {
            console.error('PDF Error:', err);
            alert('Gagal membuat PDF. Coba gunakan tombol Cetak Laporan lalu pilih Save as PDF.');
            btn.innerHTML = originalText;
            btn.disabled = false;
            if (typeof refreshIcons === 'function') refreshIcons();
        });
    }, 100);
}

function printReceiptFromBrowser() {
    window.print();
}

// --- Pending Orders Logic ---
let pendingSalesData = [];

async function loadPendingSales() {
    try {
        const res = await fetch('/api/sales/pending');
        const result = await res.json();
        if (result.success) {
            pendingSalesData = result.data;
            renderPendingTable(pendingSalesData);
        }
    } catch (error) {
        console.error('Error loading pending sales:', error);
    }
}

function renderPendingTable(data) {
    const tbody = document.getElementById('pendingOrdersBody');
    tbody.innerHTML = data.map(s => `
        <tr>
            <td style="font-size: 0.85rem;">${new Date(s.created_at).toLocaleDateString('id-ID')}</td>
            <td style="font-weight: bold; color: var(--accent);">${new Date(s.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</td>
            <td style="font-size: 0.85rem; font-weight: 600;">${s.staff_name || '-'}</td>
            <td style="font-weight: 600;">${s.customer_name || 'PELANGGAN UMUM'}</td>
            <td style="font-size: 0.9rem; color: var(--text-muted); max-width: 250px;">${s.items_summary || '-'}</td>
            <td>
                <div style="color: var(--danger); font-size: 0.75rem; font-weight: 800; margin-bottom: 2px;">🔴 BELUM BAYAR</div>
                <div style="color: var(--accent); font-weight: bold;">Rp ${Number(s.total).toLocaleString()}</div>
            </td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="category-btn" onclick="openPaymentModal('${s.id}', ${s.total})" style="background: #27ae60; color: white; border: none; padding: 6px 12px; font-size: 0.85rem; font-weight: bold;">💳 Bayar</button>
                    <button class="category-btn" onclick="openBill('${s.id}')" style="background: #8e44ad; color: white; border: none; padding: 6px 12px; font-size: 0.85rem;">➕ Menu</button>
                    <button class="category-btn" onclick="previewReceipt('${s.id}')" title="Preview Struk" style="background: var(--glass); padding: 6px 10px; color: var(--accent);">
                        <i data-lucide="eye" style="width: 14px;"></i>
                    </button>
                    <button class="category-btn" onclick="reprintSale('${s.id}')" title="Cetak Struk" style="background: var(--glass); padding: 6px 10px;">
                        <i data-lucide="printer" style="width: 14px;"></i>
                    </button>
                    ${(currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'OWNER')) ? `
                    <button class="category-btn" onclick="deleteSale('${s.id}')" title="Hapus Pesanan" style="background: var(--danger); padding: 6px 10px; color: white; border: none;">
                        <i data-lucide="trash-2" style="width: 14px;"></i>
                    </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
    refreshIcons();
}

function openPaymentModal(salesId, total) {
    const modal = document.getElementById('paymentModal');
    document.getElementById('paymentAmountText').innerText = `Rp ${Number(total).toLocaleString()}`;

    document.getElementById('btnPayCash').onclick = () => {
        modal.style.display = 'none';
        payPending(salesId, 'CASH');
    };

    document.getElementById('btnPayQRIS').onclick = () => {
        modal.style.display = 'none';
        payPending(salesId, 'QRIS');
    };

    modal.style.display = 'flex';
}

function filterPending() {
    const query = document.getElementById('searchPending').value.toLowerCase();
    const filtered = pendingSalesData.filter(s =>
        s.customer_name.toLowerCase().includes(query) ||
        s.invoice_number.toLowerCase().includes(query)
    );
    renderPendingTable(filtered);
}

async function payPending(salesId, method) {
    if (!confirm(`Konfirmasi pelunasan dengan ${method}?`)) return;

    try {
        const res = await fetch(`/api/sales/complete/${salesId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payment_method: method })
        });
        const result = await res.json();
        if (result.success) {
            // NEW: Handle QRIS response for Pending payment
            if (result.qris) {
                // Find total from local data if possible, or just use what we have in modal text
                const total = document.getElementById('paymentAmountText').innerText.replace(/[^0-9]/g, '');
                // Find invoice number from current view
                const sale = pendingSalesData.find(s => s.id === salesId);
                showQRISModal(result.qris, total, sale?.invoice_number || 'PENDING');
                return;
            }

            alert('Pembayaran Berhasil Dilunasi!');
            if (result.print?.isCloud || document.getElementById('checkPrint').checked) {
                previewReceipt(salesId);
            }
            loadPendingSales();
        }
    } catch (error) {
        alert('Gagal memproses pembayaran.');
    }
}

async function deleteSale(salesId, isReport = false) {
    const msg = isReport 
        ? 'Apakah Anda yakin ingin menghapus transaksi ini? Stok akan dikembalikan dan data keuangan akan disesuaikan.' 
        : 'Apakah Anda yakin ingin menghapus pesanan pending ini? Stok yang telah terpotong akan dikembalikan ke sistem.';
    
    if (!confirm(msg)) return;

    try {
        const res = await fetch(`/api/sales/${salesId}`, {
            method: 'DELETE'
        });
        const result = await res.json();
        if (result.success) {
            alert('Penghapusan Berhasil!');
            if (isReport) {
                loadReportData();
                if (activePage === 'owner') loadOwnerData();
            } else {
                loadPendingSales();
            }
        } else {
            alert('Gagal menghapus: ' + result.message);
        }
    } catch (error) {
        alert('Terjadi kesalahan saat menghapus data.');
    }
}

async function openBill(salesId) {
    const sale = pendingSalesData.find(s => s.id === salesId);
    if (!sale) return;

    if (!confirm(`Tambahkan menu baru ke bill "${sale.customer_name}"?`)) return;

    // Transition to Kasir page
    switchPage('kasir');

    // Set UI state for Open Bill
    cart = []; // Start with new items only
    document.getElementById('customerName').value = sale.customer_name;
    document.getElementById('customerName').disabled = true;

    const btnBox = document.querySelector('.checkout-area');
    const originalBtn = document.getElementById('btnCheckout');
    originalBtn.style.display = 'none';

    // Add temporary Update Bill button
    const updateBtn = document.createElement('button');
    updateBtn.id = 'btnUpdateBill';
    updateBtn.className = 'btn-checkout';
    updateBtn.style.background = '#8e44ad';
    updateBtn.innerText = 'Update Bill (Tambah Menu)';
    updateBtn.onclick = async () => {
        if (cart.length === 0) return alert('Pilih menu terlebih dahulu!');

        try {
            const res = await fetch(`/api/sales/update-items/${salesId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart.map(item => ({
                        product_id: item.id,
                        qty: item.qty,
                        price: item.price
                    }))
                })
            });
            const result = await res.json();
            if (result.success) {
                alert('Bill berhasil diperbarui!');
                // Reset UI
                cart = [];
                updateCart();
                document.getElementById('customerName').value = '';
                document.getElementById('customerName').disabled = false;
                updateBtn.remove();
                originalBtn.style.display = 'block';
                switchPage('pending');
            }
        } catch (e) {
            alert('Gagal update bill.');
        }
    };

    // Add cancel button
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'category-btn';
    cancelBtn.style.width = '100%';
    cancelBtn.style.marginTop = '10px';
    cancelBtn.innerText = 'Batal Tambah Menu';
    cancelBtn.onclick = () => {
        cart = [];
        updateCart();
        document.getElementById('customerName').value = '';
        document.getElementById('customerName').disabled = false;
        updateBtn.remove();
        cancelBtn.remove();
        originalBtn.style.display = 'block';
    };

    btnBox.appendChild(updateBtn);
    btnBox.appendChild(cancelBtn);

    updateCart();
}

// --- VIRTUAL KEYBOARD LOGIC ---
let vkTarget = null;
let vkShift = false;

function initVK() {
    // Select all existing and future inputs
    document.addEventListener('focusin', (e) => {
        if (e.target.tagName === 'INPUT' && !['checkbox', 'radio', 'submit', 'button'].includes(e.target.type)) {
            const type = (e.target.id === 'loginPin' || e.target.type === 'number' || e.target.id === 'opnameQty') ? 'NUM' : 'QWERTY';
            showVK(e.target, type);
        }
    });

    // Prevent losing focus when clicking keys
    const panel = document.getElementById('vkPanel');
    if (panel) {
        panel.addEventListener('mousedown', e => e.preventDefault());
    }
}

function showVK(target, type) {
    // Check if VK is enabled in settings
    if (window.appSettings && window.appSettings.virtual_keyboard === 'OFF') {
        return;
    }

    vkTarget = target;
    const panel = document.getElementById('vkPanel');
    const title = document.getElementById('vkTitle');

    if (title) {
        title.innerText = (type === 'NUM') ? 'NUMERIC PAD' : 'QWERTY KEYBOARD';
    }
    renderVK(type);
    panel.classList.add('show');
}

function hideVK() {
    const panel = document.getElementById('vkPanel');
    if (panel) panel.classList.remove('show');
    vkTarget = null;
}

function renderVK(type) {
    const content = document.getElementById('vkContent');
    if (!content) return;

    if (type === 'NUM') {
        content.innerHTML = `
            <div class="numpad-grid">
                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '.', 'DEL'].map(k => `
                    <button class="vk-key numpad-key ${k === 'DEL' ? 'backspace' : ''}" onclick="pressVK('${k}', 'NUM')">
                        ${k === 'DEL' ? '<i data-lucide="delete"></i>' : k}
                    </button>
                `).join('')}
                <button class="vk-key numpad-key action" style="grid-column: span 3" onclick="hideVK()">SELESAI</button>
            </div>
        `;
    } else {
        const rows = [
            ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
            ['SHIFT', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'DEL'],
            ['SPACE', 'DONE']
        ];

        content.innerHTML = rows.map(row => `
            <div class="vk-row">
                ${row.map(k => {
            let cls = 'vk-key';
            let label = k;
            if (k === 'SHIFT') {
                cls += ' wide action';
                if (vkShift) cls += ' active';
                label = '<i data-lucide="arrow-up-circle"></i>';
            }
            if (k === 'DEL') {
                cls += ' wide backspace';
                label = '<i data-lucide="delete"></i>';
            }
            if (k === 'SPACE') {
                cls += ' space';
                label = 'SPASI';
            }
            if (k === 'DONE') {
                cls += ' wide action';
                label = 'OK';
            }

            const displayVal = (vkShift && k.length === 1) ? k.toUpperCase() : label;
            return `<button class="${cls}" onclick="pressVK('${k}', 'QWERTY')">${displayVal}</button>`;
        }).join('')}
            </div>
        `).join('');
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function pressVK(k, type) {
    if (!vkTarget) return;

    if (k === 'DEL') {
        vkTarget.value = vkTarget.value.slice(0, -1);
    } else if (k === 'SHIFT') {
        vkShift = !vkShift;
        renderVK('QWERTY');
        return;
    } else if (k === 'DONE') {
        hideVK();
        vkTarget.blur();
    } else if (k === 'SPACE') {
        vkTarget.value += ' ';
    } else {
        let val = k;
        if (type === 'QWERTY' && vkShift) val = k.toUpperCase();
        vkTarget.value += val;
    }

    // Trigger input event manually
    vkTarget.dispatchEvent(new Event('input'));
}

// --- SYSTEM LOGIC ---
async function confirmShutdown() {
    // First Confirmation
    if (!confirm('Apakah Anda yakin ingin mematikan tablet ini?')) {
        return;
    }

    // Second Confirmation (Double check to prevent misclicks)
    if (!confirm('PERINGATAN TERAKHIR: Semua aplikasi akan ditutup dan tablet akan mati. Lanjutkan shutdown?')) {
        return;
    }

    try {
        const shutdownRes = await fetch('/api/system/shutdown', { method: 'POST' });
        const shutdownResult = await shutdownRes.json();

        if (shutdownResult.success) {
            alert(shutdownResult.message);
        } else {
            alert('Gagal mengirim perintah shutdown.');
        }
    } catch (e) {
        alert('Gagal menghubungi server.');
    }
}

async function resolveAnomaly(id) {
    const pin = prompt("Masukkan PIN Owner/Admin untuk verifikasi:");
    if (!pin) return;

    try {
        const res = await fetch(`/api/stock/opname/resolve/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin })
        });
        const result = await res.json();
        if (result.success) {
            alert(`Berhasil diselesaikan oleh ${result.resolved_by}`);
            loadReportData();
            fetchOpnameHistory();
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert("Gagal menghubungi server");
    }
}

async function resolveAnomalyGroup(idsStr) {
    const ids = idsStr.split(',');
    const pin = prompt("Konfirmasi penyelesaian SEMUA anomali di item ini.\nMasukkan PIN Owner:");
    if (!pin) return;

    try {
        let successCount = 0;
        let lastUser = '';
        for (const id of ids) {
            const res = await fetch(`/api/stock/opname/resolve/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin })
            });
            const result = await res.json();
            if (result.success) {
                successCount++;
                lastUser = result.resolved_by;
            }
        }
        if (successCount > 0) {
            alert(`Berhasil menyelesaikan ${successCount} data anomali oleh ${lastUser}`);
            loadReportData();
            fetchOpnameHistory();
        }
    } catch (error) {
        alert("Terjadi kesalahan saat proses massal");
    }
}

// --- EXPENSE REPORT LOGIC ---
function toggleExpenseFields() {
    const type = document.getElementById('expenseType').value;
    const materialDiv = document.getElementById('materialSelection');
    const descriptionDiv = document.getElementById('otherDescription');
    const nameInput = document.getElementById('expenseItemName');

    if (type === 'BAHAN_BAKU') {
        materialDiv.style.display = 'block';
        descriptionDiv.style.display = 'none';
        nameInput.placeholder = "Sabun, Kopi, dll";
    } else {
        materialDiv.style.display = 'none';
        descriptionDiv.style.display = 'block';
        nameInput.placeholder = "Contoh: Sabun Cuci...";
    }
}

function previewImage(input) {
    const preview = document.getElementById('imgPreview');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        reader.readAsDataURL(input.files[0]);
    }
}

async function loadExpenseMaterials() {
    const res = await fetch('/api/stock/materials');
    const result = await res.json();
    const select = document.getElementById('expenseMaterialId');

    if (result.success) {
        select.innerHTML = result.data.map(m => `
            <option value="${m.id}">${m.name} (${m.unit})</option>
        `).join('');
    }
}

async function submitExpense() {
    const type = document.getElementById('expenseType').value;
    const materialId = document.getElementById('expenseMaterialId').value;
    const itemName = document.getElementById('expenseItemName').value;
    const qty = document.getElementById('expenseQty').value;
    const amount = document.getElementById('expenseAmount').value;
    const imgInput = document.getElementById('expenseImage');

    if (!amount) return alert('Harap isi jumlah pengeluaran');
    if (type === 'LAINNYA' && !itemName) return alert('Harap isi deskripsi pengeluaran');
    if (type === 'BAHAN_BAKU' && !qty) return alert('Harap isi jumlah barang');

    let imageBase64 = null;
    if (imgInput.files && imgInput.files[0]) {
        const reader = new FileReader();
        imageBase64 = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(imgInput.files[0]);
        });
    }

    try {
        const res = await fetch('/api/expenses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUser ? currentUser.id : null,
                type: type,
                item_id: type === 'BAHAN_BAKU' ? materialId : null,
                item_name: type === 'LAINNYA' ? itemName : null,
                qty: qty || 0,
                amount: amount,
                image_base64: imageBase64
            })
        });

        const result = await res.json();
        if (result.success) {
            alert('Laporan belanja berhasil disimpan!');
            document.getElementById('expenseForm').reset();
            document.getElementById('imgPreview').style.display = 'none';
            loadExpenseHistory(); // Refresh riwayat di samping
        } else {
            alert('Gagal simpan: ' + result.error);
        }
    } catch (e) {
        console.error('Submit Expense Error:', e);
        alert('Kesalahan koneksi saat menyimpan laporan: ' + e.message);
    }
}

async function loadExpenseFilters() {
    const staffFilter = document.getElementById('expenseStaffFilter');
    if (staffFilter.options.length > 1) return;

    // Set default dates for custom range
    document.getElementById('expenseStartDate').value = dayjs().subtract(7, 'day').format('YYYY-MM-DD');
    document.getElementById('expenseEndDate').value = dayjs().format('YYYY-MM-DD');

    try {
        const res = await fetch('/api/auth/full-users');
        const result = await res.json();
        if (result.success) {
            result.data.forEach(u => {
                const opt = document.createElement('option');
                opt.value = u.id;
                opt.innerText = u.username;
                staffFilter.appendChild(opt);
            });
        }
    } catch (e) {
        console.error('Failed to load expense filters:', e);
    }
}

function toggleExpenseDateRange() {
    const range = document.getElementById('expenseRangeFilter').value;
    const customDiv = document.getElementById('expenseCustomRange');
    customDiv.style.display = (range === 'custom') ? 'flex' : 'none';
    loadExpenseHistory();
}

async function loadExpenseHistory() {
    const range = document.getElementById('expenseRangeFilter').value;
    const userId = document.getElementById('expenseStaffFilter').value;
    const startDate = document.getElementById('expenseStartDate').value;
    const endDate = document.getElementById('expenseEndDate').value;

    try {
        let url = `/api/expenses/history?range=${range}&userId=${userId}`;
        if (range === 'custom') {
            url += `&startDate=${startDate}&endDate=${endDate}`;
        }
        const res = await fetch(url);
        const result = await res.json();
        const tbody = document.getElementById('expenseHistoryBody');
        const totalDisplay = document.getElementById('totalExpenseAmount');

        if (result.success) {
            let total = 0;
            tbody.innerHTML = result.data.map(e => {
                const amountVal = Number(e.amount || 0);
                total += amountVal;
                return `
                <tr>
                    <td>${dayjs(e.created_at).format('HH:mm')} ${range !== 'today' ? `<br><small style="color:var(--text-muted);">${dayjs(e.created_at).format('DD/MM')}</small>` : ''}</td>
                    <td>${e.type === 'BAHAN_BAKU' ? e.material_name : e.item_name}</td>
                    <td style="font-weight: bold; color: var(--accent);">${e.staff_name || '-'}</td>
                    <td>${e.qty || '-'}</td>
                    <td>${formatIDR(amountVal)}</td>
                    <td style="display: flex; gap: 8px;">
                        ${e.image_url ? `
                            <button class="category-btn" onclick="viewExpenseImage('${e.image_url}')" title="Lihat Bukti" style="padding: 6px; background: var(--surface); border: 1px solid var(--glass); display: inline-flex; align-items: center; justify-content: center;">
                                <i data-lucide="eye" style="width: 16px; height: 16px;"></i>
                            </button>
                        ` : ''}
                        ${(!e.is_edited && (currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'OWNER'))) ? `
                            <button class="category-btn" onclick="editExpense('${e.id}', ${e.qty}, ${e.amount})" style="padding: 4px 10px; font-size: 0.75rem; background: var(--accent); color: var(--secondary); font-weight: bold;">
                                EDIT
                            </button>
                        ` : ''}
                        ${(currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'OWNER')) ? `
                            <button class="category-btn" onclick="deleteExpense('${e.id}')" title="Hapus Data" style="padding: 6px; background: var(--glass); display: inline-flex; align-items: center; justify-content: center; color: var(--danger); border: 1px solid var(--glass);">
                                <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
                            </button>
                        ` : ''}
                        ${(e.is_edited) ? '<span style="color: var(--text-muted); font-size: 0.7rem; align-items: center; display: flex;">Edited</span>' : ''}
                    </td>
                </tr>
            `;
            }).join('');

            totalDisplay.innerText = formatIDR(total);
            if (typeof refreshIcons === 'function') refreshIcons();
        }
    } catch (e) {
        console.error('Load Expense History Error:', e);
    }
}

async function viewExpenseImage(url) {
    const modal = document.getElementById('imageModal');
    const img = document.getElementById('modalImage');
    img.src = url;
    modal.style.display = 'flex';
}

async function editExpense(id, currentQty, currentAmount) {
    const newQty = prompt("Masukkan Jumlah/Qty yang benar:", currentQty);
    if (newQty === null) return;
    const newAmount = prompt("Masukkan Total Harga yang benar:", currentAmount);
    if (newAmount === null) return;

    try {
        const res = await fetch(`/api/expenses/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ qty: newQty, amount: newAmount })
        });
        const result = await res.json();
        if (result.success) {
            alert(result.message);
            loadExpenseHistory();
        } else {
            alert(result.message);
        }
    } catch (e) {
        alert("Gagal mengedit data");
    }
}

async function deleteExpense(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus data belanja ini? Jika ini adalah bahan baku, stok gudang akan disesuaikan kembali.')) return;

    try {
        const res = await fetch(`/api/expenses/${id}`, {
            method: 'DELETE'
        });
        const result = await res.json();
        if (result.success) {
            alert(result.message);
            loadExpenseHistory();
            if (activePage === 'gudang') loadGudangData();
        } else {
            alert(result.message);
        }
    } catch (e) {
        alert("Gagal menghapus data");
    }
}

async function loadGudangData() {
    const res = await fetch('/api/expenses/warehouse');
    const result = await res.json();
    const tbody = document.getElementById('gudangStockBody');
    if (result.success) {
        tbody.innerHTML = result.data.map(m => `
            <tr>
                <td style="font-weight: bold;">${m.name}</td>
                <td style="color: var(--accent); font-size: 1.1rem; font-weight: bold;">${m.stock}</td>
                <td>${m.unit}</td>
                <td style="color: var(--text-muted); font-weight: bold;">${m.last_staff || '-'}</td>
                <td style="font-size: 0.8rem; color: var(--text-muted);">${dayjs(m.updated_at).format('DD/MM/YYYY HH:mm')}</td>
                <td>
                    ${m.last_image ? `
                        <button class="category-btn" onclick="viewExpenseImage('${m.last_image}')" style="padding: 6px 12px; font-size: 0.8rem;">
                            <i data-lucide="eye" style="width: 16px; margin-right: 5px;"></i> Nota
                        </button>
                    ` : '-'}
                </td>
            </tr>
        `).join('');
        refreshIcons();
    }
}

// --- Owner Dashboard Logic ---
let financeChartInstance = null;
let expenseCircleChartInstance = null;

async function loadOwnerData() {
    try {
        // Populate Stands Dropdown if empty
        const standFilterEl = document.getElementById('ownerStandFilter');
        if (standFilterEl && standFilterEl.options.length <= 1) {
            const standsRes = await fetch('/api/stands');
            const standsData = await standsRes.json();
            if (standsData.success) {
                standsData.data.forEach(s => {
                    const opt = document.createElement('option');
                    opt.value = s.id;
                    opt.innerText = `🏢 ${s.name}`;
                    standFilterEl.appendChild(opt);
                });
            }
        }

        const filter = document.getElementById('ownerReportFilter')?.value || 'day';
        const standId = standFilterEl?.value || 'ALL';
        
        const res = await fetch(`/api/reports/owner/summary?filter=${filter}&stand_id=${standId}`);
        const result = await res.json();
        if (!result.success) return alert('Gagal memuat data owner: ' + result.error);

        const data = result.data;
        const { today, chart } = data;

        const labels = {
            'day': '(Hari Ini)',
            'week': '(7 Hari Terakhir)',
            'month': '(Bulan Ini)'
        };
        const standName = standId === 'ALL' ? 'Semua Stand' : standFilterEl.options[standFilterEl.selectedIndex].text;
        const currentLabel = `${labels[filter] || '(Hari Ini)'} - ${standName}`;
        
        document.getElementById('labelTotalRevenue').innerText = `Total Omset ${currentLabel}`;
        document.getElementById('labelTotalExpense').innerText = `Total Pengeluaran ${currentLabel}`;
        document.getElementById('labelProfit').innerText = `Estimasi Keuntungan ${currentLabel}`;

        // 1. Update Summary Cards
        document.getElementById('ownerTotalRevenue').innerText = `Rp ${Number(today.revenue.total_revenue).toLocaleString()}`;
        document.getElementById('ownerCashRevenue').innerText = `Rp ${Number(today.revenue.cash_revenue).toLocaleString()}`;
        document.getElementById('ownerQRISRevenue').innerText = `Rp ${Number(today.revenue.qris_revenue).toLocaleString()}`;

        document.getElementById('ownerTotalExpense').innerText = `Rp ${Number(today.expense.total_expense).toLocaleString()}`;
        document.getElementById('ownerMaterialExpense').innerText = `Rp ${Number(today.expense.raw_material).toLocaleString()}`;
        document.getElementById('ownerSalaryExpense').innerText = `Rp ${Number(today.expense.salary).toLocaleString()}`;

        const profit = today.profit;
        const profitEl = document.getElementById('ownerProfit');
        profitEl.innerText = `Rp ${Number(profit).toLocaleString()}`;
        profitEl.style.color = profit >= 0 ? 'var(--success)' : 'var(--danger)';

        // 2. Render Finance Trend Chart (Line Chart)
        const ctxFinance = document.getElementById('financeChart').getContext('2d');
        if (financeChartInstance) financeChartInstance.destroy();
        financeChartInstance = new Chart(ctxFinance, {
            type: 'line',
            data: {
                labels: chart.map(c => c.date),
                datasets: [
                    {
                        label: 'Pemasukan',
                        data: chart.map(c => c.income),
                        borderColor: '#E4A853',
                        backgroundColor: 'rgba(228, 168, 83, 0.2)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Pengeluaran',
                        data: chart.map(c => c.expense),
                        borderColor: '#ff5f5f',
                        backgroundColor: 'rgba(255, 95, 95, 0.2)',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#E0E0E0' } }
                },
                scales: {
                    x: { ticks: { color: '#B0B0B0' } },
                    y: { ticks: { color: '#B0B0B0' }, grid: { color: 'rgba(255,255,255,0.05)' } }
                }
            }
        });

        // 3. Render Expense Allocation (Doughnut Chart)
        const ctxCircle = document.getElementById('expenseCircleChart').getContext('2d');
        if (expenseCircleChartInstance) expenseCircleChartInstance.destroy();

        const expData = [
            Number(today.expense.raw_material || 0),
            Number(today.expense.salary || 0),
            Number(today.expense.others || 0)
        ];

        expenseCircleChartInstance = new Chart(ctxCircle, {
            type: 'doughnut',
            data: {
                labels: ['Bahan Baku', 'Gaji', 'Lainnya'],
                datasets: [{
                    data: expData,
                    backgroundColor: ['#E4A853', '#67ff9e', '#ff5f5f'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });

        // 4. Expense List Breakdown
        const listEl = document.getElementById('ownerExpenseList');
        const total = today.expense.total_expense || 1; // avoid div by zero
        listEl.innerHTML = `
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <span>📦 Bahan Baku</span>
                <b>Rp ${Number(today.expense.raw_material).toLocaleString()} (${((today.expense.raw_material / total) * 100).toFixed(0)}%)</b>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <span>👥 Gaji Karyawan</span>
                <b>Rp ${Number(today.expense.salary).toLocaleString()} (${((today.expense.salary / total) * 100).toFixed(0)}%)</b>
            </div>
            <div style="display:flex; justify-content:space-between;">
                <span>📝 Operasional Lain</span>
                <b>Rp ${Number(today.expense.others).toLocaleString()} (${((today.expense.others / total) * 100).toFixed(0)}%)</b>
            </div>
        `;

    } catch (e) {
        console.error(e);
        alert('Gagal memuat dashboard owner.');
    }
}

// --- QRIS Exchange Shortcut ---
function openExchangeModal() {
    document.getElementById('exchangeAmount').value = '';
    document.getElementById('exchangeModal').style.display = 'flex';
}

async function submitExchangeShortcut() {
    const amount = parseInt(document.getElementById('exchangeAmount').value);
    if (!amount || amount <= 0) return alert('Masukkan nominal yang valid!');
    if (amount > 20000) return alert('Maksimal nominal tukar adalah Rp 20,000!');

    if (!confirm(`Konfirmasi simpan catatan tukar QRIS senilai Rp ${amount.toLocaleString()}?`)) return;

    try {
        const payload = {
            invoice_number: `EXC-${Date.now()}`,
            items: [], // No products for exchange-only record
            total: 0,
            payment_method: 'QRIS',
            customer_name: 'TUKAR QRIS KE TUNAI',
            payment_status: 'PAID',
            should_print: false,
            qris_exchange: amount,
            creator_id: currentUser.id
        };

        const response = await fetch('/api/sales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (result.success) {
            alert('Catatan tukar QRIS berhasil disimpan!');
            document.getElementById('exchangeModal').style.display = 'none';
            // Refresh dashboard report data
            if (typeof loadReportData === 'function') loadReportData();
        } else {
            alert('Gagal: ' + result.error);
        }
    } catch (e) {
        console.error(e);
        alert('Terjadi kesalahan koneksi.');
    }
}

// --- Global Helpers ---
function formatIDR(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount).replace('Rp', 'Rp ');
}

// --- Barista & Salary Management ---
let editingShiftId = null;
let salaryHidden = false;

function toggleSalaryVisibility() {
    salaryHidden = !salaryHidden;
    const icon = document.getElementById('hideSalaryIcon');
    const text = document.getElementById('hideSalaryText');
    if (salaryHidden) {
        icon.setAttribute('data-lucide', 'eye');
        text.innerText = 'Show Angka Gaji';
    } else {
        icon.setAttribute('data-lucide', 'eye-off');
        text.innerText = 'Hide Angka Gaji';
    }
    lucide.createIcons();
    renderAttendanceLog();
}

async function openBaristaModal() {
    document.getElementById('baristaModal').style.display = 'flex';
    editingShiftId = null;

    document.getElementById('manualShiftIn').value = dayjs().format('YYYY-MM-DDTHH:mm');
    document.getElementById('manualShiftOut').value = dayjs().format('YYYY-MM-DDTHH:mm');

    try {
        const userRes = await fetch('/api/auth/full-users');
        const userData = await userRes.json();
        const ratesList = document.getElementById('baristaRatesList');
        const userSelect = document.getElementById('manualShiftUser');

        if (userData.success) {
            ratesList.innerHTML = userData.data.map(u => `
                <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 12px; border: 1px solid var(--glass-border);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span style="font-weight: 800; font-size: 1rem; color: var(--text);">${u.username}</span>
                        <span style="font-size: 0.65rem; color: var(--primary-light); background: rgba(150, 114, 89, 0.2); padding: 2px 8px; border-radius: 4px; font-weight: bold;">${u.role}</span>
                    </div>
                    
                    <div style="display: flex; gap: 10px; margin-bottom: 12px;">
                        <div style="position: relative; flex: 1;">
                            <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 0.8rem; color: var(--text-muted);">Rp/Min</span>
                            <input type="number" id="rate_${u.id}" value="${u.rate_per_minute || 0}" 
                                class="payment-dropdown" style="background-image: none; padding-left: 55px; height: 40px; font-size: 1rem; width: 100%; font-weight: bold; color: var(--accent);">
                        </div>
                        <button class="category-btn" onclick="saveUserRate('${u.id}')" 
                                style="padding: 0 15px; background: var(--accent); color: var(--secondary); border: none; font-weight: 800; font-size: 0.8rem; border-radius: 10px;">SET</button>
                    </div>

                    ${u.role !== 'ADMIN' && u.role !== 'OWNER' ? `
                    <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(228, 168, 83, 0.05); border-radius: 8px; border: 1px solid rgba(228,168,83,0.1);">
                        <input type="checkbox" id="perm_${u.id}" ${u.allow_off_schedule ? 'checked' : ''} 
                            onchange="toggleLoginPermission('${u.id}', this.checked)"
                            style="width: 18px; height: 18px; cursor: pointer;">
                        <label for="perm_${u.id}" style="font-size: 0.75rem; color: var(--accent); cursor: pointer; font-weight: bold;">Izin Login Luar Jadwal</label>
                    </div>
                    ` : ''}
                </div>
            `).join('');

            userSelect.innerHTML = userData.data.map(u => `
                <option value="${u.id}">${u.username}</option>
            `).join('');

            const userFilter = document.getElementById('attendanceUserFilter');
            userFilter.innerHTML = '<option value="">Semua Kasir</option>' + userData.data.map(u => `
                <option value="${u.id}">${u.username}</option>
            `).join('');
        }
        renderAttendanceLog();
    } catch (e) {
        console.error(e);
        alert('Gagal memuat manajemen barista.');
    }
}

async function renderAttendanceLog() {
    try {
        const daysRange = document.getElementById('attendanceRange').value;
        const userFilterId = document.getElementById('attendanceUserFilter').value;

        const attRes = await fetch('/api/auth/attendance');
        const attData = await attRes.json();
        const shiftLog = document.getElementById('baristaShiftLog');
        const totalUnpaidDisplay = document.getElementById('totalUnpaidSalary');

        if (attData.success) {
            // Client-side filtering
            let filtered = attData.data;
            const cutoffDate = dayjs().subtract(parseInt(daysRange), 'day').startOf('day');

            filtered = filtered.filter(a => dayjs(a.clock_in).isAfter(cutoffDate));
            if (userFilterId) {
                filtered = filtered.filter(a => a.user_id === userFilterId);
            }

            const sortedData = filtered.sort((a, b) => new Date(b.clock_in) - new Date(a.clock_in));

            let totalUnpaid = 0;

            if (sortedData.length === 0) {
                shiftLog.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px; color: var(--text-muted);">Belum ada riwayat shift</td></tr>';
            } else {
                shiftLog.innerHTML = sortedData.map(a => {
                    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                    const dayName = days[new Date(a.clock_in).getDay()];
                    const salaryValue = Number(a.salary_earned || 0);
                    const displaySalary = salaryHidden ? '****' : formatIDR(salaryValue);

                    if (!a.is_paid && a.clock_out) {
                        totalUnpaid += salaryValue;
                    }

                    const payIcon = a.is_paid ? 'check-circle' : 'circle';
                    const payColor = a.is_paid ? 'var(--success)' : 'var(--text-muted)';
                    const payLabel = a.is_paid ? 'PAID' : 'UNPAID';

                    return `
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.03); transition: background 0.2s; ${a.is_paid ? 'opacity: 0.6;' : ''}" onmouseover="this.style.background='rgba(255,255,255,0.01)'" onmouseout="this.style.background='transparent'">
                        <td style="padding: 15px 10px; font-weight: 800; color: var(--text);">${a.staff_name}</td>
                        <td style="padding: 15px 10px; font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">
                            <span style="color: var(--primary-light);">${dayName}</span><br>${dayjs(a.clock_in).format('DD/MM HH:mm')}
                        </td>
                        <td style="padding: 15px 10px; font-size: 0.8rem; color: var(--text-muted);">
                            ${a.clock_out ? dayjs(a.clock_out).format('DD/MM HH:mm') : '<span style="background: var(--success)22; color: var(--success); padding: 2px 8px; border-radius: 4px; font-weight: 800; font-size: 0.7rem;">AKTIF</span>'}
                        </td>
                        <td style="padding: 15px 10px; color: var(--accent); font-weight: 800; font-size: 1rem;">
                            ${displaySalary}
                            ${!salaryHidden && (a.overtime_reward > 0 || a.late_penalty > 0) ? `
                                <div style="display: flex; gap: 5px; margin-top: 4px;">
                                    ${a.overtime_reward > 0 ? `<span style="font-size: 0.65rem; background: var(--success)22; color: var(--success); padding: 1px 4px; border-radius: 3px;">+${(a.overtime_reward).toLocaleString()}</span>` : ''}
                                    ${a.late_penalty > 0 ? `<span style="font-size: 0.65rem; background: var(--danger)22; color: var(--danger); padding: 1px 4px; border-radius: 3px;">-${(a.late_penalty).toLocaleString()}</span>` : ''}
                                </div>
                            ` : ''}
                        </td>
                        <td style="padding: 15px 10px;">
                            <div onclick="togglePaymentStatus('${a.id}', ${a.is_paid || 0})" style="cursor: pointer; display: flex; align-items: center; gap: 8px; color: ${payColor}; font-weight: 800; font-size: 0.75rem; background: ${a.is_paid ? 'var(--success)11' : 'rgba(255,255,255,0.05)'}; padding: 6px 12px; border-radius: 20px; width: fit-content; transition: 0.2s; border: 1px solid ${a.is_paid ? 'var(--success)44' : 'transparent'};" onmouseover="this.style.background='${a.is_paid ? 'var(--success)22' : 'rgba(255,255,255,0.1)'}'">
                                <i data-lucide="${payIcon}" style="width: 16px;"></i> ${payLabel}
                            </div>
                        </td>
                        <td style="padding: 15px 10px;">
                            <div style="display: flex; gap: 8px;">
                                <button onclick="inputOvertime('${a.id}', ${a.overtime_reward || 0}, '${a.clock_in}', '${a.clock_out}')" title="Input Lembur" style="background: var(--success); filter: brightness(0.8); border: none; color: var(--bg); cursor: pointer; width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: 0.2s;" onmouseover="this.style.filter='brightness(1)'" onmouseout="this.style.filter='brightness(0.8)'"><i data-lucide="plus" style="width:16px;"></i></button>
                                <button onclick="inputLate('${a.id}', ${a.late_penalty || 0}, '${a.clock_in}', '${a.clock_out}')" title="Input Potongan Telat" style="background: var(--danger); filter: brightness(0.8); border: none; color: white; cursor: pointer; width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: 0.2s;" onmouseover="this.style.filter='brightness(1)'" onmouseout="this.style.filter='brightness(0.8)'"><i data-lucide="minus" style="width:16px;"></i></button>
                                <button onclick="editShiftManual('${a.id}', '${a.user_id}', '${a.clock_in}', '${a.clock_out}')" title="Edit Shift" style="background: var(--glass); border: 1px solid var(--glass-border); color: var(--text-muted); cursor: pointer; width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: 0.2s;" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--text-muted)'"><i data-lucide="edit-2" style="width:14px;"></i></button>
                                <button onclick="deleteShift('${a.id}')" title="Hapus Shift" style="background: var(--glass); border: 1px solid var(--glass-border); color: var(--text-muted); cursor: pointer; width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: 0.2s;" onmouseover="this.style.color='var(--danger)'" onmouseout="this.style.color='var(--text-muted)'"><i data-lucide="trash-2" style="width:14px;"></i></button>
                            </div>
                        </td>
                    </tr>
                `
                }).join('');
            }
            totalUnpaidDisplay.innerHTML = `Belum Dibayar: <span style="font-size: 1.2rem; color: var(--success);">${formatIDR(totalUnpaid)}</span>`;
            if (typeof refreshIcons === 'function') refreshIcons();
        }
    } catch (e) { console.error(e); }
}

async function syncAllSalaries() {
    if (!confirm('Ini akan menghitung ulang seluruh log shift berdasarkan Rate Gaji yang aktif sekarang. Lanjutkan?')) return;
    try {
        const res = await fetch('/api/auth/attendance/sync', { method: 'POST' });
        const result = await res.json();
        if (result.success) {
            alert('Hasil sinkronisasi: Seluruh data log telah diperbarui sesuai rate aktif.');
            renderAttendanceLog();
            if (activePage === 'owner') loadOwnerData();
        }
    } catch (e) { alert('Gagal sinkronisasi'); }
}

async function togglePaymentStatus(id, currentStatus) {
    try {
        const res = await fetch(`/api/auth/attendance/${id}/pay`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isPaid: !currentStatus })
        });
        const result = await res.json();
        if (result.success) {
            renderAttendanceLog();
        }
    } catch (e) { alert('Gagal memperbarui status pembayaran'); }
}

async function submitManualShift() {
    const userId = document.getElementById('manualShiftUser').value;
    const clockIn = document.getElementById('manualShiftIn').value;
    const clockOut = document.getElementById('manualShiftOut').value;
    if (!clockIn || !clockOut) return alert('Jam masuk dan pulang harus diisi!');
    try {
        let url = '/api/auth/attendance/manual';
        let method = 'POST';
        let body = { userId, clockIn, clockOut };
        if (editingShiftId) {
            url = `/api/auth/attendance/${editingShiftId}`;
            method = 'PUT';
            body = { clockIn, clockOut };
        }
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const result = await res.json();
        if (result.success) {
            alert(result.message);
            editingShiftId = null;
            renderAttendanceLog();
            if (activePage === 'owner') loadOwnerData();
        } else alert(result.message);
    } catch (e) { alert('Gagal menyimpan shift.'); }
}

function editShiftManual(id, userId, cin, cout) {
    editingShiftId = id;
    document.getElementById('manualShiftUser').value = userId;
    document.getElementById('manualShiftIn').value = dayjs(cin).format('YYYY-MM-DDTHH:mm');
    if (cout && cout !== 'null') {
        document.getElementById('manualShiftOut').value = dayjs(cout).format('YYYY-MM-DDTHH:mm');
    }
    alert('Mode Edit Aktif. Silakan ubah waktu dan klik Simpan.');
}

async function deleteShift(id) {
    if (!confirm('Anda yakin ingin menghapus data shift ini?')) return;
    try {
        const res = await fetch(`/api/auth/attendance/${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (result.success) {
            renderAttendanceLog();
            if (activePage === 'owner') loadOwnerData();
        }
    } catch (e) { alert('Gagal menghapus data.'); }
}

async function inputOvertime(id, current, cin, cout) {
    const amount = prompt(" Tambahkan Bonus Lembur (Nominal Rp):", current);
    if (amount === null) return;
    try {
        const res = await fetch(`/api/auth/attendance/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                overtimeReward: parseFloat(amount),
                clockIn: cin,
                clockOut: cout === 'null' ? new Date().toISOString() : cout
            })
        });
        const result = await res.json();
        if (result.success) {
            renderAttendanceLog();
            if (activePage === 'owner') loadOwnerData();
        }
    } catch (e) { alert('Gagal input lembur'); }
}

async function inputLate(id, current, cin, cout) {
    const amount = prompt(" Masukkan Potongan Terlambat (Nominal Rp):", current);
    if (amount === null) return;
    try {
        const res = await fetch(`/api/auth/attendance/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                latePenalty: parseFloat(amount),
                clockIn: cin,
                clockOut: cout === 'null' ? new Date().toISOString() : cout
            })
        });
        const result = await res.json();
        if (result.success) {
            renderAttendanceLog();
            if (activePage === 'owner') loadOwnerData();
        }
    } catch (e) { alert('Gagal input potongan'); }
}

async function saveUserRate(userId) {
    const rate = document.getElementById(`rate_${userId}`).value;
    if (!rate || rate < 0) return alert('Masukkan rate yang valid!');
    try {
        const res = await fetch('/api/auth/update-rate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, rate: parseFloat(rate) })
        });
        const result = await res.json();
        if (result.success) {
            alert('Rate gaji berhasil diperbarui!');
            openBaristaModal();
            if (activePage === 'owner') loadOwnerData();
        }
    } catch (e) { alert('Gagal menyimpan rate.'); }
}

async function toggleLoginPermission(userId, allow) {
    try {
        const res = await fetch('/api/auth/toggle-login-permission', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, allow })
        });
        const result = await res.json();
        if (!result.success) alert('Gagal memperbarui izin.');
    } catch (e) { alert('Terjadi kesalahan.'); }
}

// Init on load
init();
switchPage('kasir'); // Default page


let products = [];
let cart = [];
let currentCategory = 'Semua';
let currentUser = null;
let currentAttendanceId = null;
let pendingVoid = null;
let activePage = 'kasir';

// Mock data for initial visual (if DB is empty)
const mockProducts = [
    { id: '1', name: 'Es Kopi Susu Aren', price: 18000, category: 'Milk Based', img: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=300&h=300&auto=format&fit=crop' },
    { id: '2', name: 'Americano', price: 15000, category: 'Espresso Based', img: 'assets/img/americano.jpg' },
    { id: '3', name: 'V60 Gayo', price: 25000, category: 'Manual Brew', img: 'https://images.unsplash.com/photo-1544787210-22c1ec479ec5?q=80&w=300&h=300&auto=format&fit=crop' },
    { id: '4', name: 'Matcha Latte', price: 22000, category: 'Non-Coffee', img: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=300&h=300&auto=format&fit=crop' },
    { id: '5', name: 'Caramel Macchiato', price: 28000, category: 'Milk Based', img: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=300&h=300&auto=format&fit=crop' },
    { id: '6', name: 'French Fries', price: 15000, category: 'Snack', img: 'https://images.unsplash.com/photo-1630384066272-11751df163cc?q=80&w=300&h=300&auto=format&fit=crop' },
    { id: '7', name: 'Croissant', price: 20000, category: 'Snack', img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=300&h=300&auto=format&fit=crop' }
];

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
    // Load persisted session from localStorage
    const savedUser = localStorage.getItem('gc_currentUser');
    const savedAttendance = localStorage.getItem('gc_attendanceId');

    if (savedUser && savedAttendance) {
        currentUser = JSON.parse(savedUser);
        currentAttendanceId = savedAttendance;
    }

    // Show login modal if not logged in
    if (!currentUser) {
        document.getElementById('loginModal').style.display = 'flex';
    } else {
        document.getElementById('loginModal').style.display = 'none';
        const staffName = currentUser.username.toUpperCase();
        document.getElementById('sidebarUser').innerText = staffName;
        document.getElementById('headerStaffKasir').innerText = staffName;
        document.getElementById('headerStaffPending').innerText = staffName;
        console.log(`Session restored: ${currentUser.username}`);
    }

    await fetchProducts();
    await fetchUsers(); // Fetch users from DB
    await loadAppSettings(); // Load system settings
    setupCategoryListeners();
    renderProducts();

    initTheme(); // Load saved theme
    initVK(); // Initialize virtual keyboard

    // Show/hide settings based on role
    updateSidebarVisibility();

    refreshIcons();
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
        const response = await fetch('/api/products');
        const data = await response.json();
        products = data.length > 0 ? data : mockProducts;
    } catch (error) {
        console.error('Fetcher error:', error);
        products = mockProducts;
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
        .then(data => {
            if (data.success) {
                currentUser = data.user;
                currentAttendanceId = data.attendance_id;

                // Persist session
                localStorage.setItem('gc_currentUser', JSON.stringify(currentUser));
                localStorage.setItem('gc_attendanceId', currentAttendanceId);

                document.getElementById('loginModal').style.display = 'none';
                document.getElementById('loginPin').value = '';
                const staffName = currentUser.username.toUpperCase();
                document.getElementById('sidebarUser').innerText = staffName;
                document.getElementById('headerStaffKasir').innerText = staffName;
                document.getElementById('headerStaffPending').innerText = staffName;

                // Show/hide owner menu
                updateSidebarVisibility();

                alert(`Absen Masuk Berhasil! Selamat bekerja, ${currentUser.username}!`);
            } else {
                alert(data.message);
            }
        });
}

function updateSidebarVisibility() {
    const navSettings = document.getElementById('navSettings');
    if (navSettings) {
        navSettings.style.display = (currentUser && currentUser.role === 'ADMIN') ? 'flex' : 'none';
    }
}

async function logout() {
    if (currentAttendanceId && confirm('Konfirmasi Absen Pulang (Logout)?')) {
        await fetch('/api/auth/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ attendance_id: currentAttendanceId })
        });

        // Clear session
        currentUser = null;
        currentAttendanceId = null;
        localStorage.removeItem('gc_currentUser');
        localStorage.removeItem('gc_attendanceId');

        document.getElementById('loginModal').style.display = 'flex';
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
            id: item.id, // for printer service if it needs name etc
            name: item.name,
            product_id: item.id,
            qty: item.qty,
            price: item.price
        })),
        total: cart.reduce((sum, item) => sum + (item.price * item.qty), 0), // Removed 1.1 multiplier (0% tax)
        payment_method: paymentMethod,
        customer_name: customerName,
        payment_status: paymentStatus,
        should_print: shouldPrint
    };

    try {
        const response = await fetch('/api/sales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...payload, creator_id: currentUser.id })
        });

        const result = await response.json();
        if (result.success) {
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
        } else {
            alert('Gagal: ' + result.error);
        }
    } catch (error) {
        alert('Terjadi kesalahan koneksi ke server.');
    }
});

// --- Navigation Logic ---
function switchPage(page) {
    activePage = page;
    const pages = {
        'kasir': document.getElementById('kasirPage'),
        'stok': document.getElementById('stokPage'),
        'report': document.getElementById('reportPage'),
        'pending': document.getElementById('pendingPage'),
        'bms': document.getElementById('bmsPage'),
        'system': document.getElementById('systemPage'),
        'settings': document.getElementById('settingsPage'),
        'belanja': document.getElementById('belanjaPage'),
        'gudang': document.getElementById('gudangPage')
    };

    const cartSection = document.getElementById('cartSection');
    const navItems = {
        'kasir': document.getElementById('navKasir'),
        'stok': document.getElementById('navStok'),
        'report': document.getElementById('navReport'),
        'pending': document.getElementById('navPending'),
        'bms': document.getElementById('navBMS'),
        'system': document.getElementById('navSystem'),
        'settings': document.getElementById('navSettings'),
        'gudang': document.getElementById('navGudang')
    };

    // Access Control
    if (page === 'settings' && (!currentUser || currentUser.role !== 'ADMIN')) {
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

    // Cart visibility
    cartSection.style.display = (page === 'kasir') ? 'flex' : 'none';

    // Page-specific loaders
    if (page === 'kasir') renderProducts();
    if (page === 'stok') loadStokData();
    if (page === 'report') loadReportData();
    if (page === 'pending') loadPendingSales();
    if (page === 'bms') loadBMSData();
    if (page === 'settings') loadActivityLogs();
    if (page === 'belanja') {
        loadExpenseMaterials();
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

            // Sync to Settings Page UI if it's open (or just always sync)
            const uiDefaultPrint = document.getElementById('settingDefaultPrint');
            const uiShowShutdown = document.getElementById('settingShowShutdown');
            if (uiDefaultPrint) uiDefaultPrint.checked = settings.default_print === 'ON';
            if (uiShowShutdown) uiShowShutdown.checked = settings.show_shutdown === 'ON';
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

// --- BMS Logic ---
async function loadBMSData() {
    try {
        const response = await fetch('/api/bms/devices');
        const result = await response.json();

        if (result.success) {
            const devices = result.data || []; // Handle data format from API
            if (!Array.isArray(devices)) return;

            // 1. Update Core Stats (Watts, Temp, Water)
            const kwh = devices.find(d => d.category === 'ELECTRIC');
            const temp = devices.find(d => d.category === 'HVAC' && d.type === 'SENSOR');
            const water = devices.find(d => d.category === 'WATER');

            if (kwh) document.querySelector('#bmsPage .report-grid .card:nth-child(1) h2').innerHTML = `${kwh.current_value} <span style="font-size: 1rem; color: var(--text-muted);">${kwh.unit}</span>`;
            if (temp) document.querySelector('#bmsPage .report-grid .card:nth-child(2) h2').innerHTML = `${temp.current_value} <span style="font-size: 1rem; color: var(--text-muted);">°${temp.unit === 'Celsius' ? 'C' : temp.unit}</span>`;
            if (water) document.querySelector('#bmsPage .report-grid .card:nth-child(3) h2').innerHTML = `${water.current_value} <span style="font-size: 1rem; color: var(--text-muted);">${water.unit}</span>`;

            // 2. Render Lighting/Actuator Controls
            const actuators = devices.filter(d => d.type === 'ACTUATOR');
            const controlContainer = document.querySelector('#bmsPage .card:first-of-type div[style*="flex-direction: column"]');

            if (controlContainer && actuators.length > 0) {
                controlContainer.innerHTML = actuators.map(d => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: var(--glass); border-radius: 12px;">
                        <div style="display: flex; gap: 15px; align-items: center;">
                            <i data-lucide="${d.category === 'LIGHTING' ? 'lightbulb' : 'wind'}" style="color: ${d.current_value === 'ON' ? 'var(--accent)' : 'var(--text-muted)'};"></i>
                            <span>${d.name}</span>
                        </div>
                        <button class="category-btn ${d.current_value === 'ON' ? 'active' : ''}" 
                                onclick="toggleBMSDevice('${d.id}', '${d.current_value === 'ON' ? 'OFF' : 'ON'}')" 
                                style="padding: 5px 15px;">
                            ${d.current_value}
                        </button>
                    </div>
                `).join('');
            }

            // 3. Render Health Table
            const tableBody = document.querySelector('#bmsPage table.data-table tbody');
            if (tableBody) {
                tableBody.innerHTML = devices.map(d => `
                    <tr>
                        <td>${d.name}</td>
                        <td><span style="color: ${d.is_active ? 'var(--success)' : 'var(--danger)'};">● ${d.is_active ? 'Active' : 'Offline'}</span></td>
                        <td>${d.type === 'SENSOR' ? '92%' : '-'}</td>
                    </tr>
                `).join('');
            }

            refreshIcons();
        }
    } catch (error) {
        console.error('BMS Fetch Error:', error);
    }
}

async function toggleBMSDevice(id, newValue) {
    try {
        const response = await fetch(`/api/bms/devices/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: newValue })
        });
        const result = await response.json();
        if (result.success) {
            loadBMSData(); // Refresh UI
        }
    } catch (error) {
        alert('Gagal mengontrol perangkat BMS');
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

    try {
        // 1. Fetch Daily (Selected Shift)
        const dailyRes = await fetch(`/api/reports/daily?date=${selectedDate}&shift=${selectedShift}`);
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
                            </div>
                        </td>
                    </tr>`).join('');
                refreshIcons();
            }
        }

        // 2. Fetch Weekly/Monthly Summary
        try {
            const [weeklyRes, monthlyRes] = await Promise.all([
                fetch('/api/reports/weekly'),
                fetch('/api/reports/monthly')
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

    // Fetch fresh daily data for payment breakdown
    const response = await fetch(`/api/reports/daily?date=${reportDate}&shift=${reportShift}`);
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

    if (type === 'BAHAN_BAKU') {
        materialDiv.style.display = 'block';
        descriptionDiv.style.display = 'none';
    } else {
        materialDiv.style.display = 'none';
        descriptionDiv.style.display = 'block';
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

async function loadExpenseHistory() {
    const res = await fetch('/api/expenses/today');
    const result = await res.json();
    const tbody = document.getElementById('expenseHistoryBody');
    if (result.success) {
        tbody.innerHTML = result.data.map(e => `
            <tr>
                <td>${dayjs(e.created_at).format('HH:mm')}</td>
                <td>${e.type === 'BAHAN_BAKU' ? e.material_name : e.item_name}</td>
                <td style="font-weight: bold; color: var(--accent);">${e.staff_name || '-'}</td>
                <td>${e.qty || '-'}</td>
                <td>Rp ${Number(e.amount).toLocaleString()}</td>
                <td style="display: flex; gap: 8px;">
                    ${e.image_url ? `
                        <button class="category-btn" onclick="viewExpenseImage('${e.image_url}')" style="padding: 6px; background: var(--surface); border: 1px solid var(--glass); display: inline-flex; align-items: center; justify-content: center;">
                            <i data-lucide="eye" style="width: 16px; height: 16px;"></i>
                        </button>
                    ` : ''}
                    ${!e.is_edited ? `
                        <button class="category-btn" onclick="editExpense('${e.id}', ${e.qty}, ${e.amount})" style="padding: 4px 10px; font-size: 0.75rem; background: var(--accent); color: var(--secondary); font-weight: bold;">
                            EDIT
                        </button>
                    ` : '<span style="color: var(--text-muted); font-size: 0.7rem;">Edited</span>'}
                </td>
            </tr>
        `).join('');
        refreshIcons();
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

// Init on load
init();
switchPage('kasir'); // Default page

